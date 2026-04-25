'use client'
import { FRAME_STYLES } from '../utils/generateStrip'

interface FrameSelectorProps {
  selected: string
  onChange: (id: string) => void
}

export default function FrameSelector({ selected, onChange }: FrameSelectorProps) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {FRAME_STYLES.map(f => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className="flex flex-col items-center gap-1 transition-all duration-200"
          style={{ transform: selected === f.id ? 'scale(1.05)' : 'scale(1)' }}
        >
          <div
            className="w-10 h-10 rounded-xl shadow-sm"
            style={{
              background: f.bg,
              border: selected === f.id
                ? `2.5px solid #F06292`
                : `2px solid ${f.border}`,
            }}
          />
          <span
            className="text-xs"
            style={{
              color: selected === f.id ? '#F06292' : '#9A7A8A',
              fontWeight: selected === f.id ? 600 : 400,
              fontSize: '10px',
              whiteSpace: 'nowrap',
            }}
          >
            {f.name}
          </span>
        </button>
      ))}
    </div>
  )
}
