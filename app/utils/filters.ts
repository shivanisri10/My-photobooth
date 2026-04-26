export interface Filter {
  id: string
  name: string
  css: string
  preview: string
  canvasFilter?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}

export const FILTERS: Filter[] = [
  {
    id: 'natural',
    name: 'Natural',
    css: 'none',
    preview: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
  },
  {
    id: '90s-film',
    name: '90s Film',
    css: 'contrast(1.15) saturate(1.25) brightness(0.95) hue-rotate(-5deg)',
    preview: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
  },
  {
    id: 'neon-pop',
    name: 'Neon Pop',
    css: 'contrast(1.3) saturate(1.6) brightness(1.1) hue-rotate(20deg)',
    preview: 'linear-gradient(135deg, #ff00cc, #3333ff)',
  },
  {
    id: 'retro-flash',
    name: 'Retro Flash',
    css: 'contrast(1.2) brightness(1.05) saturate(1.3)',
    preview: 'linear-gradient(135deg, #fddb92, #d1fdff)',
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    css: 'brightness(1.1) contrast(0.95) saturate(1.05)',
    preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
  },
  {
    id: 'bw-classic',
    name: 'B&W Classic',
    css: 'grayscale(1) contrast(1.1)',
    preview: 'linear-gradient(135deg, #888, #333)',
  },
  {
    id: 'vintage-warm',
    name: 'Vintage Warm',
    css: 'sepia(0.35) saturate(1.1) contrast(0.95) brightness(0.95)',
    preview: 'linear-gradient(135deg, #d4a574, #c79081)',
  },
]

export const getFilterById = (id: string): Filter =>
  FILTERS.find(f => f.id === id) ?? FILTERS[0]