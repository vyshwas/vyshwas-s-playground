import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../lib/motion.js'
import { projects } from '../data/projects.js'
import Dialog from './Dialog.jsx'
import Icon from './Icon.jsx'
const ordered = [
  projects[2],
  projects[0],
  projects[1],
  projects[4],
  projects[3],
]
const categories = {
  Awara: 'Research / Product systems',
  Nocturne: 'Trust / Interaction design',
  Munim: 'Agentic finance / Product systems',
  Gamut: 'Design tooling / Engineering',
  'The Whole Fruit': 'Brand strategy / Packaging',
}

function ProjectWorkspace({ project, mode, onMode, onClose, onNext }) {
  const [loadedProject, setLoadedProject] = useState(null)
  const [notes, setNotes] = useState(false)
  const frameCleanup = useRef(null)
  const reader = useRef(null)
  useEffect(() => {
    reader.current?.scrollTo(0, 0)
    return () => frameCleanup.current?.()
  }, [project, mode])
  const frameLoaded = (e) => {
    setLoadedProject(project.no)
    // Keyboard events in a same-origin document never bubble out of an iframe.
    frameCleanup.current?.()
    const frameWindow = e.currentTarget.contentWindow
    const escape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    frameWindow.addEventListener('keydown', escape, true)
    frameCleanup.current = () =>
      frameWindow.removeEventListener('keydown', escape, true)
  }
  return (
    <Dialog
      onClose={onClose}
      labelId="project-title"
      className="project-workspace"
    >
      <header className="workspace-header">
        <div className="workspace-name">
          <span className="meta">{project.no}</span>
          <h2 id="project-title">{project.title}</h2>
        </div>
        <div className="workspace-modes" role="group" aria-label="Project view">
          <button
            aria-pressed={mode === 'study'}
            onClick={() => {
              setNotes(false)
              onMode('study')
            }}
          >
            Case study
          </button>
          {project.protoUrl && (
            <button
              aria-pressed={mode === 'prototype'}
              onClick={() => onMode('prototype')}
            >
              Live prototype
            </button>
          )}
        </div>
        <button
          className="workspace-close"
          onClick={onClose}
          aria-label="Close project"
        >
          <span>Close</span>
          <Icon name="close" />
        </button>
      </header>
      {mode === 'prototype' && project.protoUrl ? (
        <div className="prototype-body">
          {loadedProject !== project.no && (
            <p className="prototype-loading" role="status">
              Opening {project.title}…
            </p>
          )}
          <iframe
            src={project.protoUrl}
            title={project.title + ' interactive prototype'}
            onLoad={frameLoaded}
          />
          <div className="prototype-tools">
            <button
              className="button"
              aria-expanded={notes}
              onClick={() => setNotes(!notes)}
            >
              {notes ? 'Close context' : 'Design context'}
            </button>
            <a
              className="button"
              href={project.protoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open separately <Icon name="external" />
            </a>
          </div>
          {notes && (
            <aside className="prototype-notes">
              <button
                className="icon-button"
                aria-label="Close design context"
                onClick={() => setNotes(false)}
              >
                <Icon name="close" />
              </button>
              <h3>The design decision</h3>
              <p>{project.approach}</p>
              <button className="text-link" onClick={() => onMode('study')}>
                Read the case study <Icon />
              </button>
            </aside>
          )}
        </div>
      ) : (
        <div ref={reader} className="case-reader" data-lenis-prevent>
          <div className="case-intro">
            <div className="case-meta meta">
              <span>{project.role}</span>
              <span>{project.year}</span>
            </div>
            <h3>{project.tagline}</h3>
            <div className="case-actions">
              {project.protoUrl ? (
                <button
                  className="button button-light"
                  onClick={() => onMode('prototype')}
                >
                  Run live prototype <Icon name="external" />
                </button>
              ) : (
                <a
                  className="button button-light"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.linkLabel?.replace(' ↗', '') || 'Explore project'}
                  <Icon name="external" />
                </a>
              )}
              <span className="meta">{project.stack.join(' / ')}</span>
            </div>
          </div>
          <figure className="case-figure">
            <img src={project.preview} alt={project.previewAlt} />
          </figure>
          <div className="case-sections">
            <section>
              <h4>Context</h4>
              <p>{project.context}</p>
            </section>
            <section>
              <h4>The problem</h4>
              <p>{project.problem}</p>
            </section>
            <section className="case-approach">
              <h4>The design decision</h4>
              <p>{project.approach}</p>
            </section>
            <section>
              <h4>What the work demonstrates</h4>
              <ul>
                {project.outcome.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
          <button className="next-project" onClick={onNext}>
            <span>Next project</span>
            <Icon name="arrow" />
          </button>
        </div>
      )}
    </Dialog>
  )
}
export default function Projects() {
  const root = useRef(null)
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('study')
  const calm = useReducedMotion()
  useLayoutEffect(() => {
    if (calm) return
    const ctx = gsap.context(() => {
      root.current.querySelectorAll('.project-art').forEach((art) => {
        gsap.fromTo(
          art.querySelector('.project-image'),
          { yPercent: 7, scale: 1.05 },
          {
            yPercent: -3,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: art,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
      gsap.fromTo(
        '.work-heading em',
        { xPercent: -8 },
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'top 20%',
            scrub: true,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [calm])
  const open = (project, nextMode) => {
    setSelected(project)
    setMode(nextMode)
  }
  return (
    <section
      id="experiments"
      tabIndex="-1"
      ref={root}
      className="work-section page-gutter"
      aria-labelledby="work-heading"
    >
      <div className="section-divider">
        <span>Selected work</span>
        <span className="meta">
          {String(ordered.length).padStart(2, '0')} projects / 2024–2025
        </span>
      </div>
      <h2 id="work-heading" className="work-heading">
        Ideas, made
        <br />
        <em>tangible.</em>
      </h2>
      <p className="work-description">
        The decisions behind the interface.
        <br />
        The prototypes that make them real.
      </p>
      <div className="project-grid">
        {ordered.map((project, i) => (
          <article
            key={project.no}
            className={
              'project-item project-' +
              project.title.toLowerCase().replaceAll(' ', '-') +
              (i === 0 ? ' project-featured' : '')
            }
          >
            <button
              className="project-art"
              aria-label={'Read ' + project.title + ' case study'}
              onClick={() => open(project, 'study')}
              data-cursor="view"
            >
              <span className="project-art-word" aria-hidden="true">
                {project.title === 'The Whole Fruit'
                  ? 'Whole.'
                  : project.title + '.'}
              </span>
              <img
                className="project-image"
                src={project.preview}
                alt={project.previewAlt}
                loading="lazy"
                decoding="async"
              />
              <span className="art-open" aria-hidden="true">
                <Icon name="external" />
              </span>
            </button>
            <div className="project-info">
              <div>
                <span className="project-category">
                  {categories[project.title]}
                </span>
                <h3>
                  <button onClick={() => open(project, 'study')}>
                    {project.title}
                  </button>
                </h3>
                <p>{project.tagline}</p>
              </div>
              <div className="project-links">
                <button
                  className="text-link"
                  onClick={() => open(project, 'study')}
                >
                  Case study <Icon name="arrow" />
                </button>
                {project.protoUrl && (
                  <button
                    className="text-link"
                    onClick={() => open(project, 'prototype')}
                  >
                    Try prototype <Icon name="external" />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <ProjectWorkspace
          key={selected.no}
          project={selected}
          mode={mode}
          onMode={setMode}
          onClose={() => setSelected(null)}
          onNext={() =>
            open(
              ordered[(ordered.indexOf(selected) + 1) % ordered.length],
              'study',
            )
          }
        />
      )}
    </section>
  )
}
