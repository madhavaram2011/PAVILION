import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Destination {
  name: string
  lat: number
  lng: number
  address?: string
  category?: string[]
  rating?: number
  reviewCount?: number
  coverImage?: string
  description?: string
  bestTimeToVisit?: string
  entryFee?: string
  timings?: string
  howToReach?: {
    byAir?: string
    byTrain?: string
    byRoad?: string
  }
  nearbyAttractions?: string[]
}

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  destination: Destination
  zoom?: number
}

export default function MapModal({
  isOpen,
  onClose,
  destination,
  zoom = 15,
}: MapModalProps) {
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [iframeError, setIframeError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const embedUrl = `https://maps.google.com/maps?q=${destination.lat},${destination.lng}&z=${zoom}&t=h&output=embed`
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destination.lat},${destination.lng}`)}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${destination.lat},${destination.lng}`)}`
  const formattedAddress = destination.address || destination.name
  const ratingText = destination.rating?.toFixed(1) ?? 'N/A'

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 6, 15, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1120,
          maxHeight: 'calc(100% - 28px)',
          background: '#06111f',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minHeight: isMobile ? 320 : 520, background: '#020711' }}>
          <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.64)', color: '#f4f2e3', borderRadius: 12, padding: '8px 12px', fontSize: 12, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a96e', display: 'inline-block' }} />
            Google Maps preview - no API required
          </div>

          {useMemo(() => (
            <iframe
              src={embedUrl}
              title={`Map of ${destination.name}`}
              loading="lazy"
              style={{ width: '100%', height: '100%', border: 0 }}
              onError={() => setIframeError('Map preview could not load. Please open the map externally.')}
            />
          ), [embedUrl, destination.name])}

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(1, 4, 11, 0.78)',
              color: '#f4f2e3',
              cursor: 'pointer',
            }}
            aria-label="Close map modal"
          >
            X
          </button>

          {iframeError && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                color: '#f8d7b6',
                background: 'rgba(0,0,0,0.68)',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Map preview unavailable</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>{iframeError}</div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: '#c9a96e',
                    color: '#06111f',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Open external Google Maps
                </a>
              </div>
            </div>
          )}
        </div>

        <div style={{ width: isMobile ? '100%' : 340, background: '#090f1d', padding: 24, overflowY: 'auto' }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#faf9f1' }}>{destination.name}</div>
            <div style={{ fontSize: 12, color: '#9fa7bd', marginTop: 6 }}>{formattedAddress}</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: '1 1 130px', background: '#091529', padding: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 6 }}>Rating</div>
              <div style={{ fontSize: 16, color: '#f4f2e3', fontWeight: 700 }}>{ratingText} ★</div>
            </div>
            <div style={{ flex: '1 1 130px', background: '#091529', padding: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 6 }}>Zoom</div>
              <div style={{ fontSize: 16, color: '#f4f2e3', fontWeight: 700 }}>{zoom}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: 12,
                background: '#c9a96e',
                color: '#090c08',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open in Google Maps
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                color: '#f4f2e3',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Get directions
            </a>
            <button
              onClick={() => {
                onClose()
                navigate(`/tours?destination=${encodeURIComponent(destination.name)}`)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: 12,
                background: '#2f7ffc',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Plan trip
            </button>
          </div>

          {(destination.entryFee || destination.timings || destination.bestTimeToVisit) && (
            <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: '#071022', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 10 }}>Quick facts</div>
              {destination.entryFee && <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 10 }}><strong>Entry fee:</strong> {destination.entryFee}</div>}
              {destination.timings && <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 10 }}><strong>Timings:</strong> {destination.timings}</div>}
              {destination.bestTimeToVisit && <div style={{ fontSize: 13, color: '#e2e8f0' }}><strong>Best time:</strong> {destination.bestTimeToVisit}</div>}
            </div>
          )}

          {destination.howToReach && (
            <div style={{ marginTop: 20, padding: 16, borderRadius: 14, background: '#071022', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 10 }}>How to reach</div>
              <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>
                {destination.howToReach.byAir && <div style={{ marginBottom: 8 }}><strong>Air:</strong> {destination.howToReach.byAir}</div>}
                {destination.howToReach.byTrain && <div style={{ marginBottom: 8 }}><strong>Train:</strong> {destination.howToReach.byTrain}</div>}
                {destination.howToReach.byRoad && <div><strong>Road:</strong> {destination.howToReach.byRoad}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}