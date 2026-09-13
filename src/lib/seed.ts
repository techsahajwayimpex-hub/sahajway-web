import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import CategoryModel from "@/lib/models/Category";
import TeamMemberModel from "@/lib/models/TeamMember";
import DestinationModel from "@/lib/models/Destination";
import BannerModel from "@/lib/models/Banner";
import UserModel from "@/lib/models/User";
import InquiryModel from "@/lib/models/Inquiry";

export async function seedMongoDB() {
  await connectDB();

  console.log("[Seeder] Starting MongoDB Atlas database seeding...");

  // 1. Seed Categories if empty
  const categoryCount = await CategoryModel.countDocuments();
  if (categoryCount === 0) {
    await CategoryModel.create([
      {
        name: "Textiles & Apparel",
        slug: "textiles-apparel",
        image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
        description: "Premium handcrafted Indian textiles, block printed fabrics, and heritage apparel.",
        status: true,
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
        description: "Luxury home furnishings, hand-stitched quilts, and traditional craftsmanship.",
        status: true,
      },
      {
        name: "Handcrafted Accessories",
        slug: "handcrafted-accessories",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        description: "Quilted cotton bags, pouches, and artisan-crafted travel goods for global retailers.",
        status: true,
      },
      {
        name: "Organic Cotton Goods",
        slug: "organic-cotton-goods",
        image: "https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?auto=format&fit=crop&w=800&q=80",
        description: "100% GOTS-certified organic cotton bathrobes, loungewear, and sustainable nursery textiles.",
        status: true,
      },
    ]);
    console.log("✓ Seeded Categories into MongoDB.");
  } else {
    console.log(`- Categories already present (${categoryCount} records).`);
  }

  // 2. Seed Products if empty
  const productCount = await ProductModel.countDocuments();
  if (productCount === 0) {
    await ProductModel.create([
      {
        name: "Hand-block Printed Baby Bathrobes",
        slug: "hand-block-printed-baby-bathrobes",
        shortDescription: "Ultra-soft organic cotton baby bathrobes featuring authentic Rajasthani hand-block printing.",
        description: "<p>Crafted from 100% organic cotton, these premium baby bathrobes combine visual heritage with modern comfort. Featuring safe, non-toxic dyes and beautiful artisan block prints, they are highly absorbent and gentle on sensitive baby skin.</p><p>Customized sizing, bespoke packaging with private labeling, and GOTS organic certification documents are provided with every batch.</p>",
        category: "Textiles & Apparel",
        images: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        ],
        specifications: [
          "Material: 100% Organic Cotton GOTS Certified",
          "Sizing: 0-6 months, 6-12 months, 1-2 years",
          "Dyes: Eco-friendly natural vegetable dyes",
          "Origin: Anand, Gujarat, India",
          "Weave: Handwoven waffle structure",
        ],
        features: [
          "Highly absorbent and breathable fabric",
          "Handmade using traditional block-printing woodblocks",
          "Reinforced double stitching for durability",
          "Hypoallergenic and free from harsh chemicals",
        ],
        exportInformation: "MOQ: 500 units. Packaging: Individually wrapped in biodegradable cornstarch bags, packed in 5-ply export-grade cartons. Lead Time: 30 days from order confirmation.",
        seoTitle: "Premium Hand-block Printed Baby Bathrobes | Sahajway Impex",
        seoDescription: "Exporting high-quality organic cotton hand-block printed baby bathrobes from India. Sustainable B2B manufacturing for global retailers.",
        status: true,
      },
      {
        name: "Jaipuri Double Bed Tagai Quilts",
        slug: "double-bed-quilts",
        shortDescription: "Hand-quilted premium double quilts stuffed with pure carded cotton and heritage block patterns.",
        description: "<p>A centerpiece of traditional Indian master weaving. These double bed quilts feature classic Jaipuri style prints on fine mulmul cotton. Each piece is hand-quilted by skilled artisans in rural craft clusters, offering unparalleled warmth, breathability, and timeless visual appeal.</p><p>Available in reversible patterns with customized edge piping and vacuum compression packaging for optimized container shipping.</p>",
        category: "Home Decor",
        images: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        ],
        specifications: [
          "Dimensions: 90 x 108 inches (Double Bed Standard)",
          "Outer fabric: 100% Mulmul Cotton (100 count)",
          "Filling: 100% Organic Carded Cotton",
          "Weight: Approx. 2.2 kg",
          "Washing: Dry clean or delicate wash",
        ],
        features: [
          "Meticulous hand-quilting stitches (tagai) throughout",
          "Reversible design with complementary block patterns",
          "Regulates body temperature for year-round comfort",
          "Sourced ethically directly from craft cooperatives",
        ],
        exportInformation: "MOQ: 100 units. Packaging: Vacuum compressed in heavy-duty polybags, boxed in seaworthy cardboard crates. Lead Time: 45 days.",
        seoTitle: "Luxury B2B Jaipuri Double Bed Quilts Exporter | Sahajway Impex",
        seoDescription: "Source luxury hand-quilted double bed quilts. Traditional Indian cotton craftsmanship made for global premium home markets.",
        status: true,
      },
      {
        name: "Quilted Canvas Tote Bags",
        slug: "quilted-tote-bags",
        shortDescription: "Chic, durable canvas quilted tote bags with artisan prints and heavy-duty metal zip enclosures.",
        description: "<p>A merge of daily convenience and luxury craftsmanship. These bags are reinforced with soft inner padding, heavy-duty stitching, and convenient inner pockets. Perfect as styling accessories or everyday carries, showcasing traditional designs in a highly functional form.</p>",
        category: "Handcrafted Accessories",
        images: [
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        ],
        specifications: [
          "Material: 100% Cotton Canvas Outer, Cotton Lining",
          "Dimensions: 16 x 14 x 5 inches",
          "Straps: 12-inch drop length canvas straps",
          "Closure: YKK metal zipper",
          "Pockets: 1 zippered inner pocket, 2 slide pouches",
        ],
        features: [
          "Thick quilted padding protects electronics and valuables",
          "Durable, load-tested seams to support daily travel loads",
          "Stunning geometric and block print colorways",
          "Machine washable and colorfast",
        ],
        exportInformation: "MOQ: 1000 units. Packaging: Flat packed in bundles of 50 inside waterproof export cartons. Lead Time: 25 days.",
        seoTitle: "Export Quilted Cotton Tote Bags Wholesaler | Sahajway Impex",
        seoDescription: "B2B manufacturing and export of premium quilted canvas tote bags. Custom branding and prints available for bulk international orders.",
        status: true,
      },
      {
        name: "Handmade Mulmul Kimono Robes",
        slug: "handmade-mulmul-kimono-robes",
        shortDescription: "Lightweight, breathable artisanal kimono robes made with pure handspun Indian cotton.",
        description: "<p>Designed for luxury spa, boutique hotel, and resort collections. These flowing robes feature deep pockets, adjustable tie belts, and artisanal botanical block prints crafted using traditional wooden stamp techniques.</p>",
        category: "Textiles & Apparel",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
        ],
        specifications: [
          "Material: 100% Breathable Mulmul Cotton",
          "Length: 48 inches (Ankle Length)",
          "Sizing: One Size Fits Most / Custom Sizing Available",
          "Belt: Matching 72-inch self-tie sash",
          "Care: Machine wash cold on gentle cycle",
        ],
        features: [
          "French-seamed interiors for a clean, non-chafe finish",
          "Dual reinforced front pockets",
          "Quick-drying and ultra-lightweight drape",
          "Available in pastel and rich jewel-tone dyes",
        ],
        exportInformation: "MOQ: 300 units. Custom private labeling and brand tags available. Lead Time: 20-30 days.",
        seoTitle: "Artisan Mulmul Kimono Robes B2B Wholesale | Sahajway Impex",
        seoDescription: "Wholesale export of handcrafted cotton kimono robes for hotels, spas, and boutique retailers globally.",
        status: true,
      },
    ]);
    console.log("✓ Seeded Products into MongoDB.");
  } else {
    console.log(`- Products already present (${productCount} records).`);
  }

  // 3. Seed Team Members if empty
  const teamCount = await TeamMemberModel.countDocuments();
  if (teamCount === 0) {
    await TeamMemberModel.create([
      {
        name: "Prit Patel",
        designation: "Managing Director (India)",
        country: "India",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
        bio: "Prit leads operational execution, artisan cluster sourcing, and export compliance in Anand, Gujarat. Dedicated to preserving authentic Indian craftsmanship while fulfilling strict international trade criteria.",
        email: "prit@sahajwayimpex.com",
        linkedin: "https://linkedin.com",
        displayOrder: 1,
        active: true,
      },
      {
        name: "US Trade Director",
        designation: "Managing Director (USA & Americas)",
        country: "United States",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
        bio: "Directing B2B distribution networks, importer partnerships, and international logistics across North America and European channels, connecting Indian artisans directly to global retail desks.",
        email: "contact@sahajwayimpex.com",
        linkedin: "https://linkedin.com",
        displayOrder: 2,
        active: true,
      },
      {
        name: "Anand Quality Control Lead",
        designation: "Head of Textile QC & Inspection",
        country: "India",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
        bio: "Supervises multi-tier quality checks, yarn tensile tests, and GOTS chemical compliance prior to container loading at Mundra and Kandla ports.",
        email: "qc@sahajwayimpex.com",
        linkedin: "https://linkedin.com",
        displayOrder: 3,
        active: true,
      },
    ]);
    console.log("✓ Seeded Team Members into MongoDB.");
  } else {
    console.log(`- Team members already present (${teamCount} records).`);
  }

  // 4. Seed Destinations if empty
  const destCount = await DestinationModel.countDocuments();
  if (destCount === 0) {
    await DestinationModel.create([
      {
        name: "New York, USA",
        country: "United States",
        lat: 40.7128,
        lon: -74.006,
        displayOrder: 1,
        active: true,
      },
      {
        name: "London, UK",
        country: "United Kingdom",
        lat: 51.5074,
        lon: -0.1278,
        displayOrder: 2,
        active: true,
      },
      {
        name: "Tokyo, Japan",
        country: "Japan",
        lat: 35.6762,
        lon: 139.6503,
        displayOrder: 3,
        active: true,
      },
      {
        name: "Sydney, Australia",
        country: "Australia",
        lat: -33.8688,
        lon: 151.2093,
        displayOrder: 4,
        active: true,
      },
      {
        name: "Frankfurt, Germany",
        country: "Germany",
        lat: 50.1109,
        lon: 8.6821,
        displayOrder: 5,
        active: true,
      },
      {
        name: "Dubai, UAE",
        country: "United Arab Emirates",
        lat: 25.2048,
        lon: 55.2708,
        displayOrder: 6,
        active: true,
      },
      {
        name: "Singapore",
        country: "Singapore",
        lat: 1.3521,
        lon: 103.8198,
        displayOrder: 7,
        active: true,
      },
      {
        name: "Rotterdam, Netherlands",
        country: "Netherlands",
        lat: 51.9244,
        lon: 4.4777,
        displayOrder: 8,
        active: true,
      },
    ]);
    console.log("✓ Seeded Trade Destinations into MongoDB.");
  } else {
    console.log(`- Trade destinations already present (${destCount} records).`);
  }

  // 5. Seed Banners if empty
  const bannerCount = await BannerModel.countDocuments();
  if (bannerCount === 0) {
    await BannerModel.create([
      {
        badge: "Global B2B Export House",
        title: "Connecting Indian Craftsmanship With Global Markets",
        highlightText: "Craftsmanship",
        subtitle: "Sahajway Impex supplies handcrafted cotton textiles, quilted accessories, baby bathrobes and premium loungewear to importers, retailers and private-label brands worldwide.",
        primaryButtonText: "Explore Products",
        primaryButtonLink: "/products",
        secondaryButtonText: "Contact Us",
        secondaryButtonLink: "/contact",
        image: "",
        showGlobe: true,
        backgroundColor: "bg-gradient-premium",
        backgroundImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=80",
        displayOrder: 1,
        active: true,
      },
      {
        badge: "Pure Organic Cotton & Artisan Heritage",
        title: "Handcrafted Luxury Quilts & Organic Baby Apparel",
        highlightText: "Luxury Quilts",
        subtitle: "Direct-from-source wholesale exporting of GOTS-certified baby bathrobes and authentic Jaipuri tagai quilts manufactured for international retail standards.",
        primaryButtonText: "View Quilts & Apparel",
        primaryButtonLink: "/products",
        secondaryButtonText: "Request B2B Quote",
        secondaryButtonLink: "/contact",
        image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80",
        showGlobe: false,
        backgroundColor: "bg-gradient-premium",
        backgroundImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=80",
        displayOrder: 2,
        active: true,
      },
      {
        badge: "Direct Sourcing from Anand, Gujarat",
        title: "Seaworthy Maritime Cargo & Custom OEM Manufacturing",
        highlightText: "Maritime Cargo",
        subtitle: "Full container load (FCL) and consolidated shipments dispatched directly from Mundra and Nhava Sheva ports with complete export documentation.",
        primaryButtonText: "Trade Desk",
        primaryButtonLink: "/contact",
        secondaryButtonText: "About Our Network",
        secondaryButtonLink: "/about",
        image: "",
        showGlobe: true,
        backgroundColor: "bg-gradient-premium",
        backgroundImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=80",
        displayOrder: 3,
        active: true,
      },
    ]);
    console.log("✓ Seeded Hero Banners into MongoDB.");
  } else {
    console.log(`- Hero banners already present (${bannerCount} records).`);
  }

  // 6. Seed Admin Users if empty
  const userCount = await UserModel.countDocuments();
  if (userCount === 0) {
    await UserModel.create([
      {
        clerkId: "user_admin_sahajway_1",
        email: "tech.sahajwayimpex@gmail.com",
        name: "Sahajway Admin",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        role: "admin",
        companyName: "Sahajway Impex HQ",
        country: "India",
        phone: "+91 96380 07789",
      },
      {
        clerkId: "user_admin_sahajway_2",
        email: "prit@sahajwayimpex.com",
        name: "Prit Patel",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
        role: "admin",
        companyName: "Sahajway Impex",
        country: "India",
        phone: "+91 96380 07789",
      },
    ]);
    console.log("✓ Seeded Admin Users into MongoDB.");
  } else {
    console.log(`- Users already present (${userCount} records).`);
  }

  // 7. Seed Sample Inquiries if empty
  const inqCount = await InquiryModel.countDocuments();
  if (inqCount === 0) {
    await InquiryModel.create([
      {
        name: "Alexander Mercer",
        companyName: "Mercer Global Trade LLC",
        email: "alex@mercerglobal.com",
        phone: "+1 555 342 9812",
        country: "United States",
        productInterest: "Hand-block Printed Baby Bathrobes",
        message: "We are interested in placing an initial order for 1,200 units of organic cotton baby bathrobes for our retail distribution in California and New York. Please share FOB pricing and shipping lead time to Long Beach port.",
      },
      {
        name: "Sophie Dupont",
        companyName: "Maison Textile Paris",
        email: "sophie.dupont@maisontextile.fr",
        phone: "+33 1 42 68 55 00",
        country: "France",
        productInterest: "Jaipuri Double Bed Tagai Quilts",
        message: "Requesting custom swatch samples and quotation for 500 reversible double quilts with custom brand labels.",
      },
      {
        name: "Tariq Al-Mansoor",
        companyName: "Gulf Hospitality & Living",
        email: "tariq@gulfhospitality.ae",
        phone: "+971 4 312 8890",
        country: "United Arab Emirates",
        productInterest: "Handmade Mulmul Kimono Robes",
        message: "We need 800 units of luxury cotton kimono robes for a luxury resort project in Dubai. Please provide quotation and freight options to Jebel Ali port.",
      },
    ]);
    console.log("✓ Seeded Inquiries into MongoDB.");
  } else {
    console.log(`- Inquiries already present (${inqCount} records).`);
  }

  console.log("[Seeder] MongoDB Atlas seeding finished successfully!");
}
