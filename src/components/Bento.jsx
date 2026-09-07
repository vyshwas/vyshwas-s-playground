import { useState } from 'react'
import Icon from './Icon.jsx'
const INK = 'var(--ink)'
const SLATE = 'var(--muted)'
function DiagramStack() {
  return (
    <svg viewBox="0 0 280 180" className="principle-diagram" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <path
          pathLength="1"
          className="draw"
          d="M60 120 L140 90 L220 120 L140 150 Z"
        />
        <path
          pathLength="1"
          className="draw"
          d="M60 90 L140 60 L220 90 L140 120 Z"
          opacity="0.65"
        />
        <path
          pathLength="1"
          className="draw"
          d="M60 60 L140 30 L220 60 L140 90 Z"
          opacity="0.35"
        />
        <path
          pathLength="1"
          className="draw"
          d="M140 90 L140 150"
          strokeDasharray="3 4"
        />
      </g>
      <g fill={INK}>
        <circle cx="140" cy="150" r="3" />
        <circle cx="140" cy="120" r="3" opacity="0.65" />
        <circle cx="140" cy="90" r="3" opacity="0.35" />
      </g>
      <text
        x="232"
        y="124"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        UI
      </text>
      <text
        x="232"
        y="94"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        LOGIC
      </text>
      <text
        x="232"
        y="64"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        DATA
      </text>
    </svg>
  )
}

function DiagramPipeline() {
  return (
    <svg viewBox="0 0 280 180" className="principle-diagram" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <path
          pathLength="1"
          className="draw"
          d="M30 90 H250"
          strokeDasharray="4 5"
        />
        <circle pathLength="1" className="draw" cx="55" cy="90" r="9" />
        <circle pathLength="1" className="draw" cx="120" cy="90" r="9" />
        <path pathLength="1" className="draw" d="M175 78 L192 90 L175 102" />
        <rect
          pathLength="1"
          className="draw"
          x="205"
          y="72"
          width="40"
          height="36"
          rx="6"
        />
        <path pathLength="1" className="draw" d="M215 90 L223 98 L237 82" />
      </g>
      <text
        x="40"
        y="120"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        PROMPT
      </text>
      <text
        x="100"
        y="60"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        SCHEMA-CHECKED
      </text>
      <text
        x="196"
        y="130"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        EVAL PASS
      </text>
      <g fill={INK}>
        <circle cx="55" cy="90" r="3" />
        <circle cx="120" cy="90" r="3" />
      </g>
    </svg>
  )
}

function DiagramLocal() {
  return (
    <svg viewBox="0 0 280 180" className="principle-diagram" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <rect
          pathLength="1"
          className="draw"
          x="70"
          y="70"
          width="110"
          height="66"
          rx="6"
        />
        <path pathLength="1" className="draw" d="M55 140 H195" />
        <rect
          pathLength="1"
          className="draw"
          x="112"
          y="92"
          width="26"
          height="20"
          rx="3"
        />
        <path
          pathLength="1"
          className="draw"
          d="M117 92 V86 a8 8 0 0 1 16 0 V92"
        />
        <path
          pathLength="1"
          className="draw"
          d="M215 55 a16 16 0 0 1 30 6 a12 12 0 0 1 -2 24 H212 a14 14 0 0 1 3 -30"
          opacity="0.5"
          strokeDasharray="4 4"
        />
        <path
          pathLength="1"
          className="draw"
          d="M208 48 L252 92"
          strokeWidth="2"
        />
      </g>
      <text
        x="60"
        y="164"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        LOCAL FIRST
      </text>
      <text
        x="204"
        y="40"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        NO CLOUD
      </text>
    </svg>
  )
}

