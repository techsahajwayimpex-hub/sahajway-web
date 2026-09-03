import { Resend } from "resend";

const isResendConfigured = 
  process.env.RESEND_API_KEY && 
  process.env.RESEND_API_KEY !== "re_placeholder";

const resend = isResendConfigured ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contact@sahajwayimpex.com";

interface InquiryEmailData {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  country: string;
  productInterest?: string;
  message: string;
}

/**
 * Sends notification emails for a new B2B inquiry.
 */
export async function sendInquiryEmails(inquiry: InquiryEmailData) {
  const adminSubject = `New B2B Inquiry: ${inquiry.productInterest || "General"} - ${inquiry.name}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0a2540; border-bottom: 2px solid #0a2540; padding-bottom: 10px;">New B2B Trade Inquiry</h2>
      <p>A new inquiry has been received through the Sahajway Impex platform.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 30%;">Full Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Company:</td>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${inquiry.companyName || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Phone:</td>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7;"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Country:</td>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${inquiry.country}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Product Interest:</td>
          <td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${inquiry.productInterest || "General Inquiry"}</td>
        </tr>
      </table>

      <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-radius: 4px; border-left: 4px solid #0a2540;">
        <h4 style="margin-top: 0; color: #0a2540;">Message:</h4>
        <p style="white-space: pre-wrap; margin-bottom: 0;">${inquiry.message}</p>
      </div>

      <div style="margin-top: 30px; font-size: 12px; color: #a0aec0; text-align: center; border-top: 1px solid #edf2f7; padding-top: 15px;">
        Sent automatically by SAHAJWAY IMPEX Platform.
      </div>
    </div>
  `;

  const customerSubject = "Thank You for Contacting Sahajway Impex";
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #fcfcfc;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0a2540; margin-bottom: 5px; font-size: 24px; letter-spacing: 1px;">SAHAJWAY IMPEX</h1>
        <p style="color: #d4af37; margin-top: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Premium Global Export Partner</p>
      </div>
      
      <p>Dear <strong>${inquiry.name}</strong>,</p>
      
      <p>Thank you for reaching out to Sahajway Impex. We have successfully received your inquiry regarding <strong>${inquiry.productInterest || "our premium export services"}</strong>.</p>
      
      <p>Our team in Anand, Gujarat, is reviewing your requirements, including technical specifications, volume pricing, and shipping logistics. An export representative will contact you shortly (typically within 12-24 business hours) with a detailed proposal.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin-top: 0; color: #0a2540; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 14px;">Summary of Your Inquiry:</h4>
        <ul style="list-style-type: none; padding-left: 0; font-size: 13px; color: #4a5568; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>Company:</strong> ${inquiry.companyName || "Personal Inquiry"}</li>
          <li style="margin-bottom: 6px;"><strong>Destination Country:</strong> ${inquiry.country}</li>
          <li style="margin-bottom: 6px;"><strong>Product of Interest:</strong> ${inquiry.productInterest || "General Trade"}</li>
        </ul>
      </div>

      <p>If you need immediate assistance or would like to send additional documentation, please reply directly to this email or contact us via phone at <a href="tel:+919638007789">+91 96380 07789</a>.</p>

      <p style="margin-top: 30px;">Best Regards,</p>
      <p style="margin-bottom: 0;"><strong>B2B Trade Desk</strong><br>Sahajway Impex<br>Anand, Gujarat, India</p>
      
      <div style="margin-top: 40px; font-size: 11px; color: #a0aec0; text-align: center; border-top: 1px solid #edf2f7; padding-top: 15px;">
        © ${new Date().getFullYear()} Sahajway Impex. All rights reserved.
      </div>
    </div>
  `;

  if (!isResendConfigured || !resend) {
    console.log(`
=========================================
[MOCK EMAIL SERVICE TRIGGERED]
-----------------------------------------
1. ADMIN NOTIFICATION:
   To: ${ADMIN_CONTACT_EMAIL}
   Subject: ${adminSubject}
   Content: See inquiry data below.
   
2. CUSTOMER AUTO-REPLY:
   To: ${inquiry.email}
   Subject: ${customerSubject}
   
INQUIRY DATA:
- Name: ${inquiry.name}
- Company: ${inquiry.companyName}
- Email: ${inquiry.email}
- Phone: ${inquiry.phone}
- Country: ${inquiry.country}
- Interest: ${inquiry.productInterest}
- Message: "${inquiry.message}"
=========================================
    `);
    return { success: true, mock: true };
  }

  try {
    // Send admin notification
    const adminPromise = resend.emails.send({
      from: "Sahajway Impex <inquiries@sahajwayimpex.com>",
      to: ADMIN_CONTACT_EMAIL,
      subject: adminSubject,
      html: adminHtml,
    });

    // Send customer auto-reply
    const customerPromise = resend.emails.send({
      from: "Sahajway Impex <info@sahajwayimpex.com>",
      to: inquiry.email,
      subject: customerSubject,
      html: customerHtml,
    });

    await Promise.all([adminPromise, customerPromise]);
    return { success: true };
  } catch (error) {
    console.error("Resend email delivery failed:", error);
    throw error;
  }
}
