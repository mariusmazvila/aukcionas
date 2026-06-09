// TypeScript tipai Schema.org JSON-LD struktūrizuotiems duomenims.
// Naudojami StructuredData.astro komponente.

export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface ImageObject {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
}

export interface PersonOrOrganizationRef {
  "@type": "Person" | "Organization";
  name: string;
  url?: string;
}

// LocalBusiness — vietiniam verslui (pagrindinis tipas mūsų boilerplate'ui).
// ElectricalContractor tinka Innomode; keisk pagal klientą.
export interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness" | "ElectricalContractor" | "ProfessionalService" | "HomeAndConstructionBusiness";
  name: string;
  url?: string;
  email?: string;
  telephone?: string;
  description?: string;
  address?: PostalAddress;
  image?: string;
  logo?: string;
  openingHours?: string | string[];
  priceRange?: string;
  sameAs?: string[];
}

// Organization — bendra organizacija (be fizinės vietos reikalavimo)
export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url?: string;
  logo?: string | ImageObject;
  description?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  sameAs?: string[];
}

// Service — paslauga (tinka "Mūsų paslaugos" sekcijoms)
export interface ServiceSchema {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description?: string;
  provider?: PersonOrOrganizationRef;
  areaServed?: string | string[];
  serviceType?: string;
  url?: string;
}

// BlogPosting — blog straipsniams
export interface BlogPostingSchema {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description?: string;
  image?: string | ImageObject;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: PersonOrOrganizationRef;
  publisher?: PersonOrOrganizationRef;
  mainEntityOfPage?: string;
}

// BreadcrumbList — navigacijos breadcrumb'ams
export interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItem[];
}

// Union tipas — priimamas StructuredData.astro komponente
export type SchemaOrgType =
  | LocalBusinessSchema
  | OrganizationSchema
  | ServiceSchema
  | BlogPostingSchema
  | BreadcrumbListSchema;
