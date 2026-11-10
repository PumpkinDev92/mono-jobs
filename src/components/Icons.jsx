const P = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M2 20h20" /></>,
  heart: <path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20Z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>,
  code: <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  megaphone: <path d="M3 10v4a1 1 0 0 0 1 1h3l8 4V5L7 9H4a1 1 0 0 0-1 1ZM19 9a4 4 0 0 1 0 6" />,
  coins: <><circle cx="9" cy="9" r="6" /><path d="M15 9.2A6 6 0 1 1 9.2 15" /></>,
  truck: <><path d="M2 6h12v10H2zM14 10h4l4 3v3h-8" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  book: <path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5ZM8 7h8" />,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  coffee: <><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9ZM17 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  logout: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10" />,
  send: <path d="M21 3 3 10l7 3 3 7 8-17Z" />,
  check: <path d="m5 12 5 5 9-10" />,
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" />,
  building: <><rect x="4" y="3" width="11" height="18" rx="2" /><path d="M15 9h3a2 2 0 0 1 2 2v10H15M8 7h3M8 11h3M8 15h3" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2.2.6 4 2.2 4 5.2" /></>,
  trophy: <path d="M7 4h10v6a5 5 0 0 1-10 0V4ZM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 15v4M8 21h8" />,
  fire: <path d="M12 22c4 0 7-2.7 7-6.5 0-3-2-5-3.5-7-.5 2-1.5 3-3 3 0-3-1-6-4-8 0 4-3 6-3 11 0 4 2.5 7.5 6.5 7.5Z" />,
  apple: <path d="M16.5 12.5c0-2.4 2-3.4 2-3.4a4.4 4.4 0 0 0-3.5-1.9c-1.5-.1-2.9.9-3.6.9s-1.9-.9-3.1-.9C6.100 7.300 4 9.300 4 12.600c0 3.400 2.400 7.400 4.300 7.400 1 0 1.500-.6 2.800-.6s1.700.6 2.800.6c1.900 0 3.500-3.200 3.800-4.200-.1 0-2.200-.9-2.200-3.300ZM14.500 5.200c.7-.9 1.100-2.100 1-3.200-1 .1-2.200.7-2.900 1.600-.6.700-1.100 1.900-1 3 1.100.1 2.200-.5 2.900-1.400Z" />,
  play: <path d="M5 3.500v17a1 1 0 0 0 1.500.9l14-8.500a1 1 0 0 0 0-1.800l-14-8.500A1 1 0 0 0 5 3.500Z" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
};

export default function Icon({ name, size = 20, className = '', filled = false }) {
  return (
    <svg
      className={`ico ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}

export const CAT_ICON = {
  'IT та розробка': 'code',
  'Продажі': 'chart',
  'Маркетинг': 'megaphone',
  'Фінанси': 'coins',
  'Логістика': 'truck',
  'Освіта': 'book',
  'Медицина': 'cross',
  'Сфера обслуговування': 'coffee',
};

export const TYPE_ICON = {
  'Повна зайнятість': 'briefcase',
  'Часткова': 'clock',
  'Віддалено': 'laptop',
};
