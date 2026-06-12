// Indian city points mapped to India SVG viewBox (0-500 x, 0-600 y)

export interface IndiaPoint {
  id: string
  city: string
  state: string
  region: string
  px: number
  py: number
  isMajor: boolean
}

export const INDIA_POINTS: IndiaPoint[] = [
  // ── North India ─────────────────────────────────────────────────
  { id: 'delhi',       city: 'Delhi',       state: 'Delhi',             region: 'North India', px: 250, py: 160, isMajor: true  },
  { id: 'agra',        city: 'Agra',        state: 'Uttar Pradesh',     region: 'North India', px: 260, py: 185, isMajor: true  },
  { id: 'jaipur',      city: 'Jaipur',      state: 'Rajasthan',         region: 'North India', px: 215, py: 180, isMajor: true  },
  { id: 'varanasi',    city: 'Varanasi',     state: 'Uttar Pradesh',    region: 'North India', px: 310, py: 195, isMajor: true  },
  { id: 'lucknow',     city: 'Lucknow',     state: 'Uttar Pradesh',     region: 'North India', px: 290, py: 180, isMajor: false },
  { id: 'amritsar',    city: 'Amritsar',    state: 'Punjab',            region: 'North India', px: 225, py: 120, isMajor: false },
  { id: 'chandigarh',  city: 'Chandigarh',  state: 'Chandigarh',        region: 'North India', px: 240, py: 130, isMajor: false },
  { id: 'rishikesh',   city: 'Rishikesh',   state: 'Uttarakhand',       region: 'North India', px: 255, py: 138, isMajor: true  },
  { id: 'manali',      city: 'Manali',      state: 'Himachal Pradesh',  region: 'North India', px: 240, py: 108, isMajor: true  },
  { id: 'shimla',      city: 'Shimla',      state: 'Himachal Pradesh',  region: 'North India', px: 235, py: 118, isMajor: false },
  { id: 'leh',         city: 'Leh',         state: 'Ladakh',            region: 'North India', px: 245, py: 68,  isMajor: true  },
  { id: 'srinagar',    city: 'Srinagar',    state: 'Jammu & Kashmir',   region: 'North India', px: 225, py: 82,  isMajor: false },
  { id: 'udaipur',     city: 'Udaipur',     state: 'Rajasthan',         region: 'North India', px: 200, py: 205, isMajor: true  },
  { id: 'jaisalmer',   city: 'Jaisalmer',   state: 'Rajasthan',         region: 'North India', px: 170, py: 190, isMajor: true  },
  { id: 'jodhpur',     city: 'Jodhpur',     state: 'Rajasthan',         region: 'North India', px: 190, py: 200, isMajor: false },

  // ── West India ──────────────────────────────────────────────────
  { id: 'mumbai',      city: 'Mumbai',      state: 'Maharashtra',       region: 'West India',  px: 190, py: 310, isMajor: true  },
  { id: 'pune',        city: 'Pune',        state: 'Maharashtra',       region: 'West India',  px: 205, py: 320, isMajor: false },
  { id: 'goa',         city: 'Goa',         state: 'Goa',               region: 'West India',  px: 195, py: 365, isMajor: true  },
  { id: 'ahmedabad',   city: 'Ahmedabad',   state: 'Gujarat',           region: 'West India',  px: 185, py: 245, isMajor: false },
  { id: 'aurangabad',  city: 'Aurangabad',  state: 'Maharashtra',       region: 'West India',  px: 215, py: 295, isMajor: false },

  // ── South India ─────────────────────────────────────────────────
  { id: 'bangalore',   city: 'Bangalore',   state: 'Karnataka',         region: 'South India', px: 235, py: 405, isMajor: true  },
  { id: 'mysore',      city: 'Mysore',      state: 'Karnataka',         region: 'South India', px: 225, py: 420, isMajor: false },
  { id: 'hampi',       city: 'Hampi',       state: 'Karnataka',         region: 'South India', px: 225, py: 380, isMajor: true  },
  { id: 'kochi',       city: 'Kochi',       state: 'Kerala',            region: 'South India', px: 225, py: 460, isMajor: true  },
  { id: 'munnar',      city: 'Munnar',      state: 'Kerala',            region: 'South India', px: 240, py: 445, isMajor: true  },
  { id: 'alleppey',    city: 'Alleppey',    state: 'Kerala',            region: 'South India', px: 225, py: 470, isMajor: false },
  { id: 'chennai',     city: 'Chennai',     state: 'Tamil Nadu',        region: 'South India', px: 275, py: 410, isMajor: true  },
  { id: 'ooty',        city: 'Ooty',        state: 'Tamil Nadu',        region: 'South India', px: 240, py: 430, isMajor: false },
  { id: 'madurai',     city: 'Madurai',     state: 'Tamil Nadu',        region: 'South India', px: 255, py: 460, isMajor: false },
  { id: 'pondicherry', city: 'Pondicherry', state: 'Puducherry',        region: 'South India', px: 270, py: 430, isMajor: false },
  { id: 'hyderabad',   city: 'Hyderabad',   state: 'Telangana',         region: 'South India', px: 255, py: 350, isMajor: true  },

  // ── East India ──────────────────────────────────────────────────
  { id: 'kolkata',     city: 'Kolkata',     state: 'West Bengal',       region: 'East India',  px: 345, py: 245, isMajor: true  },
  { id: 'darjeeling',  city: 'Darjeeling',  state: 'West Bengal',       region: 'East India',  px: 340, py: 195, isMajor: true  },
  { id: 'puri',        city: 'Puri',        state: 'Odisha',            region: 'East India',  px: 330, py: 290, isMajor: false },
  { id: 'bhubaneswar', city: 'Bhubaneswar', state: 'Odisha',            region: 'East India',  px: 325, py: 280, isMajor: false },
  { id: 'patna',       city: 'Patna',       state: 'Bihar',             region: 'East India',  px: 320, py: 200, isMajor: false },
  { id: 'bodhgaya',    city: 'Bodh Gaya',   state: 'Bihar',             region: 'East India',  px: 315, py: 210, isMajor: false },

  // ── Northeast India ─────────────────────────────────────────────
  { id: 'guwahati',    city: 'Guwahati',    state: 'Assam',             region: 'Northeast India', px: 375, py: 185, isMajor: true  },
  { id: 'kaziranga',   city: 'Kaziranga',   state: 'Assam',             region: 'Northeast India', px: 390, py: 185, isMajor: true  },
  { id: 'shillong',    city: 'Shillong',    state: 'Meghalaya',         region: 'Northeast India', px: 380, py: 195, isMajor: false },
  { id: 'gangtok',     city: 'Gangtok',     state: 'Sikkim',            region: 'Northeast India', px: 350, py: 188, isMajor: false },

  // ── Islands ─────────────────────────────────────────────────────
  { id: 'portblair',   city: 'Port Blair',  state: 'Andaman & Nicobar', region: 'Islands',     px: 385, py: 420, isMajor: true  },
  { id: 'havelock',    city: 'Havelock',    state: 'Andaman & Nicobar', region: 'Islands',     px: 390, py: 410, isMajor: false },
]

// Also keep old export for backward compatibility
export { INDIA_POINTS as COUNTRY_POINTS }
export type { IndiaPoint as CountryPoint }