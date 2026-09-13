import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://techsahajwayimpex_db_user:0SIu9SrM4NoNT619@sahajway.qq65gk2.mongodb.net/sahajwayimpex?retryWrites=true&w=majority";
const DATABASE_NAME = "sahajwayimpex";

// 1. Schemas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: true },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: { type: [String], default: [] },
  specifications: { type: [String], default: [] },
  features: { type: [String], default: [] },
  exportInformation: { type: String, default: "" },
  seoTitle: { type: String, default: "" },
  seoDescription: { type: String, default: "" },
  status: { type: Boolean, default: true },
}, { timestamps: true });

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, default: "" },
  email: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const BannerSchema = new mongoose.Schema({
  badge: { type: String, default: "Global B2B Export House" },
  title: { type: String, required: true },
  highlightText: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  primaryButtonText: { type: String, default: "Explore Products" },
  primaryButtonLink: { type: String, default: "/products" },
  secondaryButtonText: { type: String, default: "Contact Us" },
  secondaryButtonLink: { type: String, default: "/contact" },
  image: { type: String, default: "" },
  showGlobe: { type: Boolean, default: false },
  backgroundColor: { type: String, default: "" },
  backgroundImage: { type: String, default: "" },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  companyName: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, default: "" },
}, { timestamps: true });

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, default: "" },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  productInterest: { type: String, default: "" },
  message: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Models
const Category = mongoose.model("Category", CategorySchema);
const Product = mongoose.model("Product", ProductSchema);
const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);
const Destination = mongoose.model("Destination", DestinationSchema);
const Banner = mongoose.model("Banner", BannerSchema);
const User = mongoose.model("User", UserSchema);
const Inquiry = mongoose.model("Inquiry", InquirySchema);

