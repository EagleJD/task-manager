export const TASK_CATEGORIES = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'study', label: 'Study' },
];

export const CATEGORY_LABELS = Object.fromEntries(
  TASK_CATEGORIES.map((category) => [category.value, category.label])
);

export const PRIORITY_LABELS = {
  high: '긴급',
  medium: '보통',
  low: '여유',
};

export function normalizeCategory(category) {
  const value = String(category ?? '')
    .trim()
    .toLowerCase();

  if (value === 'work' || value === 'personal' || value === 'study') {
    return value;
  }

  return 'personal';
}
