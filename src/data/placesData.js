// ==========================================================================
// MANGALORE PLACES TO VISIT — CURATED DATASET
// Complete coastal Karnataka travel attractions & souvenir memories
// ==========================================================================

export const PLACES_CATEGORIES = [
  { id: 'all', label: 'All Places', icon: 'fa-solid fa-table-cells-large' },
  { id: 'beaches', label: 'Beaches', icon: 'fa-solid fa-umbrella-beach' },
  { id: 'rivers', label: 'Rivers & Backwaters', icon: 'fa-solid fa-water' },
  { id: 'hills', label: 'Hills & Viewpoints', icon: 'fa-solid fa-mountain-sun' },
  { id: 'temples', label: 'Temples & Heritage', icon: 'fa-solid fa-gopuram' },
  { id: 'nature', label: 'Nature & Wildlife', icon: 'fa-solid fa-leaf' },
  { id: 'cultural', label: 'Cultural & Historic', icon: 'fa-solid fa-landmark' },
  { id: 'food', label: 'Food & Markets', icon: 'fa-solid fa-utensils' }
];

export const PLACES_LIST = [
  {
    id: 'kaup-lighthouse',
    name: 'Kaup (Kapu) Lighthouse Beach',
    category: 'beaches',
    categoryLabel: 'Beaches',
    subtitle: 'Iconic 1901 British Lighthouse on Rocky Coastal Bluffs',
    image: '/assets/images/mangalore-lighthouse-hero.jpg',
    rating: 4.9,
    reviewCount: 3840,
    distance: '38 km from City Center',
    timing: '5:00 AM – 7:30 PM (Lighthouse stairs: 4 PM – 6 PM)',
    bestTime: 'October to March (Sunset view)',
    entryFee: 'Beach Free / ₹10 for Lighthouse',
    tags: ['Sunset Point', 'Panoramic Sea View', 'Rocky Shores', 'Photography'],
    description: 'Perched on high granite boulders, the 27-meter tall Kaup Lighthouse has guided Arabian Sea ships since 1901. Climbing its spiral stairs offers unforgettable 360-degree vistas of crashing waves, coastline, and golden sunsets.',
    souvenirTip: 'Capture your sunset silhouette photo and get it printed on an LED Glowing Acrylic Frame!'
  },
  {
    id: 'panambur-beach',
    name: 'Panambur Beach',
    category: 'beaches',
    categoryLabel: 'Beaches',
    subtitle: 'Vibrant Golden Sand Beach with International Kite Festivals',
    image: '/assets/images/mangalore-beach-polaroid.jpg',
    rating: 4.8,
    reviewCount: 4210,
    distance: '10 km from Mangalore City',
    timing: '6:00 AM – 8:00 PM',
    bestTime: 'Evenings / International Kite Festival in Jan',
    entryFee: 'Free entry / Parking ₹30',
    tags: ['Water Sports', 'Camel Rides', 'Beach Carnival', 'Safe Swimming'],
    description: 'Mangalore’s most popular, cleanest, and safe beach. Renowned for jet skiing, banana boat rides, camel rides, and the annual vibrant Kite Festival. Enjoy hot beachside coastal street snacks as the sun dips below the horizon.',
    souvenirTip: 'Order a personalized travel tumbler or mug celebrating Panambur beach memories.'
  },
  {
    id: 'kudroli-temple',
    name: 'Kudroli Gokarnanatheshwara Temple',
    category: 'temples',
    categoryLabel: 'Temples & Heritage',
    subtitle: 'Golden Chola Architecture & Famed Mangalore Dasara Center',
    image: '/assets/images/mangalore-temple-polaroid.jpg',
    rating: 4.9,
    reviewCount: 5120,
    distance: '3 km from Hampankatta',
    timing: '6:00 AM – 1:00 PM & 4:00 PM – 9:00 PM',
    bestTime: 'Dasara Navaratri & Evening Aarti',
    entryFee: 'Free entry',
    tags: ['Spiritual', 'Chola Architecture', 'Golden Gopuram', 'Mangalore Dasara'],
    description: 'Consecrated in 1912 by reformer Narayana Guru, this grand shrine features magnificent Dravidian-style tiered gopurams coated in shimmering gold, marble courtyards, and grand lighting during the legendary 10-day Mangalore Dasara.',
    souvenirTip: 'Gift your family a laser-engraved wooden deity plaque or commemorative photo album.'
  },
  {
    id: 'gurupura-backwaters',
    name: 'Gurupura & Netravati River Backwaters',
    category: 'rivers',
    categoryLabel: 'Rivers & Backwaters',
    subtitle: 'Serene Estuary Cruises, Mangroves & Fisherman Boats',
    image: '/assets/images/mangalore-boating-polaroid.jpg',
    rating: 4.7,
    reviewCount: 1650,
    distance: '7 km from City Center',
    timing: '6:30 AM – 6:30 PM',
    bestTime: 'Morning Bird Watching or Evening Boat Ride',
    entryFee: 'Boating: ₹150 – ₹300 per person',
    tags: ['Boating', 'Mangrove Forest', 'Bird Watching', 'Sangama Estuary'],
    description: 'Experience tranquil coastal Kerala-like backwaters right inside Mangalore. Wooden boats glide through serene waterways flanked by dense coconut plantations, kingfishers, and the confluence of Netravati and Gurupura rivers into the sea.',
    souvenirTip: 'Turn scenic cruise snapshots into custom engraved wood keychains and coasters.'
  },
  {
    id: 'tannirbhavi-beach',
    name: 'Tannirbhavi Beach & Tree Park',
    category: 'beaches',
    categoryLabel: 'Beaches',
    subtitle: 'Pristine Pine Trees, Ferry Rides & Peaceful Surf',
    image: '/assets/images/mangalore-beach-polaroid.jpg',
    rating: 4.8,
    reviewCount: 3100,
    distance: '12 km by road (or 5 min ferry from Sultan Battery)',
    timing: '6:00 AM – 7:30 PM',
    bestTime: 'Late afternoon through sunset',
    entryFee: 'Free (Ferry ₹10 per person)',
    tags: ['Pine Forest', 'Ferry Ride', 'Quiet Sunset', 'Tree Park'],
    description: 'Less crowded and remarkably serene, Tannirbhavi is backed by a lush coastal Tree Park with walking tracks, herbal gardens, and beachfront hammocks. Taking the local boat ferry from Sultan Battery is a cherished traveler ritual.',
    souvenirTip: 'Create an engraved wooden keepsake photo frame with coastal coordinate engravings.'
  },
  {
    id: 'pilikula-nisargadhama',
    name: 'Pilikula Nisargadhama Eco Park',
    category: 'nature',
    categoryLabel: 'Nature & Wildlife',
    subtitle: 'Botanical Gardens, Heritage Village, Lake & 3D Planetarium',
    image: '/assets/images/mangalore-boating-polaroid.jpg',
    rating: 4.8,
    reviewCount: 2980,
    distance: '14 km from Central Mangalore',
    timing: '9:30 AM – 5:30 PM (Closed Mondays)',
    bestTime: 'Full Day Outing (Oct – Feb)',
    entryFee: 'Combo Ticket: ₹120 – ₹200',
    tags: ['Eco Park', 'Heritage Village', 'Planetarium', 'Boating Lake', 'Zoo'],
    description: 'An integrated 370-acre eco-educational sanctuary. Features a traditional Tuluva artisan heritage village demonstrating pottery and handloom weaving, an open biological zoo, scenic boating lake, and India’s first 3D Hybrid Planetarium.',
    souvenirTip: 'Personalize family vacation memories on custom insulated stainless steel bottles.'
  },
  {
    id: 'st-aloysius-chapel',
    name: 'St. Aloysius Chapel & Heritage Frescoes',
    category: 'cultural',
    categoryLabel: 'Cultural & Historic',
    subtitle: 'The "Sistine Chapel of India" Painted by Brother Moscheni (1899)',
    image: '/assets/images/mangalore-temple-polaroid.jpg',
    rating: 4.9,
    reviewCount: 2450,
    distance: '1 km from Light House Hill',
    timing: '9:00 AM – 1:00 PM & 2:30 PM – 5:00 PM',
    bestTime: 'Morning hours',
    entryFee: 'Free (Donation appreciated)',
    tags: ['Italian Frescoes', 'Heritage Art', '1899 Architecture', 'Historic'],
    description: 'Built in 1880 atop Lighthouse Hill, this chapel holds world-renowned Italian frescoes covering every square inch of walls and vaulted ceilings, painted by Jesuit missionary Antony Moscheni in the style of the Vatican’s Sistine Chapel.',
    souvenirTip: 'Turn stunning architectural details into high-gloss canvas wall art for your home.'
  },
  {
    id: 'sultan-battery',
    name: 'Sultan Battery Watchtower',
    category: 'cultural',
    categoryLabel: 'Cultural & Historic',
    subtitle: '1784 Tipu Sultan Naval Watchtower in Black Basalt Rock',
    image: '/assets/images/mangalore-lighthouse-hero.jpg',
    rating: 4.6,
    reviewCount: 1820,
    distance: '6 km from City Center (Boloor)',
    timing: '8:00 AM – 6:30 PM',
    bestTime: 'Late afternoon, paired with Tannirbhavi Ferry',
    entryFee: 'Free',
    tags: ['Historical Fort', 'Naval Outpost', 'River View', 'Ferry Ghat'],
    description: 'Erected by Tipu Sultan in 1784 to defend the Gurupura river from British naval warships, this basalt watchtower resembles a mini fortress. Climb up for breezy river panoramas and board passenger ferries across to Tannirbhavi.',
    souvenirTip: 'Commemorate historic visits with custom laser-engraved desk organizers and pen stands.'
  },
  {
    id: 'surathkal-beach-hill',
    name: 'Surathkal Beach & Lighthouse Hill',
    category: 'hills',
    categoryLabel: 'Hills & Viewpoints',
    subtitle: 'Elevated Sea Cliff Views, Sadashiva Temple & NITK Beach',
    image: '/assets/images/mangalore-lighthouse-hero.jpg',
    rating: 4.8,
    reviewCount: 2150,
    distance: '16 km North along NH 66',
    timing: '5:30 AM – 7:30 PM',
    bestTime: 'Sunset & Breezy Evenings',
    entryFee: 'Free',
    tags: ['Hilltop Temple', 'Sea Cliff', 'Lighthouse View', 'Golden Coast'],
    description: 'Surathkal Beach is famed for the ancient Sadashiva Temple perched on a coastal hill directly overlooking the crashing Arabian Sea. The lighthouse hill offers sweeping vantage points across miles of foaming shoreline.',
    souvenirTip: 'Personalize an elegant engraved photo crystal or wooden desktop plaque.'
  },
  {
    id: 'mangalore-food-trail',
    name: 'Pabba’s & Mangalore Coastal Culinary Trail',
    category: 'food',
    categoryLabel: 'Food & Markets',
    subtitle: 'Legendary "Gadbad" Ice Cream, Ghee Roast & Fish Curry',
    image: '/assets/images/mangalore-boating-polaroid.jpg',
    rating: 4.9,
    reviewCount: 8900,
    distance: 'Hampankatta & Lalbagh',
    timing: '10:00 AM – 11:00 PM',
    bestTime: 'Post-dinner sweet treat or lunch food crawl',
    entryFee: 'Varies by item (Gadbad ~₹120)',
    tags: ['Food Trail', 'Gadbad Ice Cream', 'Seafood', 'Neer Dosa'],
    description: 'No Mangalore visit is complete without tasting Pabba’s world-famous multi-layered Gadbad ice cream, fresh Neer Dosa with chicken sukka, and authentic Kundapur Ghee Roast across bustling food lanes.',
    souvenirTip: 'Design your own foodie custom chef mug or engraved kitchen cutting board with Fine Gift Studio!'
  }
];

export const MANGALORE_TRAVEL_TIPS = [
  {
    q: 'What is the best season to explore tourist places in Mangalore?',
    a: 'October to March offers pleasant coastal weather, comfortable sea breezes, and clear blue skies ideal for beaches, heritage walks, and lighthouse visits.'
  },
  {
    q: 'How do I travel between beaches and temples in Mangalore?',
    a: 'Mangalore has exceptional local private and KSRTC bus networks, readily available auto-rickshaws, and taxi rentals. The scenic passenger ferry from Sultan Battery to Tannirbhavi Beach takes only 5 minutes!'
  },
  {
    q: 'Can I turn my vacation photos into customized gifts in Mangalore?',
    a: 'Absolutely! Fine Gift Studio specializes in turning your travel memories—from Kaup Lighthouse to temple visits—into premium laser-engraved wooden frames, acrylic photo blocks, travel tumblers, and personalized souvenirs.'
  }
];
