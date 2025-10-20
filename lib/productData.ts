export interface ProductFeature {
  title: string;
  description: string;
  icon: string; 
}

export interface ProductTable {
  type: 'table';
  headers: string[];
  rows: (string | number)[][];
}

export interface ProductList {
    type: 'list';
    items: string[];
}

export interface ProductDetail {
  slug: string;
  name: string;
  bank: string;
  type: string;
  tagline: string;
  highlights: ProductFeature[];
  sections: {
    title: string;
    icon: string; 
    content: (ProductFeature | ProductTable | ProductList | { title: string, description: string })[];
  }[];
}

const RTA_CARD_DATA: ProductDetail = {
    slug: 'rta-credit-card',
    name: 'RTA Credit Card',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'The ultimate card for transport and fuel cashback.',
    highlights: [
        { title: '10% Cashback', description: 'On Fuel Spends & RTA Transport Payments.', icon: 'percent' },
        { title: 'No Annual Fee', description: 'Enjoy all the benefits with zero membership charges.', icon: 'award' },
        { title: 'Built-in Nol Card', description: 'Seamlessly access the RTA transport network.', icon: 'briefcase' },
        { title: 'Shariah Compliant', description: 'Based on Murabaha structure.', icon: 'shield' },
    ],
    sections: [
        {
            title: 'Cashback Structure',
            icon: 'percent',
            content: [
                {
                    type: 'table',
                    headers: ['Category', 'Rate', 'Cap/Month'],
                    rows: [
                        ['RTA Transport Payments', '10%', 'AED 75'],
                        ['Fuel Stations', '10%', 'AED 75'],
                        ['International Spends', '2.25%', 'Unlimited'],
                        ['Domestic Spends', '1.25%', 'Unlimited'],
                        ['Grocery & Supermarkets', '1%', 'Unlimited'],
                    ],
                },
                {
                    type: 'list',
                    items: [
                        'Minimum Monthly Spend: AED 1,000 retail spend per statement cycle (effective March 1, 2025).',
                        'Cashback earned only on transactions up to assigned credit limit per month.',
                        'Minimum Redemption: 300 Cashback Points (1 Point = 1 AED).',
                        'Validity: 2 years from date of earning.'
                    ]
                }
            ],
        },
        {
            title: 'Built-in Nol & Salik Features',
            icon: 'briefcase',
            content: [
                 { title: 'Dual Account Functionality', description: 'Built-in Nol Chip for transit and a standard Credit Card Account for purchases. Both accounts are linked for authorized top-ups.' },
                 { title: 'Transit Access Facilities', description: 'Access Metro (Regular Class), Bus Services, Water Bus, Parking Meters, and Monthly Pass Products.' },
                 { title: 'Auto Top-Up Details', description: 'Triggers at AED 20 balance threshold with options of AED 50/100/200 funded from the credit card limit.' },
                 { title: 'Salik Auto Top-Up Facility', description: 'Automatically tops up your Salik account when the balance drops to AED 20 or lower.' },
            ]
        },
        {
            title: 'Lifestyle & Protection',
            icon: 'award',
            content: [
                { title: 'Complimentary Reel Cinemas Tickets', description: 'Up to 2 "Buy 1 Get 1" complimentary tickets monthly with a minimum spend of AED 3,000.' },
                { title: 'Complimentary Valet Parking', description: '1 complimentary valet parking service monthly at select locations with a minimum spend of AED 3,000.' },
                { title: 'Extended Warranty', description: 'Automatically doubles the original manufacturer\'s warranty up to 1 year.' },
                { title: 'Purchase Protection', description: 'Coverage against loss, theft, or accidental damage within 90 days of purchase.' },
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                {
                    type: 'table',
                    headers: ['Fee Type', 'Amount'],
                    rows: [
                        ['Annual Membership Fee', 'FREE'],
                        ['Monthly Profit Rate', '3.69%'],
                        ['APR (Purchase & Cash Advance)', '44.28%'],
                        ['Late Payment Fee', 'AED 131.25 / AED 225'],
                        ['Replacement Card Fee', 'AED 78.75'],
                    ],
                }
            ]
        }
    ]
};

