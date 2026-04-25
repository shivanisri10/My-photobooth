import { getFilterById } from './filters'

export interface FrameStyle {
  id: string
  name: string
  bg: string
  border: string
  text: string
}

export const FRAME_STYLES: FrameStyle[] = [
  { id: 'white', name: 'Classic White', bg: '#FFFFFF', border: '#F0F0F0', text: '#3A3A3A' },
  { id: 'pink', name: 'Pastel Pink', bg: '#FFE9F1', border: '#F8BBD0', text: '#8B3A5A' },
  { id: 'cream', name: 'Vintage Cream', bg: '#FFFAF0', border: '#E8D5B7', text: '#6B4E2A' },
  { id: 'lavender', name: 'Lavender Tint', bg: '#F3EEFF', border: '#DCC6FF', text: '#5A3A8B' },
]

export async function generateStrip(
  photos: string[],
  filterId: string,
  frameId: string,
  caption: string,
  showDate: boolean
): Promise<string> {
  const frame = FRAME_STYLES.find(f => f.id === frameId) ?? FRAME_STYLES[0]
  const filter = getFilterById(filterId)

  const PHOTO_W = 400
  const PHOTO_H = 300
  const PADDING = 20
  const GAP = 12
  const HEADER = 60
  const FOOTER = caption || showDate ? 70 : 30

  const totalH = HEADER + photos.length * PHOTO_H + (photos.length - 1) * GAP + PADDING * 2 + FOOTER

  const canvas = document.createElement('canvas')
  canvas.width = PHOTO_W + PADDING * 2
  canvas.height = totalH
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = frame.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Border
  ctx.strokeStyle = frame.border
  ctx.lineWidth = 3
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12)

  // Header logo
  ctx.fillStyle = frame.text
  ctx.font = 'bold 22px "Dancing Script", cursive'
  ctx.textAlign = 'center'
  ctx.fillText('softbooth 🎀', canvas.width / 2, 38)

  // Draw photos
  for (let i = 0; i < photos.length; i++) {
    const y = HEADER + PADDING + i * (PHOTO_H + GAP)
    const img = new Image()
    img.src = photos[i]
    await new Promise(r => { img.onload = r })

    // Apply filter via off-screen canvas
    const offscreen = document.createElement('canvas')
    offscreen.width = PHOTO_W
    offscreen.height = PHOTO_H
    const offCtx = offscreen.getContext('2d')!
    offCtx.filter = filter.css
    offCtx.drawImage(img, 0, 0, PHOTO_W, PHOTO_H)

    ctx.drawImage(offscreen, PADDING, y)

    // Rounded corner overlay (clip via shadow)
    ctx.strokeStyle = frame.border
    ctx.lineWidth = 1
    ctx.strokeRect(PADDING, y, PHOTO_W, PHOTO_H)
  }

  // Caption / Date
  const footerY = HEADER + PADDING + photos.length * PHOTO_H + (photos.length - 1) * GAP + 20

  if (showDate) {
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`
    ctx.fillStyle = frame.text
    ctx.font = '13px "DM Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.globalAlpha = 0.6
    ctx.fillText(dateStr, canvas.width / 2, footerY + (caption ? 0 : 10))
    ctx.globalAlpha = 1
  }

  if (caption) {
    ctx.fillStyle = frame.text
    ctx.font = 'italic 15px "Dancing Script", cursive'
    ctx.textAlign = 'center'
    ctx.fillText(caption, canvas.width / 2, footerY + (showDate ? 22 : 12))
  }

  return canvas.toDataURL('image/jpeg', 0.95)
}

export async function generateInstagramStory(stripDataUrl: string): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')!

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 1080, 1920)
  grad.addColorStop(0, '#FFE9F1')
  grad.addColorStop(0.5, '#F3EEFF')
  grad.addColorStop(1, '#FFE9F1')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1920)

  const img = new Image()
  img.src = stripDataUrl
  await new Promise(r => { img.onload = r })

  const scale = Math.min(900 / img.width, 1600 / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = (1080 - dw) / 2
  const dy = (1920 - dh) / 2

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.15)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 20
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.shadowColor = 'transparent'

  return canvas.toDataURL('image/jpeg', 0.95)
}
