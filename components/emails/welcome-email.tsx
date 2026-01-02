import * as React from "react";

interface WelcomeEmailProps {
  email: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email }) => (
  <div style={{ fontFamily: "sans-serif", color: "#333" }}>
    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
      Welcome to InvoiceBoard! 🚀
    </h1>
    <p>Hi there,</p>
    <p>
      Thanks for joining the waitlist ({email}). We're building the fastest way
      to create invoices using AI, and we're excited to have you on board.
    </p>
    <p>
      We'll notify you as soon as early access opens up. In the meantime, sit
      tight!
    </p>
    <br />
    <p>Best,</p>
    <p>The InvoiceBoard Team</p>
  </div>
);

export default WelcomeEmail;
