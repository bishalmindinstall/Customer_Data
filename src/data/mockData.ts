export interface CustomerPurchase {
  id: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary';
  item: string;
  category: 'Clothing' | 'Accessories' | 'Footwear' | 'Outerwear';
  purchaseAmount: number;
  reviewRating: number;
  subscriptionStatus: 'Yes' | 'No';
  purchaseFrequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Venmo' | 'Cash' | 'Debit Card';
  location: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const ITEMS_BY_CATEGORY = {
  Clothing: ['T-shirt', 'Jeans', 'Sweater', 'Dress', 'Shorts', 'Skirt', 'Blouse', 'Pants'],
  Accessories: ['Belt', 'Hat', 'Scarf', 'Jewelry', 'Sunglasses', 'Handbag', 'Backpack'],
  Footwear: ['Sneakers', 'Boots', 'Sandals', 'Heels', 'Loafers'],
  Outerwear: ['Jacket', 'Coat', 'Raincoat', 'Windbreaker']
};

export const generateMockData = (count: number = 200): CustomerPurchase[] => {
  const data: CustomerPurchase[] = [];
  const categories = Object.keys(ITEMS_BY_CATEGORY) as (keyof typeof ITEMS_BY_CATEGORY)[];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'] as const;
  const frequencies = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'] as const;
  const payments = ['Credit Card', 'PayPal', 'Venmo', 'Cash', 'Debit Card'] as const;
  const genders = ['Male', 'Female', 'Non-binary'] as const;

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const items = ITEMS_BY_CATEGORY[category];
    const item = items[Math.floor(Math.random() * items.length)];

    data.push({
      id: `CUST-${1000 + i}`,
      age: Math.floor(Math.random() * (70 - 18 + 1)) + 18,
      gender: genders[Math.floor(Math.random() * genders.length)],
      item,
      category,
      purchaseAmount: parseFloat((Math.random() * (150 - 15) + 15).toFixed(2)),
      reviewRating: parseFloat((Math.random() * (5 - 2) + 2).toFixed(1)),
      subscriptionStatus: Math.random() > 0.7 ? 'Yes' : 'No',
      purchaseFrequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      paymentMethod: payments[Math.floor(Math.random() * payments.length)],
      location: US_STATES[Math.floor(Math.random() * US_STATES.length)],
      season: seasons[Math.floor(Math.random() * seasons.length)],
    });
  }
  return data;
};

export const mockData = generateMockData(500);
