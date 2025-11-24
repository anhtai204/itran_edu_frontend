import { Facebook, Twitter, Globe, Youtube } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export function Instructor() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-auto flex justify-center">
          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-1">
            <Avatar className="h-32 w-32 rounded-lg">
              <Image
                src={"./assets/image/course/doof.jpg"}
                alt="Vinh"
                className="rounded-lg"
              />
            </Avatar>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">Vinh</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Vinh is a comprehensive LMS Plugin for. This is one of the best LMS
            Plugins which can be used to easily create & sell courses online.
          </p>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1 text-sm">
              <span className="text-orange-500 dark:text-orange-400">
                156 Students
              </span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1 text-sm">
              <span className="text-blue-500 dark:text-blue-400">
                20 Lessons
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-gray-600 dark:text-gray-300">
          LearnPress is a comprehensive LMS Plugin. This is one of the best LMS
          Plugins which can be used to easily create & sell courses online.
        </p>
      </div>
    </div>
  );
}