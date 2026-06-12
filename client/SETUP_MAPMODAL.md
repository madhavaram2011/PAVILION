# MapModal Implementation Guide

> NOTE: The current MapModal implementation uses a public Google Maps embed and does not require a Google Maps API key.

## Quick Start (5 minutes)

### Step 1: No API key required

The built-in MapModal uses a public Google Maps preview URL. There is no need to create a Google Cloud API key.

### Step 2: Verify the component exists

Confirm `src/components/map/MapModal.tsx` exists and that `DestinationsPage.tsx` can open it for a selected destination.

### Step 3: Open the modal

Hover over a destination card and click the map button. The modal should:

- show a Google Maps preview for the chosen destination
- provide links to open Google Maps and get directions
- display destination details and quick facts
- close via the overlay, Escape key, or the close button

## Testing

1. Start dev server:

```bash
cd client
npm run dev
```

2. Open `http://localhost:5173`
3. Navigate to Destinations
4. Hover and click the map button

## Troubleshooting

### Map does not appear

- Check the destination coordinates are valid.
- Refresh the modal by closing and reopening it.
- Open the map directly with the "Open in Google Maps" link.

### No API key prompt

There should be no API key prompt for the current MapModal.

## Notes

- This version is intentionally API-free.
- The map uses the standard Google Maps embed URL and is suitable for previewing locations.
