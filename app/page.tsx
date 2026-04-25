'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import CameraCard from './components/CameraCard'
import FilterBar from './components/FilterBar'
import FrameSelector from './components/FrameSelector'
import CaptionEditor from './components/CaptionEditor'
import StripPreview from './components/StripPreview'
import { generateStrip } from './utils/generateStrip'

type AppStage = 'setup' | 'capturing' | 'review' | 'customize' | 'preview'

export default function Home() {
  const [stage, setStage] = useState<AppStage>('setup')
  const [selectedFilter, setSelectedFilter] = useState('soft-pastel')
  const [stripLength, setStripLength] = useState<3 | 4>(4)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isFlashing, setIsFlashing] = useState(false)
  const [caption, setCaption] = useState('')
  const [showDate, setShowDate] = useState(true)
  const [frameStyle, setFrameStyle] = useState('pink')
  const [isGenerating, setIsGenerating] = useState(false)
  const [finalStripUrl, setFinalStripUrl] = useState('')
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const captureReadyRef = useRef(false)
  const [shouldCapture, setShouldCapture] = useState(false)

  const clearCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  const doFlash = () => {
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 400)
  }

  const runCountdownAndCapture = useCallback(() => {
    setCountdown(3)
    setShouldCapture(false)
    let count = 3
    countdownRef.current = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearCountdown()
        setCountdown(0)
        doFlash()
        // Signal CameraCard to capture
        setShouldCapture(true)
        setTimeout(() => setShouldCapture(false), 100)
      } else {
        setCountdown(count)
      }
    }, 1000)
  }, [])

  const handlePhotoCapture = useCallback((dataUrl: string) => {
    if (retakeIndex !== null) {
      // Retaking a single photo
      setCapturedPhotos(prev => {
        const updated = [...prev]
        updated[retakeIndex] = dataUrl
        return updated
      })
      setRetakeIndex(null)
      setStage('review')
      setCountdown(null)
      return
    }

    setCapturedPhotos(prev => {
      const updated = [...prev, dataUrl]
      const nextIndex = updated.length

      if (nextIndex >= stripLength) {
        // Done!
        setStage('review')
        setCountdown(null)
        return updated
      }

      // Next photo
      setCurrentPhotoIndex(nextIndex)
      setTimeout(runCountdownAndCapture, 800)
      return updated
    })
  }, [stripLength, runCountdownAndCapture, retakeIndex])

  const handleStart = () => {
    setCapturedPhotos([])
    setCurrentPhotoIndex(0)
    setStage('capturing')
    setTimeout(runCountdownAndCapture, 500)
  }

  const handleRetakeSingle = (index: number) => {
    setRetakeIndex(index)
    setStage('capturing')
    setTimeout(runCountdownAndCapture, 500)
  }

  const handleRetakeAll = () => {
    setCapturedPhotos([])
    setCurrentPhotoIndex(0)
    setStage('capturing')
    setTimeout(runCountdownAndCapture, 500)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setStage('preview')
    const url = await generateStrip(capturedPhotos, selectedFilter, frameStyle, caption, showDate)
    setFinalStripUrl(url)
    setIsGenerating(false)
    setTimeout(() => {
      document.getElementById('strip-preview')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }

  const handleStartOver = () => {
    setCapturedPhotos([])
    setCurrentPhotoIndex(0)
    setFinalStripUrl('')
    setCaption('')
    setRetakeIndex(null)
    setStage('setup')
  }

  // Warn before refresh if strip not saved
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (stage === 'preview' && finalStripUrl && !isGenerating) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [stage, finalStripUrl, isGenerating])

  return (
    <main
      className="min-h-screen flex flex-col items-center pb-16"
      style={{ background: 'linear-gradient(160deg, #FFE9F1 0%, #F3EEFF 50%, #FFE9F1 100%)' }}
    >
      {/* Header */}
      <header className="w-full flex flex-col items-center pt-8 pb-4 px-4">
        <h1
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(36px, 8vw, 52px)',
            color: '#D4547A',
            letterSpacing: '0.02em',
            textShadow: '0 0 20px rgba(212,84,122,0.2)',
          }}
        >
          My Photo Booth 🎀
        </h1>
        <p className="text-sm mt-1" style={{ color: '#B08898' }}>
          your dreamy digital photo booth
        </p>
      </header>

      <div className="w-full max-w-lg px-4 flex flex-col gap-5">

        {/* Setup / Camera section */}
        {(stage === 'setup' || stage === 'capturing') && (
          <>
            {/* Strip length selector */}
            {stage === 'setup' && (
              <div
                className="rounded-3xl p-4 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
              >
                <p className="text-sm font-medium" style={{ color: '#9A7A8A' }}>Strip length</p>
                <div className="flex gap-3">
                  {([3, 4] as const).map(n => (
                    <button
                      key={n}
                      onClick={() => setStripLength(n)}
                      className="flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: stripLength === n ? '#F8BBD0' : '#FFF0F5',
                        color: stripLength === n ? '#8B3A5A' : '#B08898',
                        border: stripLength === n ? '2px solid #F48FB1' : '2px solid transparent',
                        transform: stripLength === n ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      {n} photos
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Camera */}
            <div
              className="rounded-3xl p-4"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
            >
              <CameraCard
                filterId={selectedFilter}
                onCapture={handlePhotoCapture}
                isCapturing={stage === 'capturing'}
                countdown={shouldCapture ? 0 : countdown}
                isFlashing={isFlashing}
                photosTaken={capturedPhotos.length}
                totalPhotos={stripLength}
              />

              {/* Filters */}
              <div className="mt-4">
                <FilterBar selected={selectedFilter} onChange={setSelectedFilter} />
              </div>

              {/* Start button */}
              {stage === 'setup' && (
                <button
                  onClick={handleStart}
                  className="mt-4 w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #F8BBD0, #DCC6FF)',
                    color: '#5A2A6A',
                    boxShadow: '0 8px 25px rgba(248,187,208,0.5)',
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '20px',
                  }}
                >
                  Start ✨
                </button>
              )}

              {stage === 'capturing' && countdown === null && (
                <div className="mt-3 text-center text-sm" style={{ color: '#B08898' }}>
                  Getting ready…
                </div>
              )}
            </div>
          </>
        )}

        {/* Review section */}
        {stage === 'review' && (
          <div
            className="rounded-3xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: '#D4547A' }}>
                Review your photos
              </h2>
              <button
                onClick={handleRetakeAll}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: '#FFE9F1', color: '#9A7A8A', border: '1px solid #F8BBD0' }}
              >
                Retake all
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {capturedPhotos.map((photo, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={photo}
                    alt={`Photo ${i + 1}`}
                    className="w-full object-cover rounded-2xl"
                    style={{ maxHeight: 180 }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                  >
                    <button
                      onClick={() => handleRetakeSingle(i)}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: 'rgba(255,255,255,0.9)', color: '#8B3A5A' }}
                    >
                      Retake
                    </button>
                  </div>
                  <div
                    className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.85)', color: '#8B3A5A' }}
                  >
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStage('customize')}
              className="w-full py-3.5 rounded-2xl font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F8BBD0, #DCC6FF)',
                color: '#5A2A6A',
                boxShadow: '0 6px 20px rgba(248,187,208,0.45)',
                fontFamily: "'Dancing Script', cursive",
                fontSize: '18px',
              }}
            >
              Customize Strip →
            </button>
          </div>
        )}

        {/* Customize section */}
        {stage === 'customize' && (
          <div
            className="rounded-3xl p-5 flex flex-col gap-5"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
          >
            <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: '#D4547A' }}>
              Customize your strip
            </h2>

            {/* Frame */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: '#9A7A8A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Frame style
              </p>
              <FrameSelector selected={frameStyle} onChange={setFrameStyle} />
            </div>

            {/* Caption */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: '#9A7A8A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Caption & date
              </p>
              <CaptionEditor
                caption={caption}
                showDate={showDate}
                onCaptionChange={setCaption}
                onToggleDate={setShowDate}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F8BBD0, #DCC6FF)',
                color: '#5A2A6A',
                boxShadow: '0 8px 25px rgba(248,187,208,0.5)',
                fontFamily: "'Dancing Script', cursive",
                fontSize: '20px',
              }}
            >
              Generate Strip ✨
            </button>
          </div>
        )}

        {/* Preview section */}
        {stage === 'preview' && (
          <div
            className="rounded-3xl p-5"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
          >
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <div className="text-2xl animate-bounce">🎞️</div>
                <p style={{ color: '#9A7A8A', fontFamily: "'Dancing Script', cursive", fontSize: 18 }}>
                  Generating your strip…
                </p>
              </div>
            ) : (
              <>
                <h2
                  className="text-center mb-5"
                  style={{ fontFamily: "'Dancing Script', cursive", fontSize: 24, color: '#D4547A' }}
                >
                  Your strip is ready! 
                </h2>
                <StripPreview stripUrl={finalStripUrl} onRetake={handleStartOver} />
              </>
            )}
          </div>
        )}

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-2">
          {['setup', 'capturing', 'review', 'customize', 'preview'].map((s, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: stage === s ? 20 : 6,
                height: 6,
                background: stage === s ? '#F48FB1' : '#E0C8D0',
              }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