const SWITCH_CARD_DATA: ProductDetail = {
    slug: 'switch-cashback-visa-signature',
    name: 'Switch Cashback Visa Signature',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'Switchable rewards that adapt to your lifestyle.',
    highlights: [
        { title: 'Up to 8% Cashback', description: 'Switchable rewards - Choose Lifestyle or Travel category monthly.', icon: 'percent' },
        { title: 'AED 500 Welcome Bonus', description: 'Earn on AED 15,000 spend within 60 days of approval.', icon: 'award' },
        { title: 'Unlimited Lounge Access', description: '1,200+ airport lounges worldwide for you and supplementary cardholders.', icon: 'briefcase' },
        { title: 'No Annual Fee Year 1', description: 'AED 299 from Year 2, waived with AED 30,000 annual spend.', icon: 'shield' },
    ],
    sections: [
        {
            title: 'Switchable Cashback Details',
            icon: 'percent',
            content: [
                { title: 'Choose Your Category Monthly', description: 'Switch between Lifestyle or Travel via EI+ App. Eligibility requires a minimum spend of AED 2,500 per month.' },
                {
                    type: 'table',
                    headers: ['Lifestyle Category', 'Rate', 'Cap'],
                    rows: [
                        ['Fuel (Domestic)', '8%', 'AED 100'],
                        ['Supermarket', '4%', 'AED 200'],
                        ['Dining', '4%', 'AED 200'],
                        ['Education', '4%', 'AED 200'],
                    ],
                },
                 {
                    type: 'table',
                    headers: ['Travel Category', 'Rate', 'Cap'],
                    rows: [
                        ['Airlines', '4%', 'AED 200'],
                        ['Hotels', '4%', 'AED 200'],
                        ['Dining', '4%', 'AED 200'],
                    ],
                }
            ],
        },
        {
            title: 'Travel & Lifestyle Benefits',
            icon: 'award',
            content: [
                 { title: 'Unlimited Airport Lounge Access', description: 'Primary and ALL supplementary cardholders get access to 1,200+ lounges. Requires one foreign currency transaction (USD 1+) that posts at least 15 days before the visit for unlimited access.' },
                 { title: 'Meet & Greet Service', description: '2 services per year (Marhaba Bronze at DXB) with a minimum spend of AED 3,000.' },
                 { title: 'Complimentary Golf', description: '2 rounds per month at select courses with a minimum spend of AED 5,000.' },
                 { title: 'Cinema Offers', description: '2 "Buy 1 Get 1" tickets per month at Reel/Vox cinemas.' },
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                {
                    type: 'table',
                    headers: ['Fee Type', 'Amount'],
                    rows: [
                        ['Year 1 Fee', 'FREE'],
                        ['Year 2+ Fee', 'AED 299 (Waived on AED 30K annual spend)'],
                        ['APR', '44.28%'],
                        ['Profit-Free Period', 'Up to 55 days'],
                        ['Late Payment', 'AED 131.25'],
                    ],
                }
            ]
        }
    ]
};

const CASHBACK_PLUS_DATA: ProductDetail = {
    slug: 'cashback-plus',
    name: 'Cashback Plus',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'Multi-category premium cashback for your everyday spends.',
    highlights: [
        { title: '10% Cashback', description: 'On Groceries, Education, Dining & Telecom services.', icon: 'percent' },
        { title: 'Unlimited Lounge Access', description: 'Access 1,200+ airport lounges worldwide.', icon: 'briefcase' },
        { title: 'Annual Fee Waiver', description: 'Year 1 is free with AED 5K spend in 90 days.', icon: 'award' },
        { title: 'Golf & Valet Perks', description: 'Enjoy complimentary golf rounds and valet parking.', icon: 'star' }
    ],
    sections: [
        {
            title: 'Premium Cashback',
            icon: 'percent',
            content: [
                { type: 'list', items: [
                    '10% on Groceries (category specific caps)',
                    '10% on Education & Tuition',
                    '10% on Dining & Restaurants',
                    '10% on Telecom Services',
                    '1% on all other purchases'
                ]}
            ]
        },
        {
            title: 'Lifestyle Perks',
            icon: 'award',
            content: [
                { type: 'list', items: [
                    'Unlimited Lounge Access (1,200+ worldwide)',
                    '2 Golf Rounds/month (min AED 5K spend)',
                    '1 Valet Parking/month (min AED 3K spend)',
                    '2 Meet & Greet/year (min AED 3K spend)'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'AED 299'],
                    ['APR', '44.28%'],
                    ['Profit-Free Period', '55 days']
                ]}
            ]
        }
    ]
};

