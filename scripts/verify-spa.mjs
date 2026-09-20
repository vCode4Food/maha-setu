import { createServer } from 'node:http'
import { promises as fs } from 'node:fs'
import { join, extname, normalize } from 'node:path'
import puppeteer from 'puppeteer-core'

const EXE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 4173
const ROOT = join(process.cwd(), 'dist')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.txt': 'text/plain',
}

/**
 * Minimal static host with a Vercel/Netlify-style SPA fallback:
 *  1. exact file match → serve it (assets, images, _redirects)
 *  2. /__verify/* without a file → plain 404 (excluded from rewrite)
 *  3. anything else → index.html (status 200, like `rewrites` with 200 semantics)
 */
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x')
    let pathname = decodeURIComponent(url.pathname)
    if (pathname.endsWith('/')) pathname += 'index.html'
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
    const file = join(ROOT, safe)
    if (file.startsWith(ROOT)) {
      try {
        const stat = await fs.stat(file)
        if (stat.isFile()) {
          res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
          fs.readFile(file).then((b) => res.end(b))
          return
        }
      } catch { /* fall through */ }
    }
    if (pathname.startsWith('/__verify')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Static 404 — not an SPA rewrite')
      return
    }
    const html = await fs.readFile(join(ROOT, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  } catch {
    res.writeHead(500); res.end()
  }
})

await new Promise((r) => server.listen(PORT, r))
console.log(`static host on :${PORT}`)

const browser = await puppeteer.launch({
  executablePath: EXE, headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()
const base = `http://localhost:${PORT}`
const results = []
const check = (name, pass, detail = '') => { results.push({ name, pass, detail }) }

// 1. Root serves the app
await page.goto(`${base}/`, { waitUntil: 'networkidle0' })
check('root serves app', (await page.title()).includes('MahaSetu'), await page.title())

// 2. Deep link works via SPA fallback (public route keeps its URL)
await page.goto(`${base}/services?q=pension`, { waitUntil: 'networkidle0' })
await sleep(300)
check('deep link /services?q=pension', await page.evaluate(() => location.pathname === '/services' && location.search === '?q=pension' && document.getElementById('root').children.length > 0))

// 2b. Protected deep link: SPA loads, then RBAC redirects to /login (router took over)
await page.goto(`${base}/citizen/documents`, { waitUntil: 'networkidle0' })
await sleep(400)
check('protected deep link → SPA loads, RBAC redirects', await page.evaluate(() => location.pathname === '/login'))

// 3. Unknown URL → branded 404 (not host 404)
await page.goto(`${base}/definitely/missing`, { waitUntil: 'networkidle0' })
await sleep(300)
const t404 = await page.evaluate(() => document.body.innerText)
check('unknown URL shows branded 404', t404.includes('wrong turn') && t404.includes('/definitely/missing'))
check('404 has search box + suggestions', await page.evaluate(() => !!document.querySelector('form[role="search"]')))

// 4. Assets under unknown-ish paths still win (exact files bypass rewrite)
const vault = await page.goto(`${base}/images/brand/mahasetu-mark.png`, { waitUntil: 'networkidle0' })
check('asset file served directly', vault.status() === 200 && vault.headers()['content-type'] === 'image/png')

// 5. /__verify exclusion — real files served, missing files give host 404
const gal = await page.goto(`${base}/__verify/`, { waitUntil: 'networkidle0' })
check('__verify gallery served as files', gal.status() === 200)
const miss = await page.goto(`${base}/__verify/nope.png`, { waitUntil: 'networkidle0' })
check('__verify missing file → host 404 (not SPA)', miss.status() === 404, String(miss.status()))

// 6. Trailing-slash path with file (gallery index)
await page.goto(`${base}/__verify/index.html`, { waitUntil: 'networkidle0' })
check('__verify/index.html direct', (await page.evaluate(() => document.images.length > 0)))

// 7. SPA client-side navigation still works after a fallback load
await page.goto(`${base}/services`, { waitUntil: 'networkidle0' })
await sleep(300)
await page.evaluate(() => { [...document.querySelectorAll('a')].find(a => a.getAttribute('href') === '/')?.click() })
await sleep(400)
check('client-side nav after fallback', await page.evaluate(() => location.pathname === '/'))

// 8. 404 audit logging still fires on static hosting
await page.goto(`${base}/audit-me/please`, { waitUntil: 'networkidle0' })
await sleep(300)
const audit = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mahasetu.routeAudit') || '[]'))
check('404 audit entry recorded', audit.some(e => e.path === '/audit-me/please' && e.kind === '404'))

console.log('\nResults:')
let fail = 0
for (const r of results) {
  console.log(` ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`)
  if (!r.pass) fail++
}
console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILED`)

await browser.close()
server.close()
process.exit(fail === 0 ? 0 : 1)
