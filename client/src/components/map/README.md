# MapModal for Pavilion

This component renders a Google Maps preview using a public embedded map URL. No Google Maps JavaScript API key is required.

## Features

- **No API key required** for the embedded map preview
- **Public Google Maps embed** for destination location
- **Responsive modal layout** with destination details
- **Open in Google Maps** and **Get directions** quick actions
- **Plan trip** button linking to `/tours?destination={name}`

## Setup

The MapModal works out of the box. No additional configuration or `.env` values are required.

## Usage

```tsx
import React, { useState } from 'react'
import MapModal from '@/components/map/MapModal'

const destination = {
  name: 'Taj Mahal',
  lat: 27.1751,
  lng: 78.0421,
  address: 'Dharmapuri, Forest Colony, Tajganj, Agra',
  rating: 4.9,
  entryFee: '?50',
  timings: '6:00 AM - 7:00 PM',
  bestTimeToVisit: 'Oct–Mar',
  howToReach: {
    byAir: 'Fly to Agra airport and take a 40-minute taxi ride.',
    byTrain: 'Board the Gatimaan Express to Agra Cantt station.',
    byRoad: 'Take NH44 from Delhi or Jaipur.',
  },
}

export default function Example() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Show map</button>
      <MapModal isOpen={isOpen} onClose={() => setIsOpen(false)} destination={destination} zoom={16} />
    </>
  )
}
```

## Notes

- No Google Maps API key is required for this modal.
- The component uses a safe public embed URL and opens full Google Maps when requested.
- The modal is designed for simple destination previews and quick actions.