const FLEX_ELITE_DATA: ProductDetail = {
    slug: 'flex-elite',
    name: 'Flex Elite',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'Premium SmartMiles earning for the elite traveler.',
    highlights: [
        { title: '3.75 SmartMiles/AED', description: 'High earning rate on all your spends.', icon: 'star' },
        { title: 'Welcome Bonus', description: 'Get 1,750 SmartMiles upon joining.', icon: 'award' },
        { title: 'Unlimited Perks', description: 'Enjoy unlimited golf, valet parking, and lounge access (+1 guest).', icon: 'briefcase' },
        { title: 'Fee Waiver', description: 'First year free with AED 7.5K spend in 90 days.', icon: 'percent' }
    ],
    sections: [
        {
            title: 'SmartMiles Earning',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    '3.75 SmartMiles per AED 1 spent',
                    'Welcome Bonus: 1,750 SmartMiles',
                    'Redeem at 300+ Airlines worldwide',
                    'Book 180,000+ Hotels globally',
                    'Instant Purchase at any merchant'
                ]}
            ]
        },
        {
            title: 'Elite Benefits',
            icon: 'award',
            content: [
                { type: 'list', items: [
                    'Unlimited Golf (min AED 10K monthly spend)',
                    'Unlimited Valet Parking (min AED 5K spend)',
                    'Unlimited Lounge Access + 1 Guest',
                    '2 Meet & Greet/year (Marhaba Silver, min AED 5K)'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'AED 700'],
                    ['APR', '44.28%']
                ]}
            ]
        }
    ]
};

const FLEX_CARD_DATA: ProductDetail = {
    slug: 'flex-credit-card',
    name: 'Flex',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'Flexible rewards with absolutely no annual fee.',
    highlights: [
        { title: 'No Annual Fee', description: 'A perfect entry card with zero annual charges.', icon: 'award' },
        { title: '2.25 SmartMiles/AED', description: 'Earn miles on all your spends.', icon: 'star' },
        { title: 'Flexible Redemption', description: 'Redeem at 300+ airlines and 180,000+ hotels.', icon: 'briefcase' }
    ],
    sections: [
        {
            title: 'SmartMiles Program',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    '2.25 SmartMiles per AED 1 spent',
                    'Instant Purchase Feature available',
                    'Redeem at 300+ Airlines',
                    'Book at 180,000+ Hotels',
                    'Flexible redemption options'
                ]}
            ]
        },
        {
            title: 'Basic Benefits',
            icon: 'shield',
            content: [
                { type: 'list', items: [
                    'No annual fee - perfect entry card',
                    'Extended Warranty (2x manufacturer warranty)',
                    'Purchase Protection (90 days coverage)',
                    '24/7 Emergency Travel Assistance'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'FREE'],
                    ['APR', '44.28%'],
                    ['Profit-Free Period', '55 days']
                ]}
            ]
        }
    ]
};

