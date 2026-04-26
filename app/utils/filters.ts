export interface Filter {
  id: string
  name: string
  css: string
  preview: string
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
    css: 'contrast(1.35) saturate(1.7) brightness(1.1) hue-rotate(25deg)',
    preview: 'linear-gradient(135deg, #ff00cc, #3333ff)',
  },
  {
    id: 'dreamy-blur',
    name: 'Dreamy Blur',
    css: 'brightness(1.15) contrast(0.9) saturate(1.1) blur(1px)',
    preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
  },
  {
    id: 'bw-classic',
    name: 'B&W Classic',
    css: 'grayscale(1) contrast(1.15)',
    preview: 'linear-gradient(135deg, #999, #222)',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    css: 'brightness(1.1) contrast(1.05) saturate(1.2) hue-rotate(-15deg)',
    preview: 'linear-gradient(135deg, #f6d365, #fda085)',
  },
  {
    id: 'vintage-matte',
    name: 'Vintage Matte',
    css: 'contrast(0.85) brightness(1.05) saturate(0.9)',
    preview: 'linear-gradient(135deg, #d3cce3, #e9e4f0)',
  },
]

export const getFilterById = (id: string): Filter =>
  FILTERS.find(f => f.id === id) ?? FILTERS[0]