import { connectDB, readMockDB, writeMockDB, isUsingMockDB } from "../src/lib/db";
import { sendInquiryEmails } from "../src/lib/email";

// Set environment variables to force Mock mode for testing
process.env.MONGODB_URI = "placeholder_uri";
process.env.RESEND_API_KEY = "re_placeholder";

async function runTest() {
  console.log("Starting B2B Inquiry Integration Test...");
  console.log("Mock Mode Status (isUsingMockDB):", isUsingMockDB);

  // 1. Prepare sample B2B inquiry data
  const sampleInquiry = {
    name: "Alex Mercer",
    companyName: "Mercer Global Trade Inc.",
    email: "alex@mercerglobal.com",
    phone: "+1 555 123 4567",
    country: "United States",
    productInterest: "Hand-block Printed Baby Bathrobes",
    message: "We are interested in sourcing 1000 units of your organic cotton hand-block printed baby bathrobes. Please provide FOB price quotes and shipping lead times to NY port.",
  };

  // 2. Read current state of Mock DB
  console.log("\nReading current mock database...");
  const beforeDb = readMockDB();
  const beforeCount = beforeDb.inquiries.length;
  console.log("Inquiries count before test:", beforeCount);

  // 3. Save to database using mock flow
  console.log("\nSaving inquiry to local mock DB...");
  const newInquiry = {
    _id: `inq_${Date.now()}`,
    ...sampleInquiry,
    createdAt: new Date().toISOString(),
  };
  beforeDb.inquiries.unshift(newInquiry);
  writeMockDB(beforeDb);

  // 4. Trigger Email Dispatch
  console.log("\nTriggering email dispatch notifications...");
  const emailResult = await sendInquiryEmails(sampleInquiry);
  console.log("Email result:", emailResult);

  // 5. Verify database output
  console.log("\nVerifying database write...");
  const afterDb = readMockDB();
  const afterCount = afterDb.inquiries.length;
  console.log("Inquiries count after test:", afterCount);

  if (afterCount === beforeCount + 1) {
    console.log("\nSUCCESS: Inquiry successfully written to mock database!");
    console.log("Added inquiry detail:", afterDb.inquiries[0]);
  } else {
    console.error("\nFAILURE: Inquiry was not saved successfully.");
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
