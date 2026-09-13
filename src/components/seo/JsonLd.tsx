import React from "react";

interface JsonLdProps {
  schema: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Server Component helper to safely render Schema.org JSON-LD scripts
 */
export default function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
