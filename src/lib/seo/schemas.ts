/**
 * Centralized Schema.org JSON-LD generator for SEO, GEO, and AEO.
 * Supports Google Rich Results, Bing, Perplexity, ChatGPT, and semantic AI crawlers.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";
const COMPANY_NAME = "Sahajway Impex";
const COMPANY_LEGAL_NAME = "Sahajway Impex Private Limited";
const COMPANY_PHONE = "+91 96380 07789";
const COMPANY_EMAIL = "contact@sahajwayimpex.com";
const HQ_ADDRESS = {
  streetAddress: "Trade Hub, GIDC",
  addressLocality: "Anand",
  addressRegion: "Gujarat",
  postalCode: "388001",
  addressCountry: "IN",
};
const GEO_COORDINATES = {
  latitude: 22.5645,
  longitude: 72.9289,
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductSchemaInput {
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  sku?: string;
  moq?: string;
  leadTime?: string;
  specifications?: string[];
  updatedAt?: string;
}

/**
 * Root Organization Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_NAME,
    legalName: COMPANY_LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description:
      "Sahajway Impex is a premier Indian B2B export house specializing in handcrafted cotton textiles, Jaipuri quilts, canvas bags, and baby bathrobes from Anand, Gujarat to international retail and wholesale markets.",
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE,
    foundingDate: "2025-08",
    founder: [
      {
        "@type": "Person",
        name: "Prit Patel",
        jobTitle: "Managing Director (India)",
      },
    ],
    address: {
      "@type": "PostalAddress",
      ...HQ_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...GEO_COORDINATES,
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "European Union" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Japan" },
      { "@type": "Country", name: "Worldwide" },
    ],
    knowsAbout: [
      "B2B Textile Exports",
      "Organic Cotton Products",
      "Jaipuri Quilted Bedding",
      "Baby Bathrobes Wholesale",
      "Canvas & Quilted Tote Bags",
      "Custom Apparel Manufacturing",
      "Private Label Packaging",
      "International Freight & Incoterms",
    ],
    sameAs: [
      "https://linkedin.com",
      "https://instagram.com",
      "https://facebook.com",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY_PHONE,
        contactType: "sales and export desk",
        email: COMPANY_EMAIL,
        availableLanguage: ["English", "Hindi", "Gujarati"],
        areaServed: "Worldwide",
      },
    ],
  };
}

/**
 * LocalBusiness / Place Schema (Geographic Local and Regional Authority)
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": `${SITE_URL}/#localbusiness`,
    name: `${COMPANY_NAME} Global Export Desk`,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: COMPANY_PHONE,
    priceRange: "$$$",
    currenciesAccepted: "USD, EUR, GBP, AUD, INR",
    paymentAccepted: "Wire Transfer, Letter of Credit (L/C), T/T",
    address: {
      "@type": "PostalAddress",
      ...HQ_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...GEO_COORDINATES,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };
}

/**
 * WebSite Schema with Sitelinks SearchBox
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY_NAME,
    description: "Premium Indian B2B Textile & Export Platform",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-US",
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQPage Schema (Key for Answer Engine Optimization - AEO)
 */
export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Default High-Intent B2B Export FAQ Dataset
 */
