import { Star } from "lucide-react"
import type { Testimonial } from "@/types/pricing"

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">What Our Customers Say</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
            </div>

            <p className="text-sm italic">"{testimonial.quote}"</p>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">
                  {testimonial.author
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
