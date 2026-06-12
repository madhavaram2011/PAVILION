import { FiStar } from 'react-icons/fi'

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  showNumber?: boolean
  reviewCount?: number
}

export default function StarRating({
  rating, max = 5, size = 16, showNumber = true, reviewCount,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <span key={i} className="relative inline-block">
              <FiStar size={size} className="text-stone-200" />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
                >
                  <FiStar size={size} className="fill-amber-400 text-amber-400" />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {showNumber && (
        <span className="font-accent font-semibold text-stone-700 text-sm">{rating}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-stone-400 text-xs">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  )
}