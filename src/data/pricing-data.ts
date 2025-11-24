import type { PricingData } from "@/types/pricing"

export const pricingData: PricingData = {
  plans: [
    {
      id: "free",
      name: "Free",
      description: "For individuals just getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      features: ["Access to basic courses", "Limited quizzes", "Community forum access", "Email support", "1 device"],
    },
    {
      id: "basic",
      name: "Basic",
      description: "For serious learners",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      discount: 19.89,
      features: [
        "All Free features",
        "Unlimited quizzes",
        "Certificate of completion",
        "Progress tracking",
        "3 devices",
      ],
      trial: "7-day free trial",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For dedicated students",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      discount: 39.89,
      features: [
        "All Basic features",
        "Advanced courses",
        "1-on-1 tutoring (2hrs/mo)",
        "Offline downloads",
        "5 devices",
      ],
      popular: true,
      trial: "14-day free trial",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For organizations & schools",
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      discount: 99.89,
      features: ["All Pro features", "Custom learning paths", "Admin dashboard", "API access", "Unlimited devices"],
    },
  ],
  features: [
    {
      id: "core",
      name: "Core Features",
      features: [
        {
          id: "courses",
          name: "Course Access",
          availability: {
            free: "Basic only",
            basic: "Standard",
            pro: "Advanced",
            enterprise: "Custom",
          },
        },
        {
          id: "quizzes",
          name: "Quizzes",
          availability: {
            free: "10/month",
            basic: "Unlimited",
            pro: "Unlimited",
            enterprise: "Unlimited",
          },
        },
        {
          id: "certificates",
          name: "Certificates",
          availability: {
            free: false,
            basic: true,
            pro: true,
            enterprise: true,
          },
        },
        {
          id: "progress",
          name: "Progress Tracking",
          availability: {
            free: "Basic",
            basic: "Advanced",
            pro: "Advanced",
            enterprise: "Custom",
          },
        },
      ],
    },
    {
      id: "learning",
      name: "Learning Tools",
      features: [
        {
          id: "downloads",
          name: "Offline Downloads",
          availability: {
            free: false,
            basic: false,
            pro: true,
            enterprise: true,
          },
        },
        {
          id: "tutoring",
          name: "1-on-1 Tutoring",
          availability: {
            free: false,
            basic: false,
            pro: "2 hrs/month",
            enterprise: "10 hrs/month",
          },
        },
        {
          id: "paths",
          name: "Custom Learning Paths",
          availability: {
            free: false,
            basic: false,
            pro: false,
            enterprise: true,
          },
        },
        {
          id: "ai",
          name: "AI Learning Assistant",
          availability: {
            free: false,
            basic: "Basic",
            pro: "Advanced",
            enterprise: "Premium",
          },
        },
      ],
    },
    {
      id: "support",
      name: "Support",
      features: [
        {
          id: "email",
          name: "Email Support",
          availability: {
            free: "48 hrs",
            basic: "24 hrs",
            pro: "12 hrs",
            enterprise: "4 hrs",
          },
        },
        {
          id: "chat",
          name: "Live Chat",
          availability: {
            free: false,
            basic: "Business hours",
            pro: "Business hours",
            enterprise: "24/7",
          },
        },
        {
          id: "phone",
          name: "Phone Support",
          availability: {
            free: false,
            basic: false,
            pro: "Business hours",
            enterprise: "24/7",
          },
        },
        {
          id: "account",
          name: "Dedicated Account Manager",
          availability: {
            free: false,
            basic: false,
            pro: false,
            enterprise: true,
          },
        },
      ],
    },
    {
      id: "technical",
      name: "Technical",
      features: [
        {
          id: "devices",
          name: "Devices",
          availability: {
            free: "1",
            basic: "3",
            pro: "5",
            enterprise: "Unlimited",
          },
        },
        {
          id: "api",
          name: "API Access",
          availability: {
            free: false,
            basic: false,
            pro: false,
            enterprise: true,
          },
        },
        {
          id: "sso",
          name: "Single Sign-On",
          availability: {
            free: false,
            basic: false,
            pro: false,
            enterprise: true,
          },
        },
        {
          id: "analytics",
          name: "Advanced Analytics",
          availability: {
            free: false,
            basic: "Basic",
            pro: "Advanced",
            enterprise: "Custom",
          },
        },
      ],
    },
  ],
  testimonials: [
    {
      author: "Sarah Johnson",
      role: "Student",
      quote:
        "The Pro plan has been a game-changer for my studies. The 1-on-1 tutoring sessions helped me overcome challenges I was facing with advanced topics.",
      rating: 5,
    },
    {
      author: "Michael Chen",
      role: "Teacher",
      quote:
        "As an educator, the Enterprise plan gives me all the tools I need to create custom learning experiences for my students. Worth every penny!",
      rating: 5,
    },
    {
      author: "Emily Rodriguez",
      role: "Parent",
      quote:
        "The Basic plan is perfect for my children. Affordable and packed with features that keep them engaged in learning.",
      rating: 4,
    },
  ],
  faqs: [
    {
      question: "Can I switch between plans?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
    },
    {
      question: "Is there a discount for educational institutions?",
      answer:
        "Yes, we offer special pricing for schools, universities, and non-profit educational organizations. Please contact our sales team for more information.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank transfers for Enterprise plans.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not completely satisfied, contact our support team within 30 days of your purchase for a full refund.",
    },
    {
      question: "Do you offer any student discounts?",
      answer:
        "Yes, we offer a 20% discount for verified students. You'll need to verify your student status through our verification partner.",
    },
  ],
}
