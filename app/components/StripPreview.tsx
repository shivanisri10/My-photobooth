'use client'
import { useState } from 'react'
import { generateInstagramStory } from '../utils/generateStrip'

interface StripPreviewProps {
  stripUrl: string
  onRetake: () => void
}

export default function StripPreview({ stripUrl, onRetake }: StripPreviewProps) {
  const [downloading, setDownloading] = useState(false)

  const downloadAs = async (format: 'jpeg' | 'png' | 'story') => {
    setDownloading(true)
    try {
      let url = stripUrl
      let filename = `softbooth-${Date.now()}`

      if (format === 'story') {
        url = await generateInstagramStory(stripUrl)
        filename += '-story.jpg'
      } else if (format === 'png') {
        // Convert to PNG
        const img = new Image()
        img.src = stripUrl
        await new Promise(r => { img.onload = r })
        const c = document.createElement('canvas')
        c.width = img.width; c.height = img.height
        c.getContext('2d')!.drawImage(img, 0, 0)
        url = c.toDataURL('image/png')
        filename += '.png'
      } else {
        filename += '.jpg'
      }

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(stripUrl)).blob()
        const file = new File([blob], 'softbooth.jpg', { type: 'image/jpeg' })
        await navigator.share({ files: [file], title: 'My Softbooth Strip 🎀' })
      } catch {}
    } else {
      downloadAs('jpeg')
    }
  }

  return (
    <div id="strip-preview" className="flex flex-col items-center gap-6">
      {/* Strip */}
      <div
        className="strip-print rounded-2xl overflow-hidden shadow-2xl"
        style={{
          maxWidth: 320,
          boxShadow: '0 20px 60px rgba(248,107,145,0.2), 0 8px 30px rgba(0,0,0,0.12)',
        }}
      >
        <img src={stripUrl} alt="Photo strip" className="w-full" />
      </div>

      {/* Download buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => downloadAs('jpeg')}
          disabled={downloading}
          className="w-full py-3 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95"
          style={{ background: '#F8BBD0', color: '#8B3A5A', boxShadow: '0 4px 15px rgba(248,187,208,0.5)' }}
        >
          ⬇️ Download JPEG
        </button>
        <button
          onClick={() => downloadAs('png')}
          disabled={downloading}
          className="w-full py-3 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95"
          style={{ background: '#F3EEFF', color: '#6B3A9B', boxShadow: '0 4px 15px rgba(220,198,255,0.4)' }}
        >
          ⬇️ Download PNG
        </button>
        <button
          onClick={() => downloadAs('story')}
          disabled={downloading}
          className="w-full py-3 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #F8BBD0, #DCC6FF)', color: '#5A2A7A', boxShadow: '0 4px 15px rgba(220,198,255,0.4)' }}
        >
          📱 Instagram Story (9:16)
        </button>
        <button
          onClick={handleShare}
          className="w-full py-3 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95"
          style={{ background: '#FFE9F1', color: '#8B3A5A', border: '1.5px solid #F8BBD0' }}
        >
          🔗 Share
        </button>

        <button
          onClick={onRetake}
          className="w-full py-2.5 rounded-2xl text-sm transition-all duration-200 mt-1"
          style={{ color: '#9A7A8A', border: '1.5px solid #E0C8D0' }}
        >
          ↩ Start over
        </button>
      </div>
    </div>
  )
}
