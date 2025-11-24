"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function SearchInput() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md flex flex-col sm:flex-row gap-2 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input placeholder="Job/Profession" className="pl-9 rounded-full dark:bg-gray-600 dark:text-white" />
      </div>
      <div className="flex items-center gap-2 px-3">
        <RadioGroup defaultValue="professionals" className="flex">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="professionals" id="professionals" />
            <Label htmlFor="professionals" className="dark:text-gray-300">
              By Profession
            </Label>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company" className="dark:text-gray-300">
              By Company
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button className="rounded-full">Search</Button>
    </div>
  )
}