async function main() {
  console.log("Connecting to MongoDB Atlas:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { dbName: DATABASE_NAME, serverSelectionTimeoutMS: 5000 });
  console.log("Connected successfully to:", DATABASE_NAME);

  // 1. Seed Categories
  await Category.deleteMany({});
  const categories = await Category.create([
    {
      name: "Textiles & Apparel",
      slug: "textiles-apparel",
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127450/sahajway-impex/categories/cat_textiles-apparel.jpg",
      description: "Premium handcrafted Indian textiles, block printed fabrics, and heritage apparel.",
      status: true,
    },
    {
      name: "Home Decor",
      slug: "home-decor",
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127450/sahajway-impex/categories/cat_home-decor.jpg",
      description: "Luxury home furnishings, hand-stitched quilts, and traditional craftsmanship.",
      status: true,
    },
    {
      name: "Handcrafted Accessories",
      slug: "handcrafted-accessories",
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127449/sahajway-impex/categories/cat_handcrafted-accessories.jpg",
      description: "Quilted cotton bags, pouches, and artisan-crafted travel goods for global retailers.",
      status: true,
    },
    {
      name: "Organic Cotton Goods",
      slug: "organic-cotton-goods",
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127448/sahajway-impex/categories/cat_organic-cotton-goods.jpg",
      description: "100% GOTS-certified organic cotton bathrobes, loungewear, and sustainable nursery textiles.",
      status: true,
    },
  ]);
  console.log(`✓ Inserted ${categories.length} Categories`);

  // 2. Seed Products
  await Product.deleteMany({});
  const products = await Product.create([
    {
      name: "Hand-block Printed Baby Bathrobes",
      slug: "hand-block-printed-baby-bathrobes",
      shortDescription: "Ultra-soft organic cotton baby bathrobes featuring authentic Rajasthani hand-block printing.",
      description: "<p>Crafted from 100% organic cotton, these premium baby bathrobes combine visual heritage with modern comfort. Featuring safe, non-toxic dyes and beautiful artisan block prints, they are highly absorbent and gentle on sensitive baby skin.</p><p>Customized sizing, bespoke packaging with private labeling, and GOTS organic certification documents are provided with every batch.</p>",
      category: "Textiles & Apparel",
      images: [
        "https://res.cloudinary.com/jnzibppj/image/upload/v1789127455/sahajway-impex/products/prod_hand-block-printed-baby-bathrobes_1.jpg",
        "https://res.cloudinary.com/jnzibppj/image/upload/v1789127455/sahajway-impex/products/prod_hand-block-printed-baby-bathrobes_2.jpg",
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
        "https://res.cloudinary.com/jnzibppj/image/upload/v1789127451/sahajway-impex/products/prod_double-bed-quilts_1.jpg",
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
        "https://res.cloudinary.com/jnzibppj/image/upload/v1789127454/sahajway-impex/products/prod_quilted-tote-bags_1.jpg",
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
        "https://res.cloudinary.com/jnzibppj/image/upload/v1789127452/sahajway-impex/products/prod_handmade-mulmul-kimono-robes_1.jpg",
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
  console.log(`✓ Inserted ${products.length} Products`);

  // 3. Seed Team Members
  await TeamMember.deleteMany({});
  const teamMembers = await TeamMember.create([
    {
      name: "Prit Patel",
      designation: "Managing Director (India)",
      country: "India",
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127458/sahajway-impex/team/team_prit_patel.jpg",
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
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127457/sahajway-impex/team/team_us_trade_director.jpg",
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
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127456/sahajway-impex/team/team_anand_quality_control_lead.jpg",
      bio: "Supervises multi-tier quality checks, yarn tensile tests, and GOTS chemical compliance prior to container loading at Mundra and Kandla ports.",
      email: "qc@sahajwayimpex.com",
      linkedin: "https://linkedin.com",
      displayOrder: 3,
      active: true,
    },
  ]);
  console.log(`✓ Inserted ${teamMembers.length} Team Members`);

  // 4. Seed Destinations
  await Destination.deleteMany({});
  const destinations = await Destination.create([
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
  console.log(`✓ Inserted ${destinations.length} Trade Destinations`);

  // 5. Seed Banners
  await Banner.deleteMany({});
  const banners = await Banner.create([
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
      backgroundImage: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127464/sahajway-impex/banners/banner_bg_5.jpg",
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
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127460/sahajway-impex/banners/banner_overlay_3.jpg",
      showGlobe: false,
      backgroundColor: "bg-gradient-premium",
      backgroundImage: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127461/sahajway-impex/banners/banner_bg_3.jpg",
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
      backgroundImage: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127458/sahajway-impex/banners/banner_bg_1.jpg",
      displayOrder: 3,
      active: true,
    },
    {
      badge: "Private Label & White Glove Packaging",
      title: "Bespoke OEM Sourcing & Custom Export Packaging",
      highlightText: "OEM Sourcing",
      subtitle: "Custom barcode labeling, bespoke eco-friendly packaging, and GOTS-certified artisan manufacturing tailored for premier department stores and boutique brands.",
      primaryButtonText: "Request OEM Catalog",
      primaryButtonLink: "/contact",
      secondaryButtonText: "Explore Collections",
      secondaryButtonLink: "/products",
      image: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127462/sahajway-impex/banners/banner_overlay_4.jpg",
      showGlobe: false,
      backgroundColor: "bg-gradient-premium",
      backgroundImage: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127463/sahajway-impex/banners/banner_bg_4.jpg",
      displayOrder: 4,
      active: true,
    },
    {
      badge: "Worldwide Freight & Door-to-Port Delivery",
      title: "Direct Global Supply To Over 25+ International Destinations",
      highlightText: "25+ International Destinations",
      subtitle: "Seamless trade routes spanning North America, Europe, United Kingdom, Middle East, and Asia Pacific with rigorous multi-tier quality control.",
      primaryButtonText: "Explore Destinations",
      primaryButtonLink: "/about",
      secondaryButtonText: "Start Partnership",
      secondaryButtonLink: "/contact",
      image: "",
      showGlobe: true,
      backgroundColor: "bg-gradient-premium",
      backgroundImage: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127459/sahajway-impex/banners/banner_bg_2.jpg",
      displayOrder: 5,
      active: true,
    },
  ]);
  console.log(`✓ Inserted ${banners.length} Hero Banners`);

  // 6. Seed Users
  await User.deleteMany({});
  const users = await User.create([
    {
      clerkId: "user_admin_sahajway_1",
      email: "tech.sahajwayimpex@gmail.com",
      name: "Sahajway Admin",
      imageUrl: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127466/sahajway-impex/users/user_sahajway_admin.jpg",
      role: "admin",
      companyName: "Sahajway Impex HQ",
      country: "India",
      phone: "+91 96380 07789",
    },
    {
      clerkId: "user_admin_sahajway_2",
      email: "prit@sahajwayimpex.com",
      name: "Prit Patel",
      imageUrl: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127467/sahajway-impex/users/user_prit_patel.jpg",
      role: "admin",
      companyName: "Sahajway Impex",
      country: "India",
      phone: "+91 96380 07789",
    },
    {
      clerkId: "user_admin_sahajway_3",
      email: "contact@sahajwayimpex.com",
      name: "Trade Desk Officer",
      imageUrl: "https://res.cloudinary.com/jnzibppj/image/upload/v1789127465/sahajway-impex/users/user_trade_desk_officer.jpg",
      role: "admin",
      companyName: "Sahajway Trade Desk",
      country: "India",
      phone: "+91 96380 07789",
    },
  ]);
  console.log(`✓ Inserted ${users.length} Users`);

  // 7. Seed Inquiries
  await Inquiry.deleteMany({});
  const inquiries = await Inquiry.create([
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
  console.log(`✓ Inserted ${inquiries.length} Inquiries`);

  console.log("\n🚀 ALL 7 COLLECTIONS SEEDED IN MONGODB ATLAS SUCCESSFULLY!");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
