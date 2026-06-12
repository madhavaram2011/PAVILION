# MapModal Implementation Checklist ?

> NOTE: The current MapModal implementation uses a public Google Maps embed and does not require any API key.

## Setup Phase

- [ ] Verify `src/components/map/MapModal.tsx` exists
- [ ] Verify `DestinationsPage.tsx` opens the map modal for selected destinations
- [ ] No `VITE_GOOGLE_MAPS_API_KEY` is required
- [ ] Restart the dev server after code changes: `npm run dev`

## Functionality

- [ ] Map modal opens for the selected destination
- [ ] Google Maps preview loads in the iframe
- [ ] Open in Google Maps link works
- [ ] Get directions link works
- [ ] Plan trip button navigates to `/tours`
- [ ] Close button works
- [ ] ESC key closes the modal
- [ ] Modal is responsive on mobile
