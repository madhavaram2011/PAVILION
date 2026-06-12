// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'guide'
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ─── Destination ─────────────────────────────────────────────────────────────
export interface Destination {
  _id: string
  name: string
  country: string
  continent: string
  description: string
  shortDescription: string
  images: string[]
  coverImage: string
  rating: number
  reviewCount: number
  category: DestinationCategory[]
  climate: string
  bestTimeToVisit: string
  currency: string
  language: string
  isFeatured: boolean
  popularActivities: string[]
  createdAt: string
}

export type DestinationCategory =
  | 'beach'
  | 'mountain'
  | 'city'
  | 'wildlife'
  | 'desert'
  | 'forest'
  | 'cultural'
  | 'adventure'

// ─── Tour ────────────────────────────────────────────────────────────────────
export interface Tour {
  _id: string
  title: string
  slug: string
  destination: Destination
  description: string
  shortDescription: string
  coverImage: string
  images: string[]
  price: number
  discountPrice?: number
  duration: number // days
  groupSize: { min: number; max: number }
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme'
  category: TourCategory
  includes: string[]
  excludes: string[]
  highlights: string[]
  itinerary: ItineraryDay[]
  rating: number
  reviewCount: number
  isFeatured: boolean
  isAvailable: boolean
  startDates: string[]
  guide: User
  createdAt: string
}

export type TourCategory =
  | 'hiking'
  | 'safari'
  | 'beach'
  | 'cultural'
  | 'adventure'
  | 'luxury'
  | 'budget'
  | 'family'

export interface ItineraryDay {
  day: number
  title: string
  description: string
  accommodation?: string
  meals?: string[]
  activities: string[]
}

// ─── Booking ─────────────────────────────────────────────────────────────────
export interface Booking {
  _id: string
  tour: Tour
  user: User
  startDate: string
  participants: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  specialRequests?: string
  createdAt: string
}

export interface ContactInfo {
  name: string
  email: string
  phone: string
}

export interface GuestInfo {
  adults: number
  children: number
  infants?: number
}

export interface BookingFormData {
  tourId: string
  travelDate: string
  returnDate?: string
  guests: GuestInfo
  contactInfo: ContactInfo
  specialRequests?: string
  payment?: Record<string, unknown>
}

// ─── Review ──────────────────────────────────────────────────────────────────
export interface Review {
  _id: string
  tour: string | Tour
  user: User
  rating: number
  title: string
  body: string
  helpful: number
  images?: string[]
  createdAt: string
}

export interface ReviewFormData {
  tourId: string
  rating: number
  title: string
  body: string
}

// ─── API helpers ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string>
}

// ─── Filters ─────────────────────────────────────────────────────────────────
export interface TourFilters {
  destination?: string
  category?: TourCategory
  difficulty?: Tour['difficulty']
  minPrice?: number
  maxPrice?: number
  duration?: number
  rating?: number
  page?: number
  limit?: number
  sort?: 'price' | '-price' | 'rating' | '-rating' | 'duration' | 'createdAt'
  search?: string
}

export interface DestinationFilters {
  continent?: string
  category?: DestinationCategory
  search?: string
  page?: number
  limit?: number
}