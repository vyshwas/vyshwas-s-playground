import { Component } from 'react'
export class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.error('Playground rendering failed:', error, info)
  }
  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main className="site-error page-gutter">
        <h1>The playground couldn’t open.</h1>
        <p>Reload the page, or view my résumé and get in touch directly.</p>
        <div>
          <button
            className="button button-dark"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <a className="button" href="./resume.pdf">
            View résumé
          </a>
          <a className="button" href="mailto:vyommehta197@gmail.com">
            Email Vishwas
          </a>
        </div>
      </main>
    )
  }
}
