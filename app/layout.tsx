import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Photo Booth 🎀',
  description: 'A dreamy, blush pink photo booth experience. Capture, filter, and download your moments.',
  openGraph: {
    title: 'My Photo Booth 🎀',
    description: 'Your cute digital photo booth',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
