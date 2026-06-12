import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiArrowRight, FiMapPin } from 'react-icons/fi'
import type { Destination } from '../../types'

interface DestinationCardProps {
  destination: Destination
  index?: number
}

export default function DestinationCard({ destination, index = 0 }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <Link
        to={`/destinations/${destination._id}`}
        className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-black/[0.03]"
      >
        {/* Top Image Section (Magazine Style) */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[2rem]">
          <img
            src={destination.coverImage}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Subtle vignette/gradient for text readability if needed, but keeping it light for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-accent text-[10px] tracking-widest uppercase font-semibold shadow-sm">
                {destination.continent}
              </span>
              {destination.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-forest-600/90 backdrop-blur-md border border-forest-400/50 text-white font-accent text-[10px] tracking-widest uppercase font-semibold shadow-sm">
                  Featured
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/40 rounded-full px-3 py-1.5 shadow-sm">
              <FiStar className="fill-white text-white" size={12} />
              <span className="font-accent text-white text-[11px] font-bold tracking-wider">{destination.rating}</span>
            </div>
          </div>
        </div>

        {/* Bottom Content Section */}
        <div className="relative flex flex-col flex-1 p-6 bg-white z-10 -mt-6 rounded-t-[2rem] transition-transform duration-500 group-hover:-translate-y-2">
          
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <FiMapPin className="text-forest-600" size={14} />
              <p className="font-accent text-xs tracking-[0.2em] uppercase text-stone-500 font-medium">
                {destination.country}
              </p>
            </div>
            <h3 className="font-display text-3xl text-stone-800 font-bold leading-tight group-hover:text-forest-700 transition-colors">
              {destination.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2">
            {destination.shortDescription}
          </p>

          {/* Footer / CTA */}
          <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex -space-x-2">
               {/* Decorative dots for categories */}
               {destination.category.slice(0, 3).map((cat, i) => (
                 <div key={cat} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-earth-100 relative group/tooltip" style={{ zIndex: 3 - i }}>
                    <span className="text-[8px] font-bold text-earth-600 uppercase">{cat[0]}</span>
                 </div>
               ))}
               <span className="ml-4 text-[10px] text-stone-400 font-accent uppercase tracking-wider pl-2">
                 {destination.category.length} Types
               </span>
            </div>
            
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-earth-50 text-forest-700 group-hover:bg-forest-600 group-hover:text-white transition-colors duration-300">
              <FiArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}