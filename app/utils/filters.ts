export interface Filter {
  id: string
  name: string
  css: string
  preview: string // gradient for preview tile
  canvasFilter?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}

export const FILTERS: Filter[] = [
  {
    id: 'none',
    name: 'Original',
    css: 'none',
    preview: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    css: 'brightness(1.08) saturate(0.8) contrast(0.92)',
    preview: 'linear-gradient(135deg, #FFE9F1, #E6D6FF)',
  },
  {
    id: 'blush-glow',
    name: 'Blush Glow',
    css: 'brightness(1.12) saturate(1.1) contrast(0.9) sepia(0.1)',
    preview: 'linear-gradient(135deg, #F8BBD0, #f9a8c9)',
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    css: 'brightness(1.05) saturate(0.7) hue-rotate(20deg) contrast(0.95)',
    preview: 'linear-gradient(135deg, #E6D6FF, #DCC6FF)',
  },
  {
    id: 'peach-cream',
    name: 'Peach Cream',
    css: 'brightness(1.1) saturate(0.85) sepia(0.15) contrast(0.93)',
    preview: 'linear-gradient(135deg, #FFE4CC, #FFCBA4)',
  },
  {
    id: 'soft-rosy',
    name: 'Soft Rosy',
    css: 'brightness(1.05) saturate(1.2) hue-rotate(-10deg) contrast(0.9)',
    preview: 'linear-gradient(135deg, #ffb3c6, #ff8fa3)',
  },
  {
    id: 'retro-film',
    name: 'Retro Film',
    css: 'sepia(0.4) contrast(1.1) brightness(0.95) saturate(0.9)',
    preview: 'linear-gradient(135deg, #d4a574, #b8860b)',
  },
  {
    id: 'vintage-fade',
    name: 'Vintage Fade',
    css: 'sepia(0.3) brightness(1.05) contrast(0.85) saturate(0.75)',
    preview: 'linear-gradient(135deg, #c8a97e, #a08060)',
  },
  {
    id: 'warm-grain',
    name: 'Warm Grain',
    css: 'brightness(1.0) saturate(1.1) sepia(0.2) contrast(1.05)',
    preview: 'linear-gradient(135deg, #e8c99a, #d4a574)',
  },
  {
    id: 'cool-film',
    name: 'Cool Film',
    css: 'brightness(1.02) saturate(0.8) hue-rotate(10deg) contrast(1.05)',
    preview: 'linear-gradient(135deg, #a8d8ea, #7ec8e3)',
  },
  {
    id: '90s-film',
    name: '90s Film',
    css: 'contrast(1.15) saturate(1.3) brightness(0.95) hue-rotate(-5deg)',
    preview: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
  },
  {
    id: 'classic',
    name: 'Classic',
    css: 'contrast(1.05) saturate(0.95) brightness(1.02)',
    preview: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  {
    id: 'bw',
    name: 'B&W',
    css: 'grayscale(1) contrast(1.05)',
    preview: 'linear-gradient(135deg, #888, #333)',
  },
  {
    id: 'bw-high',
    name: 'High B&W',
    css: 'grayscale(1) contrast(1.4) brightness(1.05)',
    preview: 'linear-gradient(135deg, #ccc, #111)',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    css: 'sepia(1) contrast(1.05)',
    preview: 'linear-gradient(135deg, #c8a97e, #8B6914)',
  },
  {
    id: 'muted',
    name: 'Muted Tone',
    css: 'saturate(0.5) brightness(1.05) contrast(0.9)',
    preview: 'linear-gradient(135deg, #b8b8b8, #8a8a8a)',
  },
]

export const getFilterById = (id: string): Filter =>
  FILTERS.find(f => f.id === id) ?? FILTERS[0]
