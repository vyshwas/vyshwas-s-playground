import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

// Exercise the built artifact under the same subdirectory used by GitHub Pages.
const dist = path.resolve('dist')
const prefix = '/vyshwas-s-playground/'
const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    )
    if (!pathname.startsWith(prefix)) {
      response.writeHead(404).end()
      return
    }
    const file = path.resolve(
      dist,
      pathname.slice(prefix.length) || 'index.html',
    )
    if (!file.startsWith(dist + path.sep)) {
      response.writeHead(403).end()
      return
    }
    const bytes = await readFile(file)
    response.setHeader(
      'Content-Type',
      mime[path.extname(file)] || 'application/octet-stream',
    )
    response.end(bytes)
  } catch {
    response.writeHead(404).end()
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = 'http://127.0.0.1:' + server.address().port + prefix
const out = path.resolve('.verification')
await mkdir(out, { recursive: true })
const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
})
const errors = [],
  checks = []
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const check = (name, condition) => {
  assert.ok(condition, name)
  checks.push(name)
  console.log('PASS ' + name)
}
const newPage = async (width = 1440, height = 900) => {
  const page = await browser.newPage()
  await page.setViewport({ width, height })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.url().startsWith(base) && response.status() >= 400)
      errors.push(response.status() + ' ' + response.url())
  })
  return page
}
const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready)
  await wait(120)
}
const at = async (page, target) => {
  await page.evaluate((target) => {
    const el =
      typeof target === 'string' ? document.querySelector(target) : null
    const anchor = el?.parentElement.classList.contains('pin-spacer')
      ? el.parentElement
      : el
    const y =
      target === '#hero'
        ? 0
        : anchor
          ? anchor.getBoundingClientRect().top + scrollY
          : target
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true })
    else window.scrollTo(0, y)
  }, target)
  await wait(80)
}
let page
try {
  page = await newPage()
  await page.goto(base, { waitUntil: 'networkidle2' })
  await settle(page)
  check(
    'GitHub Pages subdirectory serves the production app',
    (await page.title()) !== '',
  )
  check(
    'WebGL bundle is deferred on first viewport',
    await page.evaluate(
      () =>
        !performance
          .getEntriesByType('resource')
          .some((r) => /three-.*[.]js/.test(r.name)),
    ),
  )
  check(
    'One semantic page heading',
    await page.$$eval('h1', (headings) => headings.length === 1),
  )
  const end = await page.$eval(
    '#hero',
    (el) => el.parentElement.offsetHeight - el.offsetHeight,
  )
  check('CRT hero has real pin spacing', end > 900)
  const snapshot = () =>
    page.evaluate(() =>
      ['.hero-zoom-stage', '.hero-copy', '.hero-signal', '.hero-curtain'].map(
        (selector) => {
          const style = getComputedStyle(document.querySelector(selector))
          return [style.transform, style.opacity, style.visibility]
        },
      ),
    )
  const states = new Map()
  for (const fraction of [0, 0.2, 0.5, 0.8, 1]) {
    await at(page, end * fraction)
    states.set(fraction, await snapshot())
  }
  for (const fraction of [1, 0.8, 0.5, 0.2, 0]) {
    await at(page, end * fraction)
    assert.deepEqual(
      await snapshot(),
      states.get(fraction),
      'Reverse CRT state at ' + fraction,
    )
  }
  check('CRT scroll states are identical going down and back up', true)
  await page.click('.hero-actions button')
  await page.waitForFunction(
    () =>
      Math.abs(
        document.querySelector('#experiments').getBoundingClientRect().top - 88,
      ) < 3,
  )
  check('Primary CTA crosses the pinned hero and reaches work', true)
  check(
    'Work navigation state is current',
    await page.$eval(
      '.desktop-nav a[href="#experiments"]',
      (a) => a.getAttribute('aria-current') === 'location',
    ),
  )
  await page.click('.project-featured .project-art')
  await page.waitForSelector('dialog[open]')
  await wait(600)
  check(
    'Project workspace locks background scroll',
    await page.evaluate(
      () =>
        window.__lenis.isStopped &&
        document.documentElement.style.overflow === 'hidden',
    ),
  )
  await page.keyboard.press('Tab')
  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  check(
    'Keyboard focus stays inside the modal',
    await page.evaluate(() =>
      document.querySelector('dialog').contains(document.activeElement),
    ),
  )
  await page.click('.workspace-modes button:nth-child(2)')
  const frame = await (await page.waitForSelector('iframe')).contentFrame()
  await frame.waitForSelector('button[data-go="home"]')
  await frame.click('button[data-go="home"]')
  await frame.waitForSelector('#s-home.active')
  check('Awara prototype transitions from welcome to home', true)
  await frame.focus('button[data-go="create"]')
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('dialog'))
  check('Escape from inside an iframe closes the workspace', true)
  check(
    'Closing restores the gallery trigger and scroll',
    await page.evaluate(
      () =>
        document.activeElement.classList.contains('project-art') &&
        !window.__lenis.isStopped,
    ),
  )
  for (const name of ['nocturne', 'munim']) {
    await page.click('.project-' + name + ' .project-links button:nth-child(2)')
    await wait(600)
    const prototype = await (
      await page.waitForSelector('iframe')
    ).contentFrame()
    await prototype.waitForFunction(() => document.readyState === 'complete')
    check(
      name + ' prototype loads under the deployment path',
      await prototype.evaluate(
        () => document.body.innerText.trim().length > 100,
      ),
    )
    if (name === 'nocturne') {
      await prototype.click('#simOk')
      check(
        'Nocturne simulation state responds to input',
        await prototype.$eval(
          '#simOk',
          (el) => el.getAttribute('aria-pressed') === 'true',
        ),
      )
      await prototype.click('[data-act="jump"][data-id="pay"]')
      await prototype.waitForSelector('[data-act="cta"]')
      check(
        'Nocturne exposes an actionable checkout state',
        await prototype.$eval('[data-act="cta"]', (el) =>
          el.textContent.includes('Pay'),
        ),
      )
    } else {
      await prototype.click('[data-act="ask"]')
      await prototype.waitForSelector('[data-act="pin-jio"]')
      check('Munim opens a supervised payment request', true)
      await prototype.click('[data-act="back"]')
      await prototype.waitForSelector('[data-act="ask"]')
      check('Munim returns safely to its ledger', true)
    }
    await page.click('.workspace-close')
    await page.waitForFunction(() => !document.querySelector('dialog'))
  }
  for (const name of ['gamut', 'the-whole-fruit']) {
    await page.click('.project-' + name + ' .project-art')
    await wait(600)
    check(
      name + ' case study and external destination are available',
      await page.$eval('.case-actions a', (a) => a.href.startsWith('https://')),
    )
    await page.keyboard.press('Escape')
  }
  await at(page, '#lab')
  await page.waitForSelector('.particle-canvas')
  await page.waitForFunction(() =>
    document.querySelector('.lab-status').textContent.includes('LIVE'),
  )
  check('WebGL scene initializes near the viewport', true)
  for (const index of [3, 1, 0]) {
    await page.click('.phase-controls button:nth-child(' + (index + 1) + ')')
    await page.waitForFunction(
      (i) =>
        document
          .querySelectorAll('.phase-controls button')
          [i].getAttribute('aria-pressed') === 'true',
      {},
      index,
    )
    await wait(1400)
  }
  check('Lab phase controls work in both scroll directions', true)
  await at(page, '#system')
  await page.click('.principle:nth-child(3) button')
  check(
    'Principles expand with synchronized semantics',
    await page.$eval('#principle-2', (el) => !el.hidden),
  )
  await page.click('.principle:nth-child(3) button')
  check(
    'Principles collapse accessibly',
    await page.$eval('#principle-2', (el) => el.hidden),
  )
  await at(page, '#contact')
  await page.click('.contact-terminal summary')
  await page.type('#terminal-input', '<img src=x onerror=alert(1)>')
  await page.click('.contact-terminal button[type="submit"]')
  check(
    'Terminal treats commands as text',
    await page.$$eval('.terminal-output img', (images) => images.length === 0),
  )
  await page.type('#terminal-input', 'exit')
  await page.keyboard.press('Enter')
  check(
    'Terminal exit returns focus without navigation',
    await page.$eval(
      '.contact-terminal',
      (el) =>
        !el.open && el.querySelector('summary') === document.activeElement,
    ),
  )
  const pdf = await page.evaluate(async () => {
    const response = await fetch('./resume.pdf')
    const bytes = await response.arrayBuffer()
    return {
      status: response.status,
      header: new TextDecoder().decode(bytes.slice(0, 8)),
      size: bytes.byteLength,
    }
  })
  check(
    'Résumé serves a valid PDF under the deployment path',
    pdf.status === 200 && pdf.header.startsWith('%PDF') && pdf.size > 10000,
  )
  check(
    'Résumé exactly matches the repository source',
    Buffer.compare(
      await readFile('public/resume.pdf'),
      await readFile('Vishwash_Mehta.pdf'),
    ) === 0,
  )
  await page.click('.wordmark')
  await page.waitForFunction(() => scrollY < 1)
  await wait(100)
  check(
    'Smooth return to cover restores the unzoomed state',
    JSON.stringify(await snapshot()) === JSON.stringify(states.get(0)),
  )
  await page.screenshot({ path: out + '/desktop-hero.png' })
  await page.click('.motion-toggle')
  await page.waitForFunction(() => !window.__lenis)
  check(
    'Motion control removes pinning and smooth scroll',
    await page.$$eval('.pin-spacer', (els) => els.length === 0),
  )
  await page.click('.motion-toggle')
  await page.waitForFunction(() => !!window.__lenis)
  check('Motion can be restored in the same session', true)
  await page.close()

  page = await newPage(390, 844)
  await page.goto(base, { waitUntil: 'networkidle2' })
  await settle(page)
  await page.click('.mobile-toggle')
  await page.waitForSelector('.menu-dialog[open]')
  await wait(600)
  await page.keyboard.press('Escape')
  check(
    'Mobile navigation closes with Escape and restores focus',
    await page.evaluate(
      () =>
        !document.querySelector('dialog') &&
        document.activeElement.classList.contains('mobile-toggle'),
    ),
  )
  await page.click('.mobile-toggle')
  await wait(600)
  await page.click('.menu-dialog a[href="#experiments"]')
  await page.waitForFunction(
    () =>
      Math.abs(
        document.querySelector('#experiments').getBoundingClientRect().top - 88,
      ) < 3,
  )
  check(
    'Mobile menu navigates to work without retaining scroll lock',
    await page.evaluate(() => document.documentElement.style.overflow === ''),
  )
  await page.click('.project-featured .project-art')
  await wait(600)
  check(
    'Mobile drawer controls fit viewport',
    await page.evaluate(
      () => document.querySelector('dialog').scrollWidth <= innerWidth,
    ),
  )
  await page.screenshot({ path: out + '/mobile-drawer.png' })
  await page.keyboard.press('Escape')
  for (const width of [390, 320, 768]) {
    await page.setViewport({ width, height: 844 })
    await wait(200)
    for (const selector of [
      '#hero',
      '#experiments',
      '#lab',
      '#system',
      '#contact',
    ]) {
      await at(page, selector)
      check(
        width + 'px ' + selector + ' has no horizontal overflow',
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      )
    }
  }
  await page.setViewport({ width: 390, height: 844 })
  await wait(200)
  for (const [name, selector] of [
    ['hero', '#hero'],
    ['work', '#experiments'],
    ['contact', '#contact'],
    ['principles', '#system'],
  ]) {
    await at(page, selector)
    await page.screenshot({ path: out + '/mobile-' + name + '.png' })
  }
  await page.close()

  page = await newPage(390, 844)
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ])
  await page.goto(base, { waitUntil: 'networkidle2' })
  await settle(page)
  await at(page, '#lab')
  check(
    'Reduced motion uses native scroll, no pins, and a still lab',
    await page.evaluate(
      () =>
        !window.__lenis &&
        !document.querySelector('.pin-spacer') &&
        !document.querySelector('.particle-canvas') &&
        !!document.querySelector('.orbital-study'),
    ),
  )
  await page.click('.project-featured .project-art')
  await page.keyboard.press('Escape')
  check(
    'Reduced-motion drawer opens and closes correctly',
    await page.evaluate(() => !document.querySelector('dialog')),
  )
  await page.close()

  page = await newPage()
  await page.evaluateOnNewDocument(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args)
    }
  })
  await page.goto(base, { waitUntil: 'networkidle2' })
  await at(page, '#lab')
  await page.waitForFunction(() =>
    document.querySelector('.lab-status').textContent.includes('STILL STUDY'),
  )
  check(
    'Unavailable WebGL falls back to a usable still study',
    (await page.$('.orbital-study')) !== null,
  )
  check(
    'No uncaught runtime errors or missing local assets',
    errors.length === 0,
  )
  console.log('Verified ' + checks.length + ' checks. Screenshots: ' + out)
} catch (error) {
  await writeFile(
    path.join(out, 'failure.json'),
    JSON.stringify({ error: error.stack, checks, errors }, null, 2),
  )
  console.error(error)
  if (page && !page.isClosed())
    await page.screenshot({ path: out + '/failure.png' })
  console.error('Browser errors:', errors)
  throw error
} finally {
  await browser.close()
  server.close()
}
