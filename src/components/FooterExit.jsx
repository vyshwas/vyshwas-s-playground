import { useEffect, useRef, useState } from 'react'
import { scrollToTarget } from '../lib/motion.js'
import Icon from './Icon.jsx'
const email = 'vyommehta197@gmail.com'
const replies = {
  help: 'whoami · work · principles · resume · email · clear · exit',
  whoami:
    'Vishwas Mehta. Strategic Product Designer & Design Engineer. Bengaluru, India.',
  principles:
    'Systems thinking before visual polish. Design that ships. Code that feels.',
  email,
  resume: 'Use the résumé link below to inspect or download the PDF.',
  work: 'Opening selected work…',
}
export default function FooterExit() {
  const [copyStatus, setCopyStatus] = useState('')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    {
      text: 'A little room for curiosity. Type help to explore.',
      type: 'output',
    },
  ])
  const terminal = useRef(null),
    output = useRef(null),
    timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setCopyStatus('Email copied')
    } catch {
      setCopyStatus('Copy unavailable. Select the email address to copy it.')
    }
    timer.current = setTimeout(() => setCopyStatus(''), 4000)
  }
  const execute = (e) => {
    e.preventDefault()
    const command = input.trim().toLowerCase()
    if (!command) return
    setInput('')
    if (command === 'clear') {
      setHistory([])
      return
    }
    if (command === 'exit') {
      terminal.current.open = false
      terminal.current.querySelector('summary').focus()
      return
    }
    setHistory((h) => [
      ...h.slice(-38),
      { text: '$ ' + input.trim(), type: 'input' },
      {
        text:
          replies[command] ||
          'Unknown command. Type help to see what is available.',
        type: 'output',
      },
    ])
    if (command === 'work') scrollToTarget('#experiments')
    requestAnimationFrame(() => {
      if (output.current) output.current.scrollTop = output.current.scrollHeight
    })
  }
  return (
    <footer
      id="contact"
      className="contact-section page-gutter"
      aria-labelledby="contact-heading"
    >
      <div className="contact-top">
        <span className="availability">
          <i className="status-dot" />
          Available for product design & design engineering roles
        </span>
        <span className="contact-location">
          Bengaluru · Remote · Relocation
        </span>
      </div>
      <h2 id="contact-heading">
        Let’s make
        <br />
        <em>it matter.</em>
      </h2>
      <div className="contact-main">
        <p>
          I bring strategic product thinking and hands-on engineering to
          ambitious teams. Have something worth building?
        </p>
        <div className="contact-actions">
          <a className="button button-dark" href={'mailto:' + email}>
            Email Vishwas <Icon name="external" />
          </a>
          <a
            className="button"
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View résumé <Icon name="external" />
          </a>
          <a
            className="text-link"
            href="./resume.pdf"
            download="Vishwas-Mehta-Resume.pdf"
          >
            Download PDF <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div className="contact-address">
        <a href={'mailto:' + email}>{email}</a>
        <button
          className="icon-button"
          onClick={copy}
          aria-label="Copy email address"
        >
          <Icon name="copy" />
        </button>
        <span className="copy-status" role="status">
          {copyStatus}
        </span>
      </div>
      <details className="contact-terminal" ref={terminal}>
        <summary>
          <span className="meta">~/playground</span>
          <span>For the curious</span>
          <Icon name="arrow" />
        </summary>
        <div
          className="terminal-output"
          ref={output}
          role="log"
          aria-label="Playground terminal output"
          data-lenis-prevent
        >
          {history.map((line, i) => (
            <p
              className={line.type === 'input' ? 'terminal-command' : ''}
              key={i}
            >
              {line.text}
            </p>
          ))}
        </div>
        <form onSubmit={execute}>
          <label htmlFor="terminal-input">Command</label>
          <input
            id="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            placeholder="Type help"
          />
          <button
            type="submit"
            className="icon-button"
            aria-label="Run command"
          >
            <Icon name="arrow" />
          </button>
        </form>
      </details>
      <div className="footer-bottom">
        <span>Designed & built by Vishwas Mehta</span>
        <div>
          <a
            href="https://linkedin.com/in/vyshwasmehta"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <Icon name="external" />
          </a>
          <a
            href="https://github.com/vyshwas"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <Icon name="external" />
          </a>
          <button onClick={() => scrollToTarget(0)}>
            Back to top <Icon name="arrow" />
          </button>
        </div>
      </div>
    </footer>
  )
}
