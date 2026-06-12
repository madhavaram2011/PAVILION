import { FiStar, FiThumbsUp } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { Review } from '../../types'
import { format } from 'date-fns'

interface ReviewCardProps {
  review: Review
  index?: number
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-card border border-earth-50"
    >
      {/* Stars */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}
          />
        ))}
      </div>

      {/* Title & body */}
      <h4 className="font-display text-lg text-stone-800 mb-2">{review.title}</h4>
      <p className="text-stone-500 text-sm leading-relaxed line-clamp-4 mb-4">"{review.body}"</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-earth-100 border-2 border-earth-200">
            {review.user.avatar ? (
              <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-accent font-bold text-earth-600 text-sm">
                {review.user.name[0]}
              </div>
            )}
          </div>
          <div>
            <p className="font-accent font-semibold text-sm text-stone-700">{review.user.name}</p>
            <p className="text-stone-400 text-xs">
              {format(new Date(review.createdAt), 'MMM yyyy')}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-stone-400 hover:text-forest-600 text-xs font-accent transition-colors">
          <FiThumbsUp size={13} />
          <span>{review.helpful}</span>
        </button>
      </div>
    </motion.div>
  )
}