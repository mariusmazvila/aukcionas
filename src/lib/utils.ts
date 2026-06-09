// Utility funkcijos — naudojamos per visą projektą.

/**
 * Sujungia CSS klases, filtruodamas tuščias/false reikšmes.
 * Naudok vietoje string concatenation Tailwind klasėms.
 * Pvz.: cn('px-4', isActive && 'bg-blue-500', undefined) → 'px-4 bg-blue-500'
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formatuoja ISO datos eilutę į lietuvišką formatą.
 * Pvz.: '2024-03-15' → '2024 m. kovo 15 d.'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Konvertuoja tekstą į URL-draugišką slug'ą.
 * Tvarko lietuviškas raides (ą→a, č→c ir t.t.).
 * Pvz.: 'Naujienos apie skydus' → 'naujienos-apie-skydus'
 */
export function slugify(text: string): string {
  const lithuanianMap: Record<string, string> = {
    ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s",
    ų: "u", ū: "u", ž: "z",
  };
  return text
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (char) => lithuanianMap[char] ?? char)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Grąžina visą puslapio URL iš siteUrl ir pathname.
 * Naudojama canonical ir OG URL generavimui.
 */
export function getCanonicalUrl(siteUrl: string, pathname: string): string {
  return new URL(pathname, siteUrl).href;
}