const SKYWARDS_BLACK_DATA: ProductDetail = {
    slug: 'skywards-black-credit-card',
    name: 'Skywards Black',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'The ultimate ultra-premium card for Emirates flyers.',
    highlights: [
        { title: '3.5 Skywards Miles/USD', description: 'The highest miles earning rate.', icon: 'star' },
        { title: 'Skywards Silver & Gold', description: 'Automatic Silver Membership & Fast Track to Gold.', icon: 'award' },
        { title: 'Lowest APR', description: 'Benefit from the lowest APR at 39%.', icon: 'percent' },
        { title: 'Premium Perks', description: 'Unlimited golf, valet, and lounge access.', icon: 'briefcase' }
    ],
    sections: [
        {
            title: 'Miles & Status',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    '3.5 Skywards Miles per USD 1 spent',
                    'Automatic Skywards Silver Membership',
                    'Fast Track to Emirates Skywards Gold Tier',
                    'Complimentary tier fee included'
                ]}
            ]
        },
        {
            title: 'Premium Perks',
            icon: 'award',
            content: [
                { type: 'list', items: [
                    'Unlimited Golf (min AED 10K monthly spend)',
                    '3 Valet Parking/month (min AED 5K spend)',
                    'Unlimited Lounge Access + 1 Guest',
                    '2 Meet & Greet/year (Marhaba Silver, min AED 5K)',
                    'Emergency Cash Advance (up to USD 5K)'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'AED 5,775'],
                    ['APR', '39%'],
                    ['Miles per USD', '3.5']
                ]}
            ]
        }
    ]
};

const ETIHAD_PREMIUM_DATA: ProductDetail = {
    slug: 'etihad-guest-premium',
    name: 'Etihad Guest Premium',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'The ultra-premium card for Etihad flyers.',
    highlights: [
        { title: '3.5 Etihad Miles/USD', description: 'High miles earning rate.', icon: 'star' },
        { title: 'Etihad Gold Status', description: 'Fast Track to Etihad Guest Gold Status.', icon: 'award' },
        { title: 'Miles Discount', description: 'Get 60% Miles Discount Vouchers.', icon: 'percent' },
        { title: 'Airport Transfers', description: 'Complimentary airport transfers.', icon: 'briefcase' }
    ],
    sections: [
        {
            title: 'Miles & Status',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    '3.5 Etihad Guest Miles per USD 1 spent',
                    'Fast Track to Etihad Guest Gold Status',
                    '60% Miles Discount Vouchers (up to 2)',
                    'Complimentary Airport Transfers'
                ]}
            ]
        },
        {
            title: 'Premium Lifestyle',
            icon: 'award',
            content: [
                { type: 'list', items: [
                    'Unlimited Golf (min AED 10K monthly spend)',
                    '2 Valet Parking/month (min AED 5K spend)',
                    'Unlimited Lounge Access + 1 Guest'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { title: 'Fee Waivers', description: 'Year 1: FREE with AED 7.5K spend in 90 days. Ongoing: FREE with AED 150K annual spend.'},
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'AED 1,500'],
                    ['APR', '44.28%'],
                    ['Miles per USD', '3.5']
                ]}
            ]
        }
    ]
};

const EMARATI_CARD_DATA: ProductDetail = {
    slug: 'emarati-credit-card',
    name: 'Emarati',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'Exclusive benefits for UAE Nationals with no annual fee.',
    highlights: [
        { title: 'No Annual Fee', description: 'Enjoy exclusive benefits with zero annual charges.', icon: 'award' },
        { title: '3.75 SmartMiles/AED', description: 'High rewards earning rate on all spends.', icon: 'star' },
        { title: 'Welcome Bonus', description: 'Get 1,000 SmartMiles as a welcome gift.', icon: 'percent' },
        { title: 'Lifestyle Offers', description: '50% off talabat, cinema tickets, and more.', icon: 'briefcase' }
    ],
    sections: [
        {
            title: 'SmartMiles & Offers',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    'Welcome Bonus: 1,000 SmartMiles',
                    '3.75 SmartMiles per AED 1 spent',
                    '50% Discount on talabat Orders',
                    'Buy 1 Get 1 at Roxy Cinemas',
                    'Redeem at 300+ Airlines'
                ]}
            ]
        },
        {
            title: 'Lifestyle Benefits',
            icon: 'award',
            content: [
                { type: 'list', items: [
                    '2 Cinema Tickets/month (min AED 3K spend)',
                    '1 Valet Parking/month (min AED 3K spend)',
                    'Nol Card Auto Top-up (AED 50/100/200)',
                    'Extended Warranty & Purchase Protection'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'FREE'],
                    ['APR', '44.28%'],
                    ['Welcome Bonus', 'AED 1,000']
                ]}
            ]
        }
    ]
};

