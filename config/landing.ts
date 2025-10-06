import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "Create invoices in seconds",
    description:
      "Save hours with AI-powered invoice generation. Simply describe your work, and our assistant drafts a complete, professional invoice ready to review, edit, and send.",
    image: "/_static/demo/chat-invoice-preview.png",
    list: [
      {
        title: "AI-Powered",
        description:
          "Generate invoices automatically with OpenAI—no manual typing required.",
        icon: "bot",
      },
      {
        title: "Accurate & Fast",
        description:
          "From description to detailed line items in seconds, with smart tax and total calculations.",
        icon: "zap",
      },
      {
        title: "Customizable",
        description:
          "Easily adjust line items, descriptions, and design before saving or sharing.",
        icon: "edit",
      },
    ],
  },
  {
    title: "Flexible for every freelancer and team",
    description:
      "Whether you’re a solo freelancer or managing a team, Build&Bill adapts to your workflow. Create unlimited manual invoices or scale up with powerful automation.",
    image: "/_static/illustrations/team-collaboration.jpg",
    list: [
      {
        title: "Manual or AI Invoices",
        description:
          "Choose between full manual control or AI-assisted creation for maximum efficiency.",
        icon: "file",
      },
      {
        title: "Client Management",
        description:
          "Store client info, notes, and history in one place for faster billing and follow-ups.",
        icon: "users",
      },
      {
        title: "Team Collaboration",
        description:
          "Invite teammates, assign roles, and share invoice access with secure permissions.",
        icon: "users",
      },
    ],
  },
  {
    title: "Professional delivery & integrations",
    description:
      "Deliver branded invoices and connect your workflow with CRMs or accounting tools. Build&Bill helps you look professional while saving time.",
    image: "/_static/illustrations/branding-integration.jpg",
    list: [
      {
        title: "Custom Branding",
        description:
          "Add your logo and colors to invoices — available for Business plans.",
        icon: "brush",
      },
      {
        title: "Instant Sharing",
        description:
          "Export PDFs or share secure links instantly with your clients.",
        icon: "share",
      },
      {
        title: "Integrations",
        description:
          "Connect with accounting tools or CRMs to automate your workflow.",
        icon: "link",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "AI Invoice Assistant",
    description:
      "Automatically generate invoices from a simple project description. Powered by OpenAI, optimized for freelancers and agencies.",
    link: "/",
    icon: "bot",
  },
  {
    title: "Manual Invoice Form",
    description:
      "Prefer full control? Use our intuitive manual form to create detailed invoices without AI tokens.",
    link: "/",
    icon: "file",
  },
  {
    title: "Client Management",
    description:
      "Save client details, add notes, view invoice history, and manage relationships in one dashboard.",
    link: "/",
    icon: "users",
  },
  {
    title: "Custom Templates & Branding",
    description:
      "Use modern invoice designs or upload your own branding to create personalized, professional documents.",
    link: "/",
    icon: "brush",
  },
  {
    title: "PDF & Share Links",
    description:
      "Instantly export invoices as PDFs or share them securely via custom links — no watermarks on paid plans.",
    link: "/",
    icon: "share",
  },
  {
    title: "Integrations & Teams",
    description:
      "Connect Build&Bill with your tools and collaborate with your team using advanced permissions.",
    link: "/",
    icon: "link",
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "John Doe",
    job: "Full Stack Developer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "The next-saas-stripe-starter repo has truly revolutionized my development workflow. With its comprehensive features and seamless integration with Stripe, I've been able to build and deploy projects faster than ever before. The documentation is clear and concise, making it easy to navigate through the setup process. I highly recommend next-saas-stripe-starter to any developer.",
  },
  {
    name: "Alice Smith",
    job: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "Thanks to next-saas-stripe-starter, I've been able to create modern and attractive user interfaces in record time. The starter kit provides a solid foundation for building sleek and intuitive designs, allowing me to focus more on the creative aspects of my work.",
  },
  {
    name: "David Johnson",
    job: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "Thanks to next-saas-stripe-starter, I was able to streamline the entire process and get payments up and running in no time. ",
  },
  {
    name: "Michael Wilson",
    job: "Project Manager",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "I'm impressed by the quality of code and clear documentation of next-saas-stripe-starter. Kudos to the team!",
  },
  {
    name: "Sophia Garcia",
    job: "Data Analyst",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    review:
      "next-saas-stripe-starter provided me with the tools I needed to efficiently manage user data. Thank you so much!",
  },
  {
    name: "Emily Brown",
    job: "Marketing Manager",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review:
      "next-saas-stripe-starter has been an invaluable asset in my role as a marketing manager. With its seamless integration with Stripe, I've been able to launch targeted marketing campaigns with built-in payment functionality, allowing us to monetize our products and services more effectively.",
  },
  {
    name: "Jason Stan",
    job: "Web Designer",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    review:
      "Thanks to next-saas-stripe-starter, I've been able to create modern and attractive user interfaces in record time. The starter kit provides a solid foundation for building sleek and intuitive designs, allowing me to focus more on the creative aspects of my work.",
  },
];
