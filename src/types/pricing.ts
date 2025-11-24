export interface Plan {
    id: string
    name: string
    description: string
    monthlyPrice: number
    annualPrice: number
    discount?: number
    features: string[]
    popular?: boolean
    trial?: string
  }
  
  export interface FeatureAvailability {
    [planId: string]: boolean | string
  }
  
  export interface Feature {
    id: string
    name: string
    availability: FeatureAvailability
  }
  
  export interface FeatureCategory {
    id: string
    name: string
    features: Feature[]
  }
  
  export interface Testimonial {
    author: string
    role: string
    quote: string
    rating: number
  }
  
  export interface PricingFAQ {
    question: string
    answer: string
  }
  
  export interface PricingData {
    plans: Plan[]
    features: FeatureCategory[]
    testimonials: Testimonial[]
    faqs: PricingFAQ[]
  }
  