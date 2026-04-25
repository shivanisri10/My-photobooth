'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { getFilterById } from '../utils/filters'

interface CameraCardProps {
  filterId: string
  onCapture: (dataUrl: string) => void
  isCapturing: boolean
  countdown: number | null
  isFlashing: boolean
  photosTaken: number
  totalPhotos: number
}

export default function CameraCard({
  filterId,
  onCapture,
  isCapturing,
  countdown,
  isFlashing,
  photosTaken,
  totalPhotos,
}: CameraCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [mirrored, setMirrored] = useState(true)
  const streamRef = useRef<MediaStream | null>(null)

  const filter = getFilterById(filterId)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setHasPermission(true)
    } catch {
      setHasPermission(false)
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [startCamera])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const W = 800
    const H = 600
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    if (mirrored) {
      ctx.translate(W, 0)
      ctx.scale(-1, 1)
    }
    ctx.filter = filter.css
    ctx.drawImage(video, 0, 0, W, H)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onCapture(dataUrl)
  }, [mirrored, filter, onCapture])

  // Expose capturePhoto via ref
  useEffect(() => {
    if (isCapturing && countdown === 0) {
      capturePhoto()
    }
  }, [isCapturing, countdown, capturePhoto])

  if (hasPermission === false) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-3xl p-8 text-center"
        style={{ background: '#FFF0F5', border: '2px dashed #F8BBD0', minHeight: 280 }}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="font-medium mb-1" style={{ color: '#8B3A5A' }}>Camera access needed</p>
        <p className="text-sm mb-4" style={{ color: '#9A7A8A' }}>Please allow camera access to use the photo booth</p>
        <button
          onClick={startCamera}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: '#F8BBD0', color: '#8B3A5A' }}
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Camera viewport */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-lg"
        style={{ width: '100%', maxWidth: 480, aspectRatio: '4/3', background: '#1a0a10' }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{
            filter: filter.css,
            transform: mirrored ? 'scaleX(-1)' : 'none',
            transition: 'filter 0.2s ease',
          }}
        />

        {/* Flash overlay */}
        {isFlashing && (
          <div
            className="absolute inset-0 bg-white rounded-3xl"
            style={{ animation: 'flash 0.4s ease-out forwards', zIndex: 10 }}
          />
        )}

        {/* Countdown overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
            <span
              key={countdown}
              className="countdown-num"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(80px, 20vw, 120px)',
                color: 'white',
                textShadow: '0 0 30px rgba(248,187,208,0.8), 0 4px 20px rgba(0,0,0,0.5)',
                fontWeight: 700,
              }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Photo counter */}
        {isCapturing && (
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.85)', color: '#8B3A5A', zIndex: 15 }}
          >
            {photosTaken + 1} / {totalPhotos}
          </div>
        )}

        {/* Mirror toggle */}
        {!isCapturing && (
          <button
            onClick={() => setMirrored(m => !m)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.7)', zIndex: 15 }}
            title="Flip camera"
          >
            🔄
          </button>
        )}

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
