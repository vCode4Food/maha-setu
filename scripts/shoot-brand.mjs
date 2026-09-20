import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'

const EXE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5173'
const OUT = 'public/__verify'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()

// 1. Login page — auth navbar with logo + name + tagline
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' })
await sleep(400)
await page.screenshot({ path: `${OUT}/brand-login.png` })
console.log('login: navbar =', await page.$eval('a[href="/"]', (a) => a.innerText.replace(/\n/g, ' / ')))

// 2. Register page
await page.goto(`${BASE}/register`, { waitUntil: 'networkidle2' })
await sleep(400)
await page.screenshot({ path: `${OUT}/brand-register.png` })
console.log('register: navbar =', await page.$eval('a[href="/"]', (a) => a.innerText.replace(/\n/g, ' / ')))

// 3. Citizen portal topbar (login through the demo flow)
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' })
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Use Demo Account'))
  b?.click()
})
await sleep(250)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Verify & Continue'))
  b?.click()
})
await page.waitForFunction(() => /\b\d{6}\b/.test(document.body.innerText), { timeout: 8000 })
const otp = await page.evaluate(() => (document.body.innerText.match(/\b\d{6}\b/) || [])[0])
await page.evaluate((code) => {
  const i = document.querySelector('input')
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  i.focus()
  set.call(i, code)
  i.dispatchEvent(new Event('input', { bubbles: true }))
}, otp)
await sleep(150)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /verify otp/i.test(x.textContent))
  b?.click()
})
await page.waitForFunction(() => location.pathname === '/citizen', { timeout: 10000 }).catch(async () => {
  const excerpt = await page.evaluate(() => document.body.innerText.slice(0, 300))
  console.log('LOGIN-STALL:', JSON.stringify(excerpt.replace(/\n+/g, ' | ')))
  throw new Error('did not reach /citizen')
})
await sleep(600)
await page.screenshot({ path: `${OUT}/brand-citizen.png` })
console.log('citizen: brand img =', await page.evaluate(() => {
  const im = document.querySelector('img[alt*="ahaSetu" i]')
  return im ? `${im.getAttribute('src')} ${im.naturalWidth}x${im.naturalHeight}` : 'NONE'
}))

await browser.close()
console.log('DONE')
