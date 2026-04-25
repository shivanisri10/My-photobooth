'use client'
import { FILTERS } from '../utils/filters'

interface FilterBarProps {
  selected: string
  onChange: (id: string) => void
}

export default function FilterBar({ selected, onChange }: FilterBarProps) {
  return (
    <div className="w-full">
      <div
        className="filter-scroll flex gap-3 overflow-x-auto pb-2 px-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className="flex-shrink-0 flex flex-col items-center gap-1 group"
          >
            <div
              className="w-14 h-14 rounded-2xl transition-all duration-200 shadow-sm"
              style={{
                background: f.preview,
                border: selected === f.id
                  ? '2.5px solid #F06292'
                  : '2.5px solid transparent',
                outline: selected === f.id ? '1.5px solid #FFD6E7' : 'none',
                transform: selected === f.id ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            <span
              className="text-xs whitespace-nowrap transition-colors"
              style={{
                color: selected === f.id ? '#F06292' : '#9A7A8A',
                fontWeight: selected === f.id ? 600 : 400,
                fontSize: '10px',
              }}
            >
              {f.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
