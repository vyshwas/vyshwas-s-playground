import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const OUT = process.env.OPENTEEMP ?? 'C:/Users/vyshw/AppData/Local/Temp/opencode/pg-shots'
fs.mkdirSync(OUT, { recursive: true })

const preview = spawn('npx', ['vite', 'preview', '--port', '4180', '--strictPort'], {
  cwd: process.cwd(),
  shell: true,
  stdio: 'pipe',
})
await new Promise((res) => setTimeout(res, 3500))

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('response', (r) => {
  if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`)
})

await page.goto('http://localhost:4180/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 4000))

const totalH = await page.evaluate(() => document.documentElement.scrollHeight)
console.log('scrollHeight:', totalH)

const stops = [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1]
for (const s of stops) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round((totalH - 900) * s))
  await new Promise((r) => setTimeout(r, 1600))
  const name = `${OUT}/shot-${String(Math.round(s * 100)).padStart(3, '0')}.png`
  await page.screenshot({ path: name })
  console.log('saved', name)
}

// mobile pass
await page.setViewport({ width: 390, height: 844 })
await page.goto('http://localhost:4180/', { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 3000))
await page.screenshot({ path: `${OUT}/mobile-top.png` })
const mH = await page.evaluate(() => document.documentElement.scrollHeight)
await page.evaluate((y) => window.scrollTo(0, y), Math.round(mH * 0.5))
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/mobile-mid.png` })
console.log('mobile shots saved')

console.log('CONSOLE ERRORS:', errors.length ? errors : 'none')
await browser.close()
preview.kill()
process.exit(0)
