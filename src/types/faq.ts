export interface RelatedLink {
    text: string
    url: string
    external?: boolean
  }
  
  export interface FAQ {
    question: string
    answer: string
    relatedLinks?: RelatedLink[]
  }
  
  export interface FAQCategory {
    id: string
    name: string
    icon?: string
    faqs: FAQ[]
  }
  