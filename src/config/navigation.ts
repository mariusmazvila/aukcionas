export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const mainNav: NavItem[] = [
  { label: 'Kaip veikia', href: '/#kaip-veikia' },
  { label: 'Kainodara', href: '/kainodara' },
  { label: 'Apie mus', href: '/#apie' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Produktas',
    items: [
      { label: 'Kaip veikia', href: '/#kaip-veikia' },
      { label: 'Kainodara', href: '/kainodara' },
      { label: 'Registruotis', href: '/registracija' },
    ],
  },
  {
    title: 'Įmonė',
    items: [
      { label: 'Apie mus', href: '/#apie' },
      { label: 'Privatumo politika', href: '/privatumas' },
      { label: 'Kontaktai', href: '/kontaktai' },
    ],
  },
];