export const defaultExportFAQs: FAQItem[] = [
  {
    question: "What products does Sahajway Impex export from India?",
    answer:
      "Sahajway Impex specializes in high-quality B2B export products including 100% GOTS organic cotton hand-block printed baby bathrobes, luxury Jaipuri double bed quilts (Mulmul cotton stuffed with organic carding), durable quilted canvas tote bags, and custom manufactured private-label apparel.",
  },
  {
    question: "What is the Minimum Order Quantity (MOQ) for international orders?",
    answer:
      "Our standard MOQs vary by product line: Baby bathrobes typically require 500 units, luxury double bed quilts require 100 units, and custom canvas tote bags require 1,000 units. For sample evaluation orders or multi-product consolidations, flexible MOQs can be arranged via our export desk.",
  },
  {
    question: "Which shipping ports and Incoterms does Sahajway Impex support?",
    answer:
      "We primarily ship sea freight through Mundra Port, Kandla Port, and Nhava Sheva (JNPT) Mumbai, alongside air cargo dispatch from Ahmedabad International Airport (AMD). We support FOB, CIF, CFR, and EXW Incoterms 2020.",
  },
  {
    question: "Does Sahajway Impex offer OEM / ODM and private labeling?",
    answer:
      "Yes. We offer complete OEM and ODM private label services including custom GSM specifications, custom block prints, tailored sizing, brand tag integration, barcode placement, and biodegradable retail packaging.",
  },
  {
    question: "What export documentation and certifications are provided?",
    answer:
      "Every export consignment includes a Certificate of Origin (COO), Commercial Invoice, Packing List, Bill of Lading (B/L) or Airway Bill (AWB), Phytosanitary Certificate (where applicable), and optional third-party quality inspection certificates (such as SGS or Intertek).",
  },
  {
    question: "Where is Sahajway Impex headquartered?",
    answer:
      "Sahajway Impex is headquartered in Anand, Gujarat, India (Coordinates: 22.5645° N, 72.9289° E), with regional liaison representatives in the United States.",
  },
  {
    question: "How long is the typical manufacturing and dispatch lead time?",
    answer:
      "Standard production lead times range between 25 to 45 business days post order confirmation and deposit, depending on order volume, customization complexity, and maritime shipping destination.",
  },
];

/**
 * Product Schema for Detailed E-Commerce & B2B Catalogs
 */
export function getProductSchema(product: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/products/${product.slug}#product`,
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [`${SITE_URL}/logo.png`],
    description: product.description,
    category: product.category,
    sku: product.sku || `SW-${product.slug.toUpperCase().slice(0, 8)}`,
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    brand: {
      "@type": "Brand",
      name: COMPANY_NAME,
    },
    manufacturer: {
      "@id": `${SITE_URL}/#organization`,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      price: "Contact for Quote",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: product.moq ? parseInt(product.moq.replace(/\D/g, "")) || 100 : 100,
        unitCode: "C62",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Origin",
        value: "Anand, Gujarat, India",
      },
      ...(product.moq
        ? [
            {
              "@type": "PropertyValue",
              name: "Minimum Order Quantity",
              value: product.moq,
            },
          ]
        : []),
      ...(product.leadTime
        ? [
            {
              "@type": "PropertyValue",
              name: "Lead Time",
              value: product.leadTime,
            },
          ]
        : []),
      ...(product.specifications || []).map((spec) => {
        const parts = spec.split(":");
        return {
          "@type": "PropertyValue",
          name: parts[0]?.trim() || "Specification",
          value: parts[1]?.trim() || spec,
        };
      }),
    ],
  };
}

/**
 * HowTo Schema: B2B Export Procurement & Sourcing Workflow
 */
export function getB2BProcurementHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Source and Import Handcrafted Textiles from India with Sahajway Impex",
    description:
      "A step-by-step guide for international retail buyers, wholesalers, and fashion brands to procure export-grade textiles and goods from Gujarat, India.",
    totalTime: "P30D",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Submit B2B Product Inquiry",
        text: "Select desired product lines from the Sahajway Impex catalog (e.g. Baby Bathrobes, Quilted Bedding, Canvas Bags) and submit specifications, estimated quantities, and target shipping destination.",
        url: `${SITE_URL}/contact`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Receive Quotation & Material Samples",
        text: "Our trade desk provides FOB/CIF pricing along with physical fabric swatch samples or pre-production units for verification.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Contract Finalization & Quality Production",
        text: "Formal export purchase agreement and proforma invoice are generated. Production commences at verified artisan clusters in Gujarat.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Quality Inspection & Port Dispatch",
        text: "Consignments undergo strict quality control (optional SGS checks) and are sealed in export packaging for transit via Mundra Port or air cargo.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Customs Clearance & Delivery",
        text: "Complete shipment documentation (Bill of Lading, COO, Packing List, Invoice) is released for seamless import customs clearance at the destination port.",
      },
    ],
  };
}
