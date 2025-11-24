import { NewsCard } from "./news-card";

import ani from "@/assets/images/ani.png";
import ai from "@/assets/images/ai.webp";
import doof from "@/assets/images/doof.jpg";
import earth from "@/assets/images/earth.png";
import hnue from "@/assets/images/hnue.jpg";
import meme from "@/assets/images/meme.jpg";
import meme1 from "@/assets/images/meme1.jpg";

import ai1 from "@/assets/images/ai1.jpg";
import ai2 from "@/assets/images/ai2.jpg";
import ai3 from "@/assets/images/ai3.jpg";
import ai4 from "@/assets/images/ai4.jpg";
import ai5 from "@/assets/images/ai5.jpg";
import ai6 from "@/assets/images/ai6.png";
import ai7 from "@/assets/images/ai7.png";
import ai8 from "@/assets/images/ai8.webp";
import ai9 from "@/assets/images/ai9.webp";
import { RawNews } from "@/utils/action";

// Mock data
// const newsItems = [
//   {
//     id: "1",
//     title: "New Data Science Course Launching Next Month",
//     excerpt:
//       "Our comprehensive data science course will cover everything from basic statistics to advanced machine learning techniques.",
//     category: "Announcements",
//     date: "March 12, 2025",
//     readTime: "4 min read",
//     image: ai5,
//     slug: "new-data-science-course",
//   },
//   {
//     id: "2",
//     title: "Virtual Career Fair for Tech Students",
//     excerpt:
//       "Join our virtual career fair to connect with top tech companies looking for fresh talent.",
//     category: "Events",
//     date: "March 10, 2025",
//     readTime: "3 min read",
//     image: ai6,
//     slug: "virtual-career-fair",
//   },
//   {
//     id: "3",
//     title: "Itran Education Partners with Global Tech Giant",
//     excerpt:
//       "Our new partnership will provide students with exclusive internship opportunities and industry insights.",
//     category: "Partnerships",
//     date: "March 8, 2025",
//     readTime: "5 min read",
//     image: ai7,
//     slug: "partnership-with-tech-giant",
//   },
//   {
//     id: "4",
//     title: "Student Spotlight: From Bootcamp to Senior Developer",
//     excerpt:
//       "Read how our former student went from a complete beginner to a senior developer at a leading tech company.",
//     category: "Success Stories",
//     date: "March 5, 2025",
//     readTime: "6 min read",
//     image: ai8,
//     slug: "student-spotlight-senior-developer",
//   },
//   {
//     id: "5",
//     title: "Platform Updates: New Learning Dashboard",
//     excerpt:
//       "We've revamped our learning dashboard to provide a more personalized and intuitive experience.",
//     category: "Updates",
//     date: "March 3, 2025",
//     readTime: "3 min read",
//     image: ai9,
//     slug: "platform-updates-new-dashboard",
//   },
//   {
//     id: "6",
//     title: "Free Webinar: Introduction to Blockchain Development",
//     excerpt:
//       "Join our free webinar to learn the basics of blockchain technology and development.",
//     category: "Webinars",
//     date: "March 1, 2025",
//     readTime: "2 min read",
//     image: meme,
//     slug: "free-webinar-blockchain",
//   },
//   {
//     id: "7",
//     title: "New Scholarship Program for Underrepresented Groups in Tech",
//     excerpt:
//       "We're launching a new scholarship program to support underrepresented groups in the tech industry.",
//     category: "Announcements",
//     date: "February 28, 2025",
//     readTime: "4 min read",
//     image: meme1,
//     slug: "scholarship-program",
//   },
//   {
//     id: "8",
//     title: "Annual Tech Conference Registration Now Open",
//     excerpt:
//       "Register now for our annual tech conference featuring keynote speakers from leading tech companies.",
//     category: "Events",
//     date: "February 25, 2025",
//     readTime: "3 min read",
//     image: ai,
//     slug: "annual-tech-conference",
//   },
//   {
//     id: "9",
//     title: "New Mobile Development Curriculum",
//     excerpt:
//       "Our updated mobile development curriculum now includes the latest frameworks and technologies.",
//     category: "Updates",
//     date: "February 22, 2025",
//     readTime: "5 min read",
//     image: ani,
//     slug: "mobile-development-curriculum",
//   },
// ];

interface Category {
  id: string;
  name: string;
}

interface NewsGridProps {
  news: RawNews[];
  searchQuery: string;
  selectedCategory: string | null;
}

export function NewsGrid({
  news,
  searchQuery,
  selectedCategory,
}: NewsGridProps) {
  const newsItems = news;
  // Filter news based on search query and selected category
  const filteredNews = newsItems.filter((news) => {
    console.log('>>>news filter: ', news)
    const matchesSearch = searchQuery
      ? news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    console.log(">>>matchesSearch: ", matchesSearch);

    const matchesCategory = selectedCategory
      ? news.categories.some(
          (category: Category) =>
            category.id.toLowerCase() === selectedCategory.toLowerCase()
        )
      : true;

    console.log(">>>matchesCategory: ", matchesCategory);

    
    
    return matchesSearch && matchesCategory;
  });
  console.log(">>>filteredNews: ", filteredNews);

  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No news found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNews.map((news: any) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}
