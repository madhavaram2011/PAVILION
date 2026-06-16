import { CSSProperties } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

const shimmerKeyframes = `
@keyframes skeletonShimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
`

/**
 * Pulsing skeleton block — dark-theme, shimmer animation.
 * Drop-in replacement for any loading placeholder.
 */
export default function Skeleton({
  width = '100%',
  height = 200,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div
        style={{
          width,
          height,
          borderRadius,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '1200px 100%',
          animation: 'skeletonShimmer 1.6s infinite linear',
          flexShrink: 0,
          ...style,
        }}
      />
    </>
  )
}

/** Convenience wrapper — renders N skeleton rows with given heights */
export function SkeletonText({
  lines = 3,
  lineHeight = 14,
  gap = 10,
  lastWidth = '60%',
}: {
  lines?: number
  lineHeight?: number
  gap?: number
  lastWidth?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastWidth : '100%'}
          borderRadius={3}
        />
      ))}
    </div>
  )
}
