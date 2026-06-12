import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiStar, FiArrowRight } from 'react-icons/fi'
import type { Tour } from '../../types'

interface TourCardProps {
  tour: Tour
  index?: number
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate:  'bg-amber-50 text-amber-700 border-amber-200',
  difficult: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function TourCard({ tour, index = 0 }: TourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/tours/${tour._id}`}
        className="group block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-stone-100 hover:border-stone-200 transition-all duration-500"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={tour.coverImage}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>

          {/* Tags */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-[10px] font-accent tracking-widest uppercase px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[tour.difficulty] || DIFFICULTY_COLORS.easy}`}>
              {tour.difficulty}
            </span>
            {tour.isFeatured && (
              <span className="text-[10px] font-accent tracking-widest uppercase px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 border border-forest-200">
                Featured
              </span>
            )}
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
            <span className="font-display text-lg font-bold text-stone-900">₹{tour.price.toLocaleString('en-IN')}</span>
            <span className="text-stone-400 text-xs ml-0.5">/ pp</span>
          </div>

          {/* Bottom location */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <FiMapPin size={12} className="text-white/80"/>
            <span className="font-accent text-[10px] tracking-wider text-white/90 uppercase">{tour.destination.name}, {tour.destination.country}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-xl text-stone-800 font-bold mb-2 group-hover:text-forest-700 transition-colors leading-tight">
            {tour.title}
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {tour.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiClock size={13} className="text-stone-400"/>
                <span className="font-accent text-xs text-stone-500">{tour.duration} days</span>
              </div>
              <div className="flex items-center gap-1">
                <FiStar size={13} className="text-amber-400 fill-amber-400"/>
                <span className="font-accent text-xs text-stone-700 font-semibold">{tour.rating.toFixed(1)}</span>
                <span className="text-stone-400 text-xs">({tour.reviewCount})</span>
              </div>
            </div>
            <span className="text-forest-600 font-accent text-[10px] tracking-widest uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              View <FiArrowRight size={10}/>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}