import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import CategoryModel from "@/lib/models/Category";
import TeamMemberModel from "@/lib/models/TeamMember";

export async function seedMongoDB() {
  await connectDB();

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
    ]);
    console.log("Seeded initial categories into MongoDB.");
  }

  // 2. Seed Products if empty
  const productCount = await ProductModel.countDocuments();
  if (productCount === 0) {
    await ProductModel.create([
      {
        name: "Hand-block Printed Baby Bathrobes",
        slug: "hand-block-printed-baby-bathrobes",
        shortDescription: "Ultra-soft cotton baby bathrobes featuring authentic Rajasthani hand-block printing.",
        description: "<p>Crafted from 100% organic cotton, these premium baby bathrobes combine visual heritage with modern comfort. Featuring safe, non-toxic dyes and beautiful artisan block prints, they are highly absorbent and gentle on sensitive baby skin.</p>",
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
        name: "Double Bed Quilts",
        slug: "double-bed-quilts",
        shortDescription: "Hand-quilted premium double quilts stuffed with pure cotton carding.",
        description: "<p>A centerpiece of traditional Indian master weaving. These double bed quilts feature classic Jaipuri style prints on fine mulmul cotton. Each piece is hand-quilted by skilled artisans in rural clusters, offering unparalleled warmth, breathability, and timeless visual appeal.</p>",
        category: "Home Decor",
        images: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        ],
        specifications: [
          "Dimensions: 90 x 108 inches (Double Bed Standard)",
          "Outer fabric: 100% Mulmul Cotton (100 count)",
          "Filling: 100% Organic Carded Cotton",
          "Weight: Approx. 2.2 kg",
          "Washing: Dry clean recommended",
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
        name: "Quilted Tote Bags",
        slug: "quilted-tote-bags",
        shortDescription: "Chic, durable canvas quilted tote bags with artisan prints and metal zip enclosures.",
        description: "<p>A merge of daily convenience and luxury craftsmanship. These bags are reinforced with soft inner padding, heavy-duty stitching, and convenient inner pockets. Perfect as styling accessories or everyday carries, showcasing traditional designs in a highly functional form.</p>",
        category: "Textiles & Apparel",
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
    ]);
    console.log("Seeded initial products into MongoDB.");
  }

  // 3. Seed Team if empty
  const teamCount = await TeamMemberModel.countDocuments();
  if (teamCount === 0) {
    await TeamMemberModel.create([
      {
        name: "Prit Patel",
        designation: "Managing Director (India)",
        country: "India",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
        bio: "Prit leads operations, sourcing partnerships, and quality standards in India. Dedicated to preserving Indian craftsmanship while meeting global regulatory frameworks.",
        email: "prit@sahajwayimpex.com",
        linkedin: "https://linkedin.com",
        displayOrder: 1,
        active: true,
      },
      {
        name: "US Director",
        designation: "Managing Director (USA)",
        country: "United States",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
        bio: "Managing logistics, distributor relations, and business development for North American and European trade channels, bringing Indian artistry directly to international showrooms.",
        email: "us.director@sahajwayimpex.com",
        linkedin: "https://linkedin.com",
        displayOrder: 2,
        active: true,
      },
    ]);
    console.log("Seeded initial team members into MongoDB.");
  }
}
