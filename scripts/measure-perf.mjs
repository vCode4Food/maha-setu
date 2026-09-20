import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'fs'

const EXE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5173'
const label = process.argv[2] ?? 'run'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 1000 },
})
const page = await browser.newPage()
const consoleErrors = []
page.on('pageerror', (e) => consoleErrors.push(e.message))

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
  ;[...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Use')?.click()
  const ins = document.querySelectorAll('input')
  const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  s.call(ins[0], otp); ins[0].dispatchEvent(new Event('input', { bubbles: true }))
  ;[...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Verify OTP')?.click()
}, otp)
await page.waitForFunction(() => location.pathname === '/citizen', { timeout: 30000 })
await sleep(2000)

// Install a long-task observer, then hammer the page with user activity for 12s.
await page.evaluate(() => {
  window.__longtasks = []
  window.__interactionCosts = []
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__longtasks.push({ dur: Math.round(e.duration), at: Math.round(e.startTime) })
    }).observe({ entryTypes: ['longtask'] })
  } catch { /* longtask unsupported */ }
})

// Phase 1: 12s of continuous activity (clicks/keys/scrolls drive the app's activity listeners)
const phase1Start = await page.evaluate(() => performance.now())
for (let i = 0; i < 40; i++) {
  await page.evaluate((i) => {
    window.dispatchEvent(new Event('scroll'))
    document.body.click()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
  }, i)
  await sleep(300)
}
const phase1 = await page.evaluate((t0) => {
  const tasks = window.__longtasks.filter((t) => t.at >= t0)
  return { longTasks: tasks.length, blockingMs: tasks.reduce((s, t) => s + Math.max(0, t.dur - 50), 0), worst: tasks.reduce((m, t) => Math.max(m, t.dur), 0) }
}, phase1Start)

// Phase 2: idle monitoring for 12s (nothing should be running)
await page.evaluate(() => { window.__longtasks = []; window.__idleStart = performance.now() })
await sleep(12000)
const phase2 = await page.evaluate(() => {
  return { longTasks: window.__longtasks.length, blockingMs: window.__longtasks.reduce((s, t) => s + Math.max(0, t.dur - 50), 0) }
})

// Phase 3: sidebar navigation click -> DOM update latency (5 hops, averaged)
const hops = []
for (const path of ['/citizen/services', '/citizen', '/citizen/applications', '/citizen', '/citizen/documents']) {
  const t = await page.evaluate((path) => {
    const start = performance.now()
    const link = [...document.querySelectorAll('a')].find((a) => a.getAttribute('href') === path)
    if (!link) return null
    link.click()
    return start
  }, path)
  if (t === null) continue
  await page.waitForFunction((p) => location.pathname === p, { timeout: 15000 }, path)
  const done = await page.evaluate(() => performance.now())
  hops.push(Math.round(done - t))
  await sleep(600)
}

const result = { label, activity: phase1, idle: phase2, navHopsMs: hops, consoleErrors }
writeFileSync(`public/__verify/perf-${label}.json`, JSON.stringify(result, null, 2))
console.log(JSON.stringify(result))
await browser.close()
