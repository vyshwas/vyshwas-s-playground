export default function Icon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: 'M5 12h14M12 5l7 7-7 7',
    external: 'M6 18 18 6M6 6h12v12',
    close: 'm6 6 12 12M6 18 18 6',
    menu: 'M4 8h16M4 16h16',
    pause: 'M9 5v14M15 5v14',
    play: 'm8 5 11 7-11 7V5',
    copy: 'M9 9h11v11H9zM15 5V3H3v12h2',
  }
  return (
    <svg
      className={'icon ' + className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  )
}
