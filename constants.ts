
export const INCOME_CATEGORIES = [
  'বেতন',
  'ব্যবসা',
  'উপহার',
  'ফ্রিল্যান্সিং',
  'অন্যান্য'
];

export const EXPENSE_CATEGORIES = [
  'খাবার',
  'পরিবহন',
  'বাড়ি ভাড়া',
  'কেনাকাটা',
  'বিল',
  'বিনোদন',
  'অন্যান্য'
];

// added QUICK_PRESETS for quick entry functionality
export const QUICK_PRESETS = [
  { icon: '☕', amount: 20, description: 'চা/কফি', category: 'খাবার', type: 'expense' as const },
  { icon: '🚌', amount: 30, description: 'বাস ভাড়া', category: 'পরিবহন', type: 'expense' as const },
  { icon: '🍔', amount: 150, description: 'দুপুরের খাবার', category: 'খাবার', type: 'expense' as const },
  { icon: '🛒', amount: 500, description: 'বাজার', category: 'কেনাকাটা', type: 'expense' as const },
  { icon: '💰', amount: 1000, description: 'ফ্রিল্যান্সিং', category: 'ফ্রিল্যান্সিং', type: 'income' as const },
  { icon: '🎁', amount: 500, description: 'উপহার', category: 'উপহার', type: 'income' as const },
];
