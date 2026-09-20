import puppeteer from 'puppeteer-core'
import { mkdirSync, writeFileSync } from 'fs'

const EXE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5173'
const OUT = 'public/__verify'
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const findings = []

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 1000 },
})
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('PAGE-ERROR:', e.message))

// ---------- 1. Login: Maha ID -> password -> dynamic OTP ----------
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 60000 })
await page.waitForSelector('input', { timeout: 30000 })
await page.evaluate(() => {
  const ins = document.querySelectorAll('input')
  const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  s.call(ins[0], 'MS-CIT-1001'); ins[0].dispatchEvent(new Event('input', { bubbles: true }))
  s.call(ins[1], 'Citizen@2026'); ins[1].dispatchEvent(new Event('input', { bubbles: true }))
  ;[...document.querySelectorAll('button')].find((b) => /Verify & Continue/.test(b.textContent))?.click()
})
await page.waitForFunction(() => /Verify OTP/i.test(document.body.innerText), { timeout: 20000 })
const otp = await page.evaluate(() => document.body.innerText.match(/(\d{6})/)?.[1])
await page.evaluate((otp) => {
  [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Use')?.click()
  const ins = document.querySelectorAll('input')
  const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  s.call(ins[0], otp); ins[0].dispatchEvent(new Event('input', { bubbles: true }))
  ;[...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Verify OTP')?.click()
}, otp)
await page.waitForFunction(() => location.pathname === '/citizen', { timeout: 30000 })
await sleep(2500)
console.log('LOGIN ok, dynamic OTP', otp)

// ---------- shared measurement helpers ----------
const measureBand = (label, parentCls) => page.evaluate((label, parentCls) => {
  const leaves = [...document.querySelectorAll('*')].filter(
    (e) => e.children.length === 0 && e.textContent.trim() === label,
  )
  if (!leaves.length) return { error: `text "${label}" not found` }
  let el = leaves[0]
  while (el.parentElement && !String(el.parentElement.className).includes(parentCls)) el = el.parentElement
  if (!el.parentElement) return { error: `ancestor with "${parentCls}" not found` }
  const kids = [...el.parentElement.children].map((c) => {
    const r = c.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  })
  return { kids }
}, label, parentCls)

const stripAndOverflow = () => page.evaluate(() => {
  const labels = ['Citizens served', 'Applications', 'Live services', 'Seva Kendras']
  const res = labels.map((t) => {
    const el = [...document.querySelectorAll('div')].find((e) => e.children.length === 0 && e.textContent.trim() === t)
    if (!el) return { t, found: false }
    return { t, found: true, clipped: el.scrollWidth > el.clientWidth + 1, w: Math.round(el.getBoundingClientRect().width) }
  })
  const overflow = document.documentElement.scrollWidth > window.innerWidth
  return { res, overflow }
})

// ---------- 2. Citizen dashboard: horizontal band ----------
const dash = await measureBand('Nearby service centres', 'lg:grid-cols-5')
const dashStrip = await stripAndOverflow()
await page.screenshot({ path: `${OUT}/1-citizen-dashboard.png`, fullPage: true })
findings.push({ page: '/citizen', dash, strip: dashStrip })

// ---------- 3. Nearby page: full-width map ----------
await page.goto(`${BASE}/citizen/nearby`, { waitUntil: 'networkidle2', timeout: 60000 })
await page.waitForSelector('svg[role="img"]', { timeout: 30000 })
await sleep(1500)
const nearby = await page.evaluate(() => {
  const svg = document.querySelector('svg[role="img"]')
  const r = svg.getBoundingClientRect()
  const card = svg.closest('.rounded-2xl') ?? svg.parentElement
  const cr = card.getBoundingClientRect()
  return { svgW: Math.round(r.width), cardW: Math.round(cr.width), viewport: window.innerWidth }
})
const nearbyStrip = await stripAndOverflow()
await page.screenshot({ path: `${OUT}/2-nearby.png`, fullPage: true })
findings.push({ page: '/citizen/nearby', nearby, strip: nearbyStrip })

// ---------- 4. Landing: map section, two columns ----------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 })
await sleep(2000)
const section = await page.evaluateHandle(() => {
  const h = [...document.querySelectorAll('h2')].find((e) => e.textContent.includes('Service availability across Maharashtra'))
  return h ? h.closest('section') : null
})
const landing = await measureBand('Service availability across Maharashtra', 'lg:grid-cols-2')
await section.asElement().screenshot({ path: `${OUT}/3-landing-map.png` })
findings.push({ page: '/ (map section)', landing })

await browser.close()
writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 2))
console.log(JSON.stringify(findings, null, 2))
console.log('DONE')