const SKYWARDS_INFINITE_DATA: ProductDetail = {
    slug: 'skywards-infinite-credit-card',
    name: 'Skywards Infinite',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'The premium card for Emirates flyers seeking status and perks.',
    highlights: [
        { title: '2 Skywards Miles/USD', description: 'Earn miles on all your purchases.', icon: 'star' },
        { title: 'Skywards Silver Status', description: 'Automatic Skywards Silver Status.', icon: 'award' },
        { title: 'Premium Perks', description: 'Unlimited golf, valet, and lounge access.', icon: 'briefcase' },
        { title: 'Fee Waiver', description: 'First year free with AED 30K spend in 180 days.', icon: 'percent' }
    ],
    sections: [
        {
            title: 'Miles & Membership',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    '2 Skywards Miles per USD 1 spent',
                    'Automatic Skywards Silver Status',
                    'Simplified tier tracking'
                ]}
            ]
        },
        {
            title: 'Lifestyle Perks',
            icon: 'award',
            content: [
                { type: 'list', items: [
                    'Unlimited Golf (min AED 10K monthly spend)',
                    '2 Valet Parking/month (min AED 5K spend)',
                    'Unlimited Lounge Access + 1 Guest'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'AED 2,100'],
                    ['APR', '44.28%'],
                    ['Miles per USD', '2']
                ]}
            ]
        }
    ]
};

const ETIHAD_SAQER_DATA: ProductDetail = {
    slug: 'etihad-guest-saqer',
    name: 'Etihad Guest Saqer',
    bank: 'Emirates Islamic Bank',
    type: 'Credit Card',
    tagline: 'The mid-premium card for the frequent Etihad traveler.',
    highlights: [
        { title: '3 Etihad Miles/USD', description: 'Excellent miles earning rate.', icon: 'star' },
        { title: 'Etihad Silver Status', description: 'Fast Track to Etihad Guest Silver Status.', icon: 'award' },
        { title: 'Miles Discount', description: 'Get a 25% Miles Discount Voucher.', icon: 'percent' },
        { title: 'Travel Benefits', description: 'Lounge access and complimentary airport transfers.', icon: 'briefcase' }
    ],
    sections: [
        {
            title: 'Miles & Status',
            icon: 'star',
            content: [
                { type: 'list', items: [
                    '3 Etihad Miles per USD 1 spent',
                    'Fast Track to Etihad Guest Silver Status',
                    '25% Miles Discount Voucher',
                    'Complimentary Airport Transfers'
                ]}
            ]
        },
        {
            title: 'Travel Benefits',
            icon: 'briefcase',
            content: [
                { type: 'list', items: [
                    '2 Golf Rounds/month (min AED 5K spend)',
                    '1 Valet Parking/month (min AED 3K spend)',
                    'Unlimited Lounge Access'
                ]}
            ]
        },
        {
            title: 'Fees & Charges',
            icon: 'shield',
            content: [
                { type: 'table', headers: ['Fee Type', 'Amount'], rows: [
                    ['Annual Fee', 'AED 944'],
                    ['APR', '44.28%'],
                    ['Miles per USD', '3']
                ]}
            ]
        }
    ]
};


export const productDetailsData = [
    RTA_CARD_DATA, 
    SWITCH_CARD_DATA,
    CASHBACK_PLUS_DATA,
    FLEX_ELITE_DATA,
    FLEX_CARD_DATA,
    SKYWARDS_BLACK_DATA,
    ETIHAD_PREMIUM_DATA,
    EMARATI_CARD_DATA,
    SKYWARDS_INFINITE_DATA,
    ETIHAD_SAQER_DATA
];