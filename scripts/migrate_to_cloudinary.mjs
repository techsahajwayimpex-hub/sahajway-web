import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Configuration from .env
const CLOUDINARY_CLOUD_NAME = "jnzibppj";
const CLOUDINARY_API_KEY = "748831375783655";
const CLOUDINARY_API_SECRET = "uBD7FGTsfFP9uwxSWJu8tRU-LEw";

const MONGODB_URI = "mongodb+srv://techsahajwayimpex_db_user:0SIu9SrM4NoNT619@sahajway.qq65gk2.mongodb.net/sahajwayimpex?retryWrites=true&w=majority";
const DATABASE_NAME = "sahajwayimpex";

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Define Schemas
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
  status: Boolean,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  shortDescription: String,
  description: String,
  category: String,
  images: [String],
  specifications: [String],
  features: [String],
  exportInformation: String,
  seoTitle: String,
  seoDescription: String,
  status: Boolean,
}, { timestamps: true });

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  designation: String,
  country: String,
  image: String,
  bio: String,
  email: String,
  linkedin: String,
  displayOrder: Number,
  active: Boolean,
}, { timestamps: true });

const BannerSchema = new mongoose.Schema({
  badge: String,
  title: String,
  highlightText: String,
  subtitle: String,
  primaryButtonText: String,
  primaryButtonLink: String,
  secondaryButtonText: String,
  secondaryButtonLink: String,
  image: String,
  showGlobe: Boolean,
  backgroundColor: String,
  backgroundImage: String,
  displayOrder: Number,
  active: Boolean,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  clerkId: String,
  email: String,
  name: String,
  imageUrl: String,
  role: String,
  companyName: String,
  country: String,
  phone: String,
}, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema);
const Product = mongoose.model("Product", ProductSchema);
const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);
const Banner = mongoose.model("Banner", BannerSchema);
const User = mongoose.model("User", UserSchema);

/**
 * Uploads an image URL to Cloudinary folder if not already a Cloudinary URL
 */
async function uploadToCloudinary(url, folder, publicId) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes(folder)) {
    console.log(`  [Already on Cloudinary]: ${url}`);
    return url;
  }

  try {
    console.log(`  Uploading to ${folder}... (${url.substring(0, 50)}...)`);
    const uploadOptions = {
      folder,
      resource_type: "image",
    };
    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const res = await cloudinary.uploader.upload(url, uploadOptions);
    console.log(`  ✓ Uploaded to: ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.error(`  ✗ Cloudinary upload failed for ${url}:`, err.message);
    return url;
  }
}

async function main() {
  console.log("==================================================");
  console.log("☁️  CLOUDINARY ASSET MIGRATION & FOLDER ORGANIZATION");
  console.log("==================================================");
  console.log("Cloud Name:", CLOUDINARY_CLOUD_NAME);

  // 1. Create Organized Folders in Cloudinary
  const folders = [
    "sahajway-impex",
    "sahajway-impex/banners",
    "sahajway-impex/categories",
    "sahajway-impex/products",
    "sahajway-impex/team",
    "sahajway-impex/users",
  ];

  console.log("\n📁 Ensuring Cloudinary folder hierarchy exists...");
  for (const folder of folders) {
    try {
      await cloudinary.api.create_folder(folder);
      console.log(`  ✓ Created / verified folder: ${folder}`);
    } catch (err) {
      // If folder already exists, it's fine
      console.log(`  ✓ Folder ready: ${folder}`);
    }
  }

  // 2. Connect to MongoDB
  console.log("\n🗄️  Connecting to MongoDB Atlas:", DATABASE_NAME);
  await mongoose.connect(MONGODB_URI, { dbName: DATABASE_NAME });
  console.log("Connected to MongoDB successfully!");

  // 3. Migrate Categories
  console.log("\n--- Migrating Categories ---");
  const categories = await Category.find({});
  for (const cat of categories) {
    console.log(`Category: ${cat.name}`);
    if (cat.image) {
      const secureUrl = await uploadToCloudinary(
        cat.image,
        "sahajway-impex/categories",
        `cat_${cat.slug}`
      );
      cat.image = secureUrl;
      await cat.save();
    }
  }

  // 4. Migrate Products
  console.log("\n--- Migrating Products ---");
  const products = await Product.find({});
  for (const prod of products) {
    console.log(`Product: ${prod.name}`);
    const newImages = [];
    let idx = 1;
    for (const img of prod.images) {
      const secureUrl = await uploadToCloudinary(
        img,
        "sahajway-impex/products",
        `prod_${prod.slug}_${idx++}`
      );
      newImages.push(secureUrl);
    }
    prod.images = newImages;
    await prod.save();
  }

  // 5. Migrate Team Members
  console.log("\n--- Migrating Team Members ---");
  const teamMembers = await TeamMember.find({});
  for (const member of teamMembers) {
    console.log(`Team Member: ${member.name}`);
    if (member.image) {
      const slugName = member.name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const secureUrl = await uploadToCloudinary(
        member.image,
        "sahajway-impex/team",
        `team_${slugName}`
      );
      member.image = secureUrl;
      await member.save();
    }
  }

  // 6. Migrate Hero Banners
  console.log("\n--- Migrating Hero Banners ---");
  const banners = await Banner.find({});
  let bIdx = 1;
  for (const banner of banners) {
    console.log(`Banner ${bIdx}: ${banner.title.substring(0, 30)}...`);
    if (banner.image) {
      const secureUrl = await uploadToCloudinary(
        banner.image,
        "sahajway-impex/banners",
        `banner_overlay_${bIdx}`
      );
      banner.image = secureUrl;
    }
    if (banner.backgroundImage) {
      const secureBgUrl = await uploadToCloudinary(
        banner.backgroundImage,
        "sahajway-impex/banners",
        `banner_bg_${bIdx}`
      );
      banner.backgroundImage = secureBgUrl;
    }
    bIdx++;
    await banner.save();
  }

  // 7. Migrate Users
  console.log("\n--- Migrating Users ---");
  const users = await User.find({});
  for (const user of users) {
    console.log(`User: ${user.name}`);
    if (user.imageUrl) {
      const slugName = (user.name || user.clerkId).toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const secureUrl = await uploadToCloudinary(
        user.imageUrl,
        "sahajway-impex/users",
        `user_${slugName}`
      );
      user.imageUrl = secureUrl;
      await user.save();
    }
  }

  console.log("\n==================================================");
  console.log("🎉 ALL ASSETS UPLOADED TO CLOUDINARY & DB UPDATED!");
  console.log("==================================================");
  
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration fatal error:", err);
  process.exit(1);
});
