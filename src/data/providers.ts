import { Provider } from '@/components/user/ProviderCard';

/** category slug → display label */
export const CATEGORY_MAP: Record<string, string> = {
  '1': 'Electrician',
  '2': 'Plumber',
  '3': 'Beautician',
  '4': 'Mechanic',
  '5': 'Carpenter',
  '6': 'AC Repair',
  '7': 'Painter',
  '8': 'Appliance Repair',
  '9': 'Gardener',
};

/** Mock providers grouped by category id */
export const PROVIDERS: Record<string, Provider[]> = {
  '1': [
    {
      id: 1, initials: 'RP', name: 'Ram Prasad Shrestha', service: 'Electrician',
      experience: '8 yrs', location: 'Kathmandu', area: 'Thamel', rating: 4.9,
      reviews: 134, price: 800, available: true, badge: 'Top Rated',
      description: 'Licensed electrician specialising in residential wiring, circuit boards, and solar installations.',
    },
    {
      id: 2, initials: 'AG', name: 'Anita Gurung', service: 'Electrician',
      experience: '4 yrs', location: 'Kathmandu', area: 'Koteshwor', rating: 4.6,
      reviews: 58, price: 600, available: true, badge: 'Verified',
      description: 'Skilled in electrical maintenance, fan installations, and light fixture setup.',
    },
  ],
  '2': [
    {
      id: 3, initials: 'ST', name: 'Suman Thapa', service: 'Plumber',
      experience: '6 yrs', location: 'Lalitpur', area: 'Pulchowk', rating: 4.7,
      reviews: 89, price: 700, available: true, badge: 'Verified',
      description: 'Expert in pipe fitting, bathroom installations, and leak repairs.',
    },
    {
      id: 4, initials: 'BK', name: 'Bishnu KC', service: 'Plumber',
      experience: '10 yrs', location: 'Kathmandu', area: 'Baneshwor', rating: 4.8,
      reviews: 167, price: 900, available: true, badge: 'Top Rated',
      description: 'Senior plumber with expertise in commercial and residential plumbing systems.',
    },
  ],
  '3': [
    {
      id: 5, initials: 'PS', name: 'Priya Shrestha', service: 'Beautician',
      experience: '5 yrs', location: 'Kathmandu', area: 'Lazimpat', rating: 4.9,
      reviews: 201, price: 700, available: true, badge: 'Top Rated',
      description: 'Specialises in bridal makeup, hair styling, and skincare treatments.',
    },
    {
      id: 6, initials: 'ST', name: 'Sita Tamang', service: 'Beautician',
      experience: '3 yrs', location: 'Lalitpur', area: 'Jawalakhel', rating: 4.8,
      reviews: 112, price: 500, available: true, badge: 'Verified',
      description: 'Home salon services including facial, waxing, and nail art.',
    },
  ],
};

// Fill remaining categories with placeholder providers
['4', '5', '6', '7', '8', '9'].forEach((catId) => {
  if (!PROVIDERS[catId]) {
    PROVIDERS[catId] = [
      {
        id: 100 + parseInt(catId),
        initials: 'SP',
        name: 'Service Professional',
        service: CATEGORY_MAP[catId],
        experience: '5 yrs',
        location: 'Kathmandu',
        area: 'Baneshwor',
        rating: 4.5,
        reviews: 45,
        price: 650,
        available: true,
        badge: 'Verified',
        description: `Professional ${CATEGORY_MAP[catId]?.toLowerCase()} service provider with verified credentials.`,
      },
    ];
  }
});

/** Get a specific provider by id across all categories */
export function getProviderById(providerId: number): Provider | undefined {
  for (const list of Object.values(PROVIDERS)) {
    const found = list.find(p => p.id === providerId);
    if (found) return found;
  }
  return undefined;
}

/** Provider detail data — extra fields for the detail page */
export interface ProviderDetail extends Provider {
  about: string;
  serviceAreas: string[];
  highlights: string[];
  certificates: { name: string; status: 'Valid' | 'Pending' }[];
  recentReviews: { name: string; initial: string; rating: number; comment: string; timeAgo: string }[];
  jobsDone: number;
}

export const PROVIDER_DETAILS: Record<number, ProviderDetail> = {
  1: {
    ...PROVIDERS['1'][0],
    about: 'Licensed electrician specialising in residential wiring, circuit boards, and solar installations.',
    serviceAreas: ['Thamel', 'Lazimpat', 'Baneshwor'],
    highlights: ['Verified & Background Checked', '97% Positive Ratings', 'On-time Arrival Guarantee', 'Insured Service'],
    certificates: [
      { name: 'Trade License / Skill Certificate', status: 'Valid' },
      { name: 'Electrical Work Permit', status: 'Valid' },
    ],
    recentReviews: [
      { name: 'Priya M.', initial: 'P', rating: 5, comment: 'Fantastic service! Arrived on time and fixed everything in one visit. Highly recommended.', timeAgo: '2 days ago' },
      { name: 'Rohan S.', initial: 'R', rating: 4, comment: 'Very professional. Explained the issue clearly before fixing. Reasonable charges.', timeAgo: '1 week ago' },
    ],
    jobsDone: 312,
  },
  2: {
    ...PROVIDERS['1'][1],
    about: 'Skilled in electrical maintenance, fan installations, and light fixture setup.',
    serviceAreas: ['Koteshwor', 'Jadibuti', 'Lokanthali'],
    highlights: ['Verified & Background Checked', '94% Positive Ratings', 'Affordable Pricing', 'Same Day Service'],
    certificates: [
      { name: 'Trade License / Skill Certificate', status: 'Valid' },
    ],
    recentReviews: [
      { name: 'Aman K.', initial: 'A', rating: 5, comment: 'Very efficient and polite. Fixed my fan in no time.', timeAgo: '3 days ago' },
    ],
    jobsDone: 156,
  },
  3: {
    ...PROVIDERS['2'][0],
    about: 'Expert in pipe fitting, bathroom installations, and leak repairs.',
    serviceAreas: ['Pulchowk', 'Mangalbazar', 'Patan'],
    highlights: ['Verified & Background Checked', '95% Positive Ratings', 'On-time Arrival Guarantee', 'Quality Materials'],
    certificates: [
      { name: 'Plumbing License', status: 'Valid' },
    ],
    recentReviews: [
      { name: 'Sita D.', initial: 'S', rating: 5, comment: 'Fixed a major leak that others couldn\'t. Great work!', timeAgo: '5 days ago' },
    ],
    jobsDone: 198,
  },
  5: {
    ...PROVIDERS['3'][0],
    about: 'Specialises in bridal makeup, hair styling, and skincare treatments.',
    serviceAreas: ['Lazimpat', 'Thamel', 'Durbar Marg'],
    highlights: ['Verified & Background Checked', '99% Positive Ratings', 'Premium Products Used', 'Bridal Specialist'],
    certificates: [
      { name: 'Beauty Certification', status: 'Valid' },
      { name: 'Cosmetology License', status: 'Valid' },
    ],
    recentReviews: [
      { name: 'Ritu B.', initial: 'R', rating: 5, comment: 'Best bridal makeup I\'ve ever had! Absolutely stunning results.', timeAgo: '1 day ago' },
      { name: 'Nisha P.', initial: 'N', rating: 5, comment: 'Amazing skills and very pleasant personality. 10/10 recommend.', timeAgo: '4 days ago' },
    ],
    jobsDone: 445,
  },
};
