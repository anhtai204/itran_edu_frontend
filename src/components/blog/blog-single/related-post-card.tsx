import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface RelatedPostProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    image: StaticImport;
    author: string;
    publishedAt: string;
    readTime: string;
    slug: string;
  };
}

export function RelatedPostCard({ post }: { post: RelatedPostProps }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="m-2 flex gap-3 group">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {post.title}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{post.publishedAt}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}