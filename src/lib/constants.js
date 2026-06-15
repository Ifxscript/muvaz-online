// Condition enum values exactly as the backend expects them
export const CONDITIONS = [
  { value: 'LIKE_NEW', label: 'Like new' },
  { value: 'GREAT',    label: 'Great'    },
  { value: 'GOOD',     label: 'Good'     },
  { value: 'FAIR',     label: 'Fair'     },
]

// Map backend enum → display label
export const CONDITION_LABEL = Object.fromEntries(CONDITIONS.map(c => [c.value, c.label]))

// Map display label → backend enum (for legacy / filter use)
export const CONDITION_VALUE = Object.fromEntries(CONDITIONS.map(c => [c.label, c.value]))

// Categories (free-form strings — backend accepts any value)
export const CATEGORIES = [
  'Furniture', 'Electronics', 'Clothing & Shoes', 'Books & Media',
  'Sports & Fitness', 'Kitchen', 'Garden & Outdoor', 'Toys & Games',
  'Art & Collectibles', 'Music', 'Cameras', 'Baby & Kids',
  'Office', 'Health & Beauty', 'Bicycles', 'Cars & Vehicles',
  'Tools & DIY', 'Home Décor', 'Jewellery', 'Other',
]

// Browse filter category chips (subset)
export const BROWSE_CATS = ['All', 'Furniture', 'Electronics', 'Clothing & Shoes', 'Sports & Fitness', 'Kitchen', 'Other']

// Browse filter condition chips (All + backend enum values)
export const BROWSE_CONDITIONS = ['All', ...CONDITIONS.map(c => c.value)]
