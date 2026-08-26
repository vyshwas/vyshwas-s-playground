const BASE = '#121212'

function GamutMotif({ accent }) {
  return (
    <svg viewBox="0 0 400 220" className="absolute right-[8%] top-1/2 h-[70%] -translate-y-1/2 opacity-80" aria-hidden="true">
      <circle cx="200" cy="110" r="88" fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="200" cy="110" r="52" fill="none" stroke={accent} strokeOpacity="0.75" strokeWidth="1.5" />
      <circle cx="200" cy="110" r="20" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1.5" />
      <circle cx="200" cy="110" r="4" fill={accent} />
      <line x1="200" y1="6" x2="200" y2="214" stroke={accent} strokeOpacity="0.25" strokeDasharray="3 5" />
      <line x1="96" y1="110" x2="304" y2="110" stroke={accent} strokeOpacity="0.25" strokeDasharray="3 5" />
    </svg>
  )
}

function YapaMotif({ accent }) {
  const bars = [18, 42, 70, 34, 88, 56, 96, 40, 72, 28, 60, 90, 46, 22, 66, 38, 80, 30, 54, 16]
  return (
    <div className="absolute right-[8%] top-1/2 flex h-[60%] -translate-y-1/2 items-center gap-[6px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[5px] rounded-full"
          style={{ height: `${h}%`, background: accent, opacity: 0.25 + (h / 100) * 0.65 }}
        />
      ))}
    </div>
  )
}

function VeronicaMotif({ accent }) {
  return (
    <svg viewBox="0 0 400 220" className="absolute right-[8%] top-1/2 h-[70%] -translate-y-1/2 opacity-80" aria-hidden="true">
      <rect x="120" y="50" width="160" height="120" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="8 6" />
      <circle cx="200" cy="110" r="34" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx="200" cy="110" r="3.5" fill={accent} />
      <line x1="200" y1="60" x2="200" y2="88" stroke={accent} strokeWidth="1.5" />
      <line x1="200" y1="132" x2="200" y2="160" stroke={accent} strokeWidth="1.5" />
      <line x1="150" y1="110" x2="178" y2="110" stroke={accent} strokeWidth="1.5" />
      <line x1="222" y1="110" x2="250" y2="110" stroke={accent} strokeWidth="1.5" />
      <path d="M104 34 h-16 v16 M296 34 h16 v16 M104 186 h-16 v-16 M296 186 h16 v-16" fill="none" stroke={accent} strokeWidth="2" />
    </svg>
  )
}

const MOTIFS = {
  rings: GamutMotif,
  wave: YapaMotif,
  crosshair: VeronicaMotif,
}

export default function CoverArt({ p }) {
  const { accent, motif, spec } = p.cover
  const Motif = MOTIFS[motif]

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `radial-gradient(120% 130% at 78% 0%, ${accent}26 0%, transparent 55%), ${BASE}` }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="absolute -right-24 -top-28 h-[26rem] w-[26rem] rounded-full blur-[110px]" style={{ background: `${accent}30` }} />

      <span
        className="text-outline pointer-events-none absolute -bottom-10 left-2 select-none font-extrabold leading-none opacity-25"
        style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', letterSpacing: '-0.04em' }}
      >
        {p.no}
      </span>

      <Motif accent={accent} />

      <span className="absolute left-5 top-5 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-bone/60">
        Fig. {p.no}
      </span>
      <span className="absolute right-5 top-5 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-bone/60">
        {p.year}
      </span>
      <span className="absolute bottom-5 left-5 font-mono text-[0.55rem] uppercase tracking-[0.25em]" style={{ color: accent }}>
        {spec}
      </span>
      <span className="absolute bottom-5 right-5 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-bone/40">
        designed + built
      </span>
    </div>
  )
}