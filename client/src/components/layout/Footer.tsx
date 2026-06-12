import { Link } from 'react-router-dom'
import { GiCompass } from 'react-icons/gi'
import {
  FiInstagram, FiFacebook, FiTwitter, FiYoutube,
  FiMail, FiPhone, FiMapPin,
} from 'react-icons/fi'

const DESTINATIONS = ['Rajasthan', 'Kerala', 'Ladakh', 'Goa', 'Varanasi']
const TOURS = ['Heritage Trails', 'Backwater Cruises', 'Mountain Treks', 'Beach Escapes', 'Spiritual Journeys']
const COMPANY = ['About Us', 'How It Works', 'Travel Guides', 'Careers', 'Press']

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Top CTA strip */}
      <div className="bg-gradient-to-r from-forest-700 via-moss to-earth-700 py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-accent text-xs tracking-[0.3em] uppercase text-forest-200 mb-3">
            Start your journey
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            Ready to explore<br />
            <em>Incredible India?</em>
          </h2>
          <p className="text-forest-100 mb-8 max-w-md mx-auto">
            Join thousands of travellers who have discovered India's most extraordinary destinations with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/tours"
              className="bg-white text-forest-800 font-accent font-semibold tracking-widest uppercase text-sm px-8 py-3 rounded-full hover:bg-earth-50 transition-colors"
            >
              Explore Tours
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/60 text-white font-accent font-semibold tracking-widest uppercase text-sm px-8 py-3 rounded-full hover:border-white hover:bg-white/10 transition-all"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <GiCompass className="text-forest-400" size={30} />
              <div>
                <span className="font-display text-xl font-bold text-white block leading-none">Pavilion</span>
                <span className="font-accent text-[9px] tracking-[0.3em] uppercase text-sand leading-none">Curated Indian Journeys</span>
              </div>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-xs">
              We craft unforgettable travel experiences across India — from the Himalayas to the backwaters, guided by certified local experts.
            </p>
            <div className="space-y-2.5">
              {[
                { icon: FiMail,    text: 'hello@pavilion.in' },
                { icon: FiPhone,   text: '+91 98765 43210' },
                { icon: FiMapPin,  text: 'Connaught Place, New Delhi, India' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-stone-400">
                  <Icon size={14} className="text-forest-400 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-accent text-xs tracking-[0.2em] uppercase text-stone-300 font-semibold mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5">
              {DESTINATIONS.map((d) => (
                <li key={d}>
                  <Link to="/destinations" className="text-sm text-stone-400 hover:text-forest-300 transition-colors">{d}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-accent text-xs tracking-[0.2em] uppercase text-stone-300 font-semibold mb-4">
              Tour Types
            </h4>
            <ul className="space-y-2.5">
              {TOURS.map((t) => (
                <li key={t}>
                  <Link to="/tours" className="text-sm text-stone-400 hover:text-forest-300 transition-colors">{t}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-accent text-xs tracking-[0.2em] uppercase text-stone-300 font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY.map((c) => (
                <li key={c}>
                  <Link to="/about" className="text-sm text-stone-400 hover:text-forest-300 transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-xs font-accent tracking-wider">
            © {new Date().getFullYear()} Pavilion India. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: FiInstagram, href: '#' },
              { icon: FiFacebook,  href: '#' },
              { icon: FiTwitter,   href: '#' },
              { icon: FiYoutube,   href: '#' },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href}
                className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-forest-700 hover:text-white transition-all"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
          <div className="flex gap-4 text-xs font-accent text-stone-500">
            <Link to="#" className="hover:text-stone-300">Privacy Policy</Link>
            <Link to="#" className="hover:text-stone-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}