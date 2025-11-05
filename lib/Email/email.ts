import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // your App Password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"PakiShoes" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
