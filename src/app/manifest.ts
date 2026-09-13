import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sahajway Impex - Premium Indian B2B Export House",
    short_name: "Sahajway Impex",
    description:
      "A luxury B2B global trade partner exporting premium textiles, custom apparel, Jaipuri quilts, and canvas bags from Anand, Gujarat, India.",
    start_url: "/",
    display: "standalone",
    background_color: "#030810",
    theme_color: "#030810",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "shopping", "productivity"],
    lang: "en-US",
    dir: "ltr",
  };
}
