"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ClientSideAccordion() {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      <AccordionItem value="item-1" className="bg-white dark:bg-gray-700 rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              Q
            </div>
            <span className="dark:text-white">How do I create an account on the platform?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-sm dark:text-gray-300">
              Creating an account is simple! Click on the "Sign Up" button in the top right corner, fill in your
              details, and follow the verification process. Once verified, you can start building your professional
              profile.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="bg-white dark:bg-gray-700 rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              Q
            </div>
            <span className="dark:text-white">How do I apply for a job through this platform?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <p className="text-sm dark:text-gray-300">
            Browse available jobs in your field, review the requirements, and click "Apply" on jobs that match your
            skills. You can also set up job alerts to be notified of new opportunities.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="bg-white dark:bg-gray-700 rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              Q
            </div>
            <span className="dark:text-white">How can I track the status of my job applications?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <p className="text-sm dark:text-gray-300">
            You can track all your applications in the "My Applications" section of your dashboard. This shows the
            status of each application and any messages from potential employers.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4" className="bg-white dark:bg-gray-700 rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              Q
            </div>
            <span className="dark:text-white">Is there a cost to use the job board, and what features are free?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <p className="text-sm dark:text-gray-300">
            Basic features like creating a profile and applying to jobs are free. Premium features such as priority
            applications and advanced profile customization require a subscription plan.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

