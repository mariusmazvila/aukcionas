// Navigacijos struktūra — redaguok čia, Header/Footer automatiškai atsinaujins.
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

// Pagrindinis meniu (Header + mobilusis meniu)
export const mainNav: NavItem[] = [
  { label: 'Pagrindinis', href: '/' },
  { label: 'Paslaugos', href: '/paslaugos' },
  { label: 'Darbai', href: '/darbai' },
  { label: 'Apie mus', href: '/apie-mus' },
  { label: 'Tinklaraštis', href: '/tinklarastis' },
  { label: 'Kontaktai', href: '/kontaktai' },
];

// Footer navigacijos stulpeliai
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Paslaugos',
    items: [
      { label: 'Elektros panelių statymas', href: '/paslaugos/elektros-paneliu-statymas' },
      { label: 'Montavimas', href: '/paslaugos/montavimas' },
      { label: 'Projektavimas', href: '/paslaugos/projektavimas' },
      { label: 'Visos paslaugos', href: '/paslaugos' },
    ],
  },
  {
    title: 'Įmonė',
    items: [
      { label: 'Apie mus', href: '/apie-mus' },
      { label: 'Mūsų darbai', href: '/darbai' },
      { label: 'Tinklaraštis', href: '/tinklarastis' },
      { label: 'Kontaktai', href: '/kontaktai' },
    ],
  },
];
