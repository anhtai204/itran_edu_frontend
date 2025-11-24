import type { FAQCategory } from "@/types/faq"

export const faqData: FAQCategory[] = [
  {
    id: "general",
    name: "General Questions",
    faqs: [
      {
        question: "What is Itran Education?",
        answer:
          "Itran Education is an online learning platform that provides high-quality courses in various subjects including programming, design, business, and more. Our mission is to make education accessible to everyone, anywhere, anytime.",
        relatedLinks: [
          { text: "About Us", url: "/about" },
          { text: "Our Mission", url: "/about#mission" },
        ],
      },
      {
        question: "How do I create an account?",
        answer:
          'Creating an account is simple! Click on the "Sign Up" button in the top right corner of the homepage. Fill in your details including your name, email address, and password. Verify your email address by clicking on the link sent to your inbox, and you\'re all set!',
        relatedLinks: [{ text: "Sign Up Page", url: "/auth/register" }],
      },
      {
        question: "Is Itran Education free to use?",
        answer:
          "Itran Education offers both free and premium content. Many of our basic courses and resources are available for free. Premium courses and features require a subscription or one-time purchase. Check our pricing page for more details on our plans and what they include.",
        relatedLinks: [{ text: "Pricing Plans", url: "/pricing" }],
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach our customer support team through multiple channels:<br><br>1. Email us at <strong>support@Itran-edu.com</strong><br>2. Use the live chat feature on our website<br>3. Fill out the contact form on our Contact page<br>4. Call us at +1-234-567-8900 during business hours (9 AM - 5 PM EST, Monday to Friday)",
        relatedLinks: [{ text: "Contact Us", url: "/contact" }],
      },
      {
        question: "Can I access Itran Education on mobile devices?",
        answer:
          "Yes! Itran Education is fully responsive and works on all devices including smartphones and tablets. We also offer dedicated mobile apps for iOS and Android for an enhanced learning experience on the go.",
        relatedLinks: [
          { text: "Download iOS App", url: "https://apps.apple.com/Itran-edu", external: true },
          { text: "Download Android App", url: "https://play.google.com/store/apps/Itran-edu", external: true },
        ],
      },
    ],
  },
  {
    id: "courses",
    name: "Courses & Learning",
    faqs: [
      {
        question: "How do I enroll in a course?",
        answer:
          'To enroll in a course, navigate to the course page and click the "Enroll" or "Buy Now" button. If it\'s a free course, you\'ll get immediate access. For premium courses, you\'ll be directed to the payment page to complete your purchase.',
      },
      {
        question: "Can I download course materials for offline viewing?",
        answer:
          "Yes, premium subscribers can download video lessons, PDFs, and other course materials for offline viewing. Look for the download icon next to the content you want to save. Note that downloaded content is still protected by our copyright terms.",
      },
      {
        question: "How long do I have access to a course after purchasing?",
        answer:
          "Once you purchase a course, you have lifetime access to it. This means you can revisit the material whenever you want, even after you've completed the course. Course updates and improvements are also included at no additional cost.",
      },
      {
        question: "Are certificates provided upon course completion?",
        answer:
          "Yes, we provide certificates of completion for all our courses. Once you've completed all the required modules and assignments, you can generate your certificate from your dashboard. Our certificates can be shared directly to LinkedIn or downloaded as PDF files.",
        relatedLinks: [{ text: "View Sample Certificate", url: "/sample-certificate" }],
      },
      {
        question: "What if I'm not satisfied with a course?",
        answer:
          "We offer a 30-day money-back guarantee for all our premium courses. If you're not satisfied with the course content, you can request a refund within 30 days of purchase. Please note that you must have completed less than 30% of the course to be eligible for a refund.",
        relatedLinks: [{ text: "Refund Policy", url: "/refund-policy" }],
      },
    ],
  },
  {
    id: "account",
    name: "Account Management",
    faqs: [
      {
        question: "How do I reset my password?",
        answer:
          'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you a password reset link. Click on the link in your email and follow the instructions to create a new password.',
      },
      {
        question: "Can I change my email address?",
        answer:
          'Yes, you can change your email address in your account settings. Go to your profile, click on "Settings," and update your email address. You\'ll need to verify your new email address before the change takes effect.',
      },
      {
        question: "How do I delete my account?",
        answer:
          'To delete your account, go to your profile settings and scroll down to the bottom where you\'ll find the "Delete Account" option. Please note that account deletion is permanent and will remove all your data, including course progress and certificates.',
      },
      {
        question: "Can I have multiple profiles under one account?",
        answer:
          "Currently, we don't support multiple profiles under a single account. Each user needs to create their own account with a unique email address. However, we do offer team and enterprise plans that allow organizations to manage multiple users.",
        relatedLinks: [{ text: "Enterprise Solutions", url: "/enterprise" }],
      },
    ],
  },
  {
    id: "payments",
    name: "Payments & Billing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods including credit/debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For some regions, we also support local payment methods like bank transfers and mobile payments.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we take security very seriously. All payment information is encrypted using industry-standard SSL technology. We don't store your full credit card details on our servers. Instead, we use trusted third-party payment processors that comply with PCI DSS standards.",
      },
      {
        question: "How do subscriptions work?",
        answer:
          "Our subscriptions are billed either monthly or annually, depending on the plan you choose. Subscriptions automatically renew until canceled. You can cancel your subscription at any time from your account settings, and you'll continue to have access until the end of your billing period.",
      },
      {
        question: "Can I get an invoice for my purchase?",
        answer:
          'Yes, invoices are automatically generated for all purchases. You can find them in your account under "Billing History." If you need a custom invoice with specific details (e.g., for company reimbursement), please contact our support team.',
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Yes, we offer a 30-day money-back guarantee for course purchases and subscription plans. If you're not satisfied, you can request a refund within 30 days of purchase. For subscriptions, you can get a prorated refund for the unused portion of your billing period.",
        relatedLinks: [{ text: "Refund Policy", url: "/refund-policy" }],
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Support",
    faqs: [
      {
        question: "What are the system requirements for using Itran Education?",
        answer:
          "Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge) with JavaScript enabled. For the best experience, we recommend:<br><br>- A broadband internet connection (minimum 5 Mbps)<br>- At least 4GB of RAM<br>- An updated operating system (Windows 10+, macOS 10.13+, or recent Linux distributions)<br>- For mobile devices, iOS 13+ or Android 8+",
      },
      {
        question: "Videos won't play or are buffering constantly. What can I do?",
        answer:
          "If you're experiencing playback issues, try these troubleshooting steps:<br><br>1. Check your internet connection speed<br>2. Lower the video quality in the player settings<br>3. Close other applications or browser tabs that might be using bandwidth<br>4. Clear your browser cache<br>5. Try a different browser<br>6. Disable browser extensions that might interfere with video playback<br><br>If the problem persists, please contact our technical support team.",
      },
      {
        question: "How do I enable cookies for Itran Education?",
        answer:
          "Our platform requires cookies to function properly. To enable cookies:<br><br><strong>Chrome:</strong> Settings > Privacy and security > Cookies and other site data > Allow all cookies<br><br><strong>Firefox:</strong> Options > Privacy & Security > Cookies and Site Data > Accept cookies and site data<br><br><strong>Safari:</strong> Preferences > Privacy > Cookies and website data > Allow from websites I visit<br><br><strong>Edge:</strong> Settings > Cookies and site permissions > Cookies > Allow",
      },
      {
        question: "The site is not displaying correctly. What should I do?",
        answer:
          "If the site isn't displaying correctly, try these steps:<br><br>1. Refresh the page (Ctrl+F5 or Cmd+Shift+R for a hard refresh)<br>2. Clear your browser cache<br>3. Disable browser extensions, especially ad blockers<br>4. Try a different browser<br>5. Check if your browser is up to date<br>6. Ensure JavaScript is enabled<br><br>If you're still having issues, please contact our support team with details about your browser and operating system.",
      },
    ],
  },
]