function DiagramArch() {
  return (
    <svg viewBox="0 0 280 180" className="principle-diagram" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <rect
          pathLength="1"
          className="draw"
          x="24"
          y="70"
          width="52"
          height="40"
          rx="6"
        />
        <circle pathLength="1" className="draw" cx="50" cy="90" r="10" />
        <circle
          pathLength="1"
          className="draw"
          cx="50"
          cy="90"
          r="3"
          fill={INK}
          stroke="none"
        />
        <path
          pathLength="1"
          className="draw"
          d="M76 90 H120"
          strokeDasharray="3 4"
        />
        <rect
          pathLength="1"
          className="draw"
          x="120"
          y="70"
          width="52"
          height="40"
          rx="6"
        />
        <path
          pathLength="1"
          className="draw"
          d="M172 90 H216"
          strokeDasharray="3 4"
        />
        <path pathLength="1" className="draw" d="M216 74 a20 20 0 1 1 -6 22" />
        <path pathLength="1" className="draw" d="M212 66 L216 76 L206 78" />
      </g>
      <text
        x="30"
        y="130"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        SEE
      </text>
      <text
        x="128"
        y="130"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        ACT
      </text>
      <text
        x="212"
        y="130"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        REPLAY
      </text>
    </svg>
  )
}

function DiagramBuilding() {
  return (
    <svg viewBox="0 0 280 180" className="principle-diagram" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <rect
          pathLength="1"
          className="draw"
          x="60"
          y="50"
          width="26"
          height="90"
        />
        <rect
          pathLength="1"
          className="draw"
          x="120"
          y="50"
          width="26"
          height="90"
        />
        <rect
          pathLength="1"
          className="draw"
          x="180"
          y="50"
          width="26"
          height="90"
        />
      </g>
      <g fill={INK}>
        <rect x="60" y="96" width="26" height="44" opacity="0.9" />
        <rect x="120" y="76" width="26" height="64" opacity="0.55" />
        <rect x="180" y="120" width="26" height="20" opacity="0.3" />
      </g>
      <text
        x="52"
        y="164"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        SHIPPED
      </text>
      <text
        x="112"
        y="164"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        BUILDING
      </text>
      <text
        x="172"
        y="164"
        fontSize="8"
        fill={SLATE}
        fontFamily="JetBrains Mono, monospace"
      >
        NEXT
      </text>
    </svg>
  )
}

const principles = [
  {
    title: 'Engineering is a design material.',
    text: 'Motion, latency, and edge cases are part of the experience. I prototype in the medium the product will live in.',
    Diagram: DiagramStack,
  },
  {
    title: 'AI expands the exploration.',
    text: 'I use AI to explore more possibilities, then bring product judgment to the result. The decisions remain mine to explain.',
    Diagram: DiagramPipeline,
  },
  {
    title: 'Trust is built into the system.',
    text: 'Clear permissions, visible state, and a way back. People should understand what the product is doing on their behalf.',
    Diagram: DiagramLocal,
  },
  {
    title: 'Behaviour makes the interface.',
    text: 'I design what happens before, during, and after the click. An interface is a relationship between actions and consequences.',
    Diagram: DiagramArch,
  },
  {
    title: 'The work has to leave the canvas.',
    text: 'Build it. Try it. Find the friction. A working prototype creates a more useful conversation than a perfect static screen.',
    Diagram: DiagramBuilding,
  },
]
export default function Bento() {
  const [active, setActive] = useState(0)
  return (
    <section
      id="system"
      className="principles-section page-gutter"
      aria-labelledby="principles-heading"
    >
      <div className="principles-intro">
        <h2 id="principles-heading">
          The way <br />
          <em>I see it.</em>
        </h2>
        <p>Five principles that shape how I think, design, and build.</p>
      </div>
      <div className="principle-list">
        {principles.map((item, index) => (
          <article
            className={'principle prow ' + (active === index ? 'is-open' : '')}
            key={item.title}
          >
            <h3>
              <button
                onClick={() => setActive(active === index ? -1 : index)}
                aria-expanded={active === index}
                aria-controls={'principle-' + index}
              >
                <span className="meta">0{index + 1}</span>
                <span>{item.title}</span>
                <Icon name={active === index ? 'close' : 'arrow'} />
              </button>
            </h3>
            <div
              id={'principle-' + index}
              className="principle-content"
              hidden={active !== index}
            >
              <p>{item.text}</p>
              <item.Diagram />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
