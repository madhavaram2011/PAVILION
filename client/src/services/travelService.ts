import api from './api'
import type {
  Tour,
  Destination,
  Review,
  Booking,
  BookingFormData,
  ReviewFormData,
  PaginatedResponse,
  TourFilters,
  DestinationFilters,
} from '../types'

// ─── 1. Tours ─────────────────────────────────────────────────────────────────
export const tourService = {
  getAll: async (filters: TourFilters = {}): Promise<PaginatedResponse<Tour>> => {
    const res = await api.get<PaginatedResponse<Tour>>('/tours', { params: filters })
    return res.data
  },

  getFeatured: async (): Promise<Tour[]> => {
    const res = await api.get<{ data: Tour[] }>('/tours/featured')
    return res.data.data
  },

  getBySlug: async (slug: string): Promise<Tour> => {
    const res = await api.get<{ data: { tour: Tour } }>(`/tours/${slug}`)
    return res.data.data.tour
  },

  getById: async (id: string): Promise<Tour> => {
    const res = await api.get<{ data: { tour: Tour } }>(`/tours/id/${id}`)
    return res.data.data.tour
  },
}

// ─── 2. Destinations ──────────────────────────────────────────────────────────
export const destinationService = {
  getAll: async (filters: DestinationFilters = {}): Promise<PaginatedResponse<Destination>> => {
    const res = await api.get<PaginatedResponse<Destination>>('/destinations', { params: filters })
    return res.data
  },

  getFeatured: async (): Promise<Destination[]> => {
    const res = await api.get<{ data: Destination[] }>('/destinations/featured')
    return res.data.data
  },

  getById: async (id: string): Promise<Destination> => {
    const res = await api.get<{ data: Destination }>(`/destinations/${id}`)
    return res.data.data
  },

  getBySlug: async (slug: string): Promise<{ destination: any; nearbyTours: any[] }> => {
    const res = await api.get<{ data: { destination: any; nearbyTours: any[] } }>(`/destinations/${slug}`)
    return res.data.data   // { destination, nearbyTours }
  },

  getByRegion: async (region: string): Promise<Destination[]> => {
    const res = await api.get<{ data: Destination[] }>(`/destinations/region/${region}`)
    return res.data.data
  },
}

// ─── 3. Bookings ──────────────────────────────────────────────────────────────
export const bookingService = {
  create: async (data: BookingFormData): Promise<Booking> => {
    // Backend returns { status, data: { booking } }
    const res = await api.post<{ data: { booking: Booking } }>('/bookings', data)
    return res.data.data.booking
  },

  getMyBookings: async (): Promise<Booking[]> => {
    // Backend returns { status, data: { bookings } }
    const res = await api.get<{ data: { bookings: Booking[] } }>('/bookings/my')
    return res.data.data.bookings ?? []
  },

  // alias expected by frontend
  getMine: async (): Promise<Booking[]> => {
    const res = await api.get<{ data: { bookings: Booking[] } }>('/bookings/my')
    return res.data.data.bookings ?? []
  },

  cancel: async (bookingId: string): Promise<Booking> => {
    const res = await api.patch<{ data: { booking: Booking } }>(`/bookings/${bookingId}/cancel`)
    return res.data.data.booking
  },
}

// ─── 4. Reviews ───────────────────────────────────────────────────────────────
export const reviewService = {
  getByTour: async (tourId: string): Promise<Review[]> => {
    const res = await api.get<{ data: Review[] }>(`/reviews/tour/${tourId}`)
    return res.data.data
  },

  create: async (data: ReviewFormData): Promise<Review> => {
    const res = await api.post<{ data: Review }>('/reviews', data)
    return res.data.data
  },

  markHelpful: async (reviewId: string): Promise<void> => {
    await api.patch(`/reviews/${reviewId}/helpful`)
  },
}

// ─── 5. Aggregator (references all four above — must come last) ───────────────
export const travelService = {
  getFeaturedTours:       tourService.getFeatured,
  getAllTours:             tourService.getAll,
  getTourBySlug:          tourService.getBySlug,
  getAllDestinations:      destinationService.getAll,
  getDestinationBySlug:   destinationService.getBySlug,
  getDestinations:        destinationService.getAll,
  getMyBookings:          bookingService.getMyBookings,
}
