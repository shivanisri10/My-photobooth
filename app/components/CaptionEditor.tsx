'use client'

interface CaptionEditorProps {
  caption: string
  showDate: boolean
  onCaptionChange: (v: string) => void
  onToggleDate: (v: boolean) => void
}

export default function CaptionEditor({ caption, showDate, onCaptionChange, onToggleDate }: CaptionEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            className="w-10 h-5 rounded-full relative transition-colors duration-200"
            style={{ background: showDate ? '#F48FB1' : '#E0D0D8' }}
            onClick={() => onToggleDate(!showDate)}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ left: showDate ? '22px' : '2px' }}
            />
          </div>
          <span className="text-sm" style={{ color: '#9A7A8A' }}>Date stamp</span>
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          value={caption}
          onChange={e => onCaptionChange(e.target.value)}
          placeholder="Add a caption… ✨"
          maxLength={40}
          className="w-full px-4 py-2.5 rounded-2xl text-sm outline-none transition-all duration-200"
          style={{
            background: '#FFF0F5',
            border: '1.5px solid #F8BBD0',
            color: '#3A3A3A',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={e => { e.target.style.border = '1.5px solid #F48FB1' }}
          onBlur={e => { e.target.style.border = '1.5px solid #F8BBD0' }}
        />
        {caption && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: '#C9A0B0' }}
          >
            {caption.length}/40
          </span>
        )}
      </div>
    </div>
  )
}
