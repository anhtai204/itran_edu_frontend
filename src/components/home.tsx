import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import ani from "../assets/images/ani.png";
import ai from "../assets/images/ai.webp";
import doof from "../assets/images/doof.jpg";
import earth from "../assets/images/earth.png";
import hnue from "../assets/images/hnue.jpg";
import meme from "../assets/images/meme.jpg";
import meme1 from "../assets/images/meme1.jpg";

import ai1 from "../assets/images/ai1.jpg";
import ai2 from "../assets/images/ai2.jpg";
import ai3 from "../assets/images/ai3.jpg";
import ai4 from "../assets/images/ai4.jpg";
import ai5 from "../assets/images/ai5.jpg";
import ai6 from "../assets/images/ai6.png";
import ai7 from "../assets/images/ai7.png";
import ai8 from "../assets/images/ai8.webp";
import ai9 from "../assets/images/ai9.webp";

import { ThemeSwitcher } from "@/components/(shadcn)/theme-switcher";
import { ImageSlider } from "@/components/(shadcn)/image-slider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  const images = [ai1, ai2, ai3, ai4, ai5, ai6, ai7, ai8, ai9, ani, ai, doof, earth, hnue, meme];

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900 dark:text-gray-100">
      <Header /> 
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-purple-100 to-white dark:from-purple-900 dark:to-gray-800 pt-16 pb-18">
          <div className="container text-center max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center rounded-full border bg-white dark:bg-gray-800 dark:border-gray-700 px-3 py-1 text-sm mb-6">
              <span className="text-xs dark:text-gray-300">
                Your Professional Marketplace
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-indigo-100 mb-4">
              Showcase Your Mastery. Get Connected
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Connect with other professionals and clients to grow your career
            </p>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md flex flex-col sm:flex-row gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Job/Profession"
                  className="pl-9 rounded-full dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 px-3">
                <RadioGroup defaultValue="professionals" className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professionals" id="professionals" />
                    <Label
                      htmlFor="professionals"
                      className="dark:text-gray-300"
                    >
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
          </div>

          {/* Profile Images */}
          <div className="container overflow-hidden py-8">
            <ImageSlider images={images} />
          </div>
        </section>

        {/* Discover Section */}
        <section className="py-16 dark:bg-gray-800">
          <div className="container text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">
              Discover the Emerging Masters
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Connect with talented professionals across various industries
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                "All Industries",
                "IT Developer",
                "Product Manager",
                "Designer",
                "UI/UX Expert",
                "Content Marketing",
                "Web Design",
              ].map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border dark:border-gray-600 text-sm dark:text-gray-300"
                >
                  <span>{category}</span>
                </div>
              ))}
            </div>

            {/* Professional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Daniel Martin",
                  role: "Designer",
                  rating: "4.9",
                  projects: "12",
                  image: { src: ai1, alt: "Daniel Martin" },
                },
                {
                  name: "Dorothy Wood",
                  role: "UI/UX Expert",
                  rating: "4.8",
                  projects: "15",
                  featured: true,
                  image: { src: ai2, alt: "Dorothy Wood" },
                },
                {
                  name: "Timothy Baker",
                  role: "Developer",
                  rating: "4.7",
                  projects: "8",
                  image: { src: ai3, alt: "Timothy Baker" },
                },
                {
                  name: "Wayne Scott",
                  role: "Marketing",
                  rating: "4.9",
                  projects: "20",
                  image: { src: ai4, alt: "Wayne Scott" },
                },
                {
                  name: "Patricia Manning",
                  role: "Content Writer",
                  rating: "4.6",
                  projects: "10",
                  image: { src: ai5, alt: "Patricia Manning" },
                },
                {
                  name: "Jack Hill",
                  role: "SEO Expert",
                  rating: "4.8",
                  projects: "14",
                  image: { src: ai6, alt: "Jack Hill" },
                },
                {
                  name: "Kathryn Sanchez",
                  role: "Product Manager",
                  rating: "4.9",
                  projects: "7",
                  image: { src: ai7, alt: "Kathryn Sanchez" },
                },
                {
                  name: "Jamie Kirkland",
                  role: "Web Designer",
                  rating: "4.7",
                  projects: "9",
                  image: { src: ai1, alt: "Jamie Kirkland" },
                },
              ].map((profile, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 flex flex-col items-center dark:border-gray-600 text-sm dark:text-gray-300 ${
                    profile.featured
                      ? "bg-blue-50 border border-blue-100"
                      : "border"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                    <Image
                      src={profile.image.src}
                      alt={profile.image.alt}
                      width={64}
                      height={64}
                      className="object-cover "
                    />
                  </div>
                  <h3 className="font-semibold dark:text-white">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.role}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-xs dark:text-gray-300">
                      <span className="font-bold">{profile.rating}</span> Rating
                    </div>
                    <div className="text-xs dark:text-gray-300">
                      <span className="font-bold">{profile.projects}</span>{" "}
                      Projects
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-8 rounded-full dark:border-gray-600 dark:text-gray-300"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">
              Why Choose Masters in Me?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-lg mx-auto">
              A platform designed to connect professionals with clients looking
              for specialized expertise
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <Image
                  src={meme1} // Ensure this path is correct
                  alt="Professional"
                  width={300}
                  height={400}
                  className="rounded-xl mx-auto"
                />

                {/* Feature Cards */}
                <div className="absolute top-10 -right-10 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm dark:text-white">
                        Networking Opportunities
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Connect with industry professionals
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7 rounded-full dark:border-gray-600 dark:text-gray-300"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-10 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-purple-600 dark:text-purple-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm dark:text-white">
                        Showcase Work
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Display your portfolio to potential clients
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7 rounded-full dark:border-gray-600 dark:text-gray-300"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-10 bg-white rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm dark:text-gray-700">Showcase Work</h3>
                      <p className="text-xs text-gray-500">
                        Display your portfolio to potential clients
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7 rounded-full"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 left-10 bg-white rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm dark:text-gray-700">Secure Payments</h3>
                      <p className="text-xs text-gray-500">
                        Safe and reliable payment system
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7 rounded-full"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-left">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold dark:text-gray-700">Showcase Work</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Display your portfolio and skills to potential clients and
                    employers
                  </p>
                  <Button className="mt-3 rounded-full dark:bg-gray-200">Get Started</Button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-pink-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold dark:text-gray-700">Find Clients</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect with businesses looking for your specific skills and
                    expertise
                  </p>
                  <Button className="mt-3 rounded-full dark:bg-gray-200">Explore</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2">
              We are happy to work with incredible clients
            </h2>
            <p className="text-gray-600 mb-12">
              The trusted platform where professionals and businesses connect
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Logo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
              How It Works
            </h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                    01
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm flex-1">
                    <h3 className="font-semibold mb-1 dark:text-white">
                      Sign Up and create Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create your professional profile in minutes
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold">
                    02
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm flex-1">
                    <h3 className="font-semibold mb-1 dark:text-white">
                      Upload Your Portfolio
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add your work samples, skills, and experience
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 font-bold">
                    03
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm flex-1">
                    <h3 className="font-semibold mb-1 dark:text-white">
                      Get Discovered
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Let clients find you for their next project
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Image
                  src={ai6}
                  alt="How it works"
                  width={500}
                  height={400}
                  className="rounded-xl"
                />
                <div className="absolute -bottom-4 -left-4 flex">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden ${
                        i > 1 ? "-ml-3" : ""
                      }`}
                    >
                      <Image
                        src={meme}
                        alt={`User ${i}`}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs -ml-3">
                    +5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              What our clients say
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold">Michael Ross</h3>
                    <p className="text-sm text-gray-400">CEO at Acme Inc</p>
                  </div>
                </div>
                <p className="text-lg mb-6">
                  "Working with Master In me has been an incredibly painless and
                  enjoyable experience."
                </p>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <Image
                  src={ai7} // Ensure this path is correct
                  alt="Testimonial"
                  width={500}
                  height={300}
                  className="rounded-xl h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
              Frequently asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="bg-white dark:bg-gray-700 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      Q
                    </div>
                    <span className="dark:text-white">
                      How do I create an account on the platform?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <p className="text-sm dark:text-gray-300">
                      Creating an account is simple! Click on the "Sign Up"
                      button in the top right corner, fill in your details, and
                      follow the verification process. Once verified, you can
                      start building your professional profile.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-white dark:bg-gray-700 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      Q
                    </div>
                    <span className="dark:text-white">
                      How do I apply for a job through this platform?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-sm dark:text-gray-300">
                    Browse available jobs in your field, review the
                    requirements, and click "Apply" on jobs that match your
                    skills. You can also set up job alerts to be notified of new
                    opportunities.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-white dark:bg-gray-700 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      Q
                    </div>
                    <span className="dark:text-white">
                      How can I track the status of my job applications?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-sm dark:text-gray-300">
                    You can track all your applications in the "My Applications"
                    section of your dashboard. This shows the status of each
                    application and any messages from potential employers.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-white dark:bg-gray-700 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-gray-100 dark:bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      Q
                    </div>
                    <span className="dark:text-white">
                      Is there a cost to use the job board, and what features
                      are free?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-sm dark:text-gray-300">
                    Basic features like creating a profile and applying to jobs
                    are free. Premium features such as priority applications and
                    advanced profile customization require a subscription plan.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Join ambitious professionals and unlock your dream career today
              </h2>
              <p className="mb-8 opacity-90">
                Create your professional profile and connect with clients
                looking for your skills
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">Free to join</span>
                </div>

                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">No hidden fees</span>
                </div>
              </div>

              <Button className="mt-8 bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700 rounded-full ">
                Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
