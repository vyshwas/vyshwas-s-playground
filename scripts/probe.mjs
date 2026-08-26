import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'

const preview = spawn('npx', ['vite', 'preview', '--port', '4181', '--strictPort'], {
  cwd: process.cwd(), shell: true, stdio: 'pipe',
})
await new Promise((r) => setTimeout(r, 3500))

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:4181/', { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 2500))

const info = await page.evaluate(() => {
  const v = document.querySelector('.hero-video')
  const cs = getComputedStyle(v)
  const r = v.getBoundingClientRect()
  return {
    rect: { left: r.left, top: r.top, width: r.width, height: r.height },
    style: {
      position: cs.position, left: cs.left, top: cs.top, right: cs.right,
      width: cs.width, height: cs.height, objectFit: cs.objectFit,
      transform: cs.transform,
    },
    videoSize: { vw: v.videoWidth, vh: v.videoHeight },
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
preview.kill()
process.exit(0)
