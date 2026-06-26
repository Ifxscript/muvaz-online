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

// Nigerian states (alphabetical, FCT first)
export const NIGERIA_STATES = [
  'Abuja (FCT)', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
  'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi',
  'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

// Major LGAs / districts per state
export const STATE_LGAS = {
  'Abuja (FCT)': ['Garki', 'Wuse', 'Maitama', 'Asokoro', 'Gwarinpa', 'Kubwa', 'Lugbe', 'Kado', 'Jabi', 'Utako', 'Bwari', 'Gwagwalada', 'Kuje', 'Abaji'],
  'Lagos':       ['Ikeja', 'Lagos Island', 'Lagos Mainland', 'Surulere', 'Alimosho', 'Eti-Osa', 'Lekki', 'Kosofe', 'Mushin', 'Oshodi-Isolo', 'Ikorodu', 'Badagry', 'Epe', 'Amuwo-Odofin', 'Apapa'],
  'Kano':        ['Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Nasarawa', 'Tarauni', 'Ungogo', 'Kumbotso', 'Dawakin Tofa', 'Kura'],
  'Rivers':      ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Emohua', 'Etche', 'Oyigbo', 'Degema', 'Asari-Toru', 'Bonny'],
  'Oyo':         ['Ibadan North', 'Ibadan South', 'Ibadan South-West', 'Ibadan North-East', 'Akinyele', 'Egbeda', 'Oluyole', 'Ona-Ara', 'Oyo East', 'Ogbomosho'],
  'Kaduna':      ['Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Zaria', 'Sabon Gari', 'Birnin Gwari', 'Soba', 'Kauru'],
  'Anambra':     ['Awka North', 'Awka South', 'Onitsha North', 'Onitsha South', 'Nnewi North', 'Nnewi South', 'Aguata', 'Ihiala', 'Ogbaru', 'Ekwusigo'],
  'Edo':         ['Oredo', 'Ikpoba-Okha', 'Egor', 'Ovia North-East', 'Ovia South-West', 'Uhunmwonde', 'Akoko-Edo', 'Etsako East', 'Etsako West', 'Owan East'],
  'Delta':       ['Warri South', 'Warri North', 'Warri South-West', 'Uvwie', 'Ethiope East', 'Ethiope West', 'Sapele', 'Oshimili North', 'Oshimili South', 'Okpe'],
  'Enugu':       ['Enugu North', 'Enugu South', 'Udi', 'Awgu', 'Nkanu East', 'Nkanu West', 'Oji River', 'Ezeagu', 'Aninri', 'Igbo-Eze North'],
  'Imo':         ['Owerri Municipal', 'Owerri North', 'Owerri West', 'Ihitte-Uboma', 'Ikeduru', 'Mbaitoli', 'Ngor Okpala', 'Obowo', 'Ohaji-Egbema', 'Okigwe'],
  'Ogun':        ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ifo', 'Sagamu', 'Ikenne', 'Odeda', 'Obafemi-Owode', 'Ewekoro', 'Ijebu Ode'],
  'Plateau':     ['Jos North', 'Jos South', 'Jos East', 'Mangu', 'Barkin Ladi', 'Riyom', 'Bassa', 'Bokkos', 'Kanke', 'Pankshin'],
  'Cross River': ['Calabar Municipal', 'Calabar South', 'Akpabuyo', 'Biase', 'Boki', 'Etung', 'Ikom', 'Obubra', 'Obudu', 'Odukpani'],
  'Akwa Ibom':   ['Uyo', 'Ikot Ekpene', 'Eket', 'Obot Akara', 'Abak', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ini', 'Nsit Ibom'],
  'Kwara':       ['Ilorin East', 'Ilorin West', 'Ilorin South', 'Asa', 'Baruten', 'Edu', 'Ifelodun', 'Irepodun', 'Moro', 'Offa'],
  'Borno':       ['Maiduguri', 'Jere', 'Konduga', 'Biu', 'Hawul', 'Mafa', 'Magumeri', 'Mobbar', 'Monguno', 'Kukawa'],
  'Nasarawa':    ['Lafia', 'Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Nassarawa Eggon', 'Obi'],
  'Niger':       ['Minna', 'Bida', 'Suleja', 'Kontagora', 'Agaie', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara'],
  'Abia':        ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Umuahia North'],
  'Ekiti':       ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido/Osi', 'Ijero', 'Ikere'],
  'Osun':        ['Osogbo', 'Ile-Ife', 'Ilesa East', 'Ilesa West', 'Iwo', 'Ede North', 'Ede South', 'Ejigbo', 'Ifedayo', 'Ila'],
  'Ondo':        ['Akure North', 'Akure South', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Oke Igbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East'],
}
