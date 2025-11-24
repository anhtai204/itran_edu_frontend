"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { sendRequest } from "@/utils/api";
import CoursesLoading from "./loading";
import { CourseListing } from "@/components/course/couses";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [courses_meta, setCoursesMeta] = useState<any>(null);
  const [course_categories, setCourseCategories] = useState<any[]>([]);
  const [course_categories_meta, setCourseCategoriesMeta] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const resCourses = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/courses`,
        method: "GET",
      });
      setCourses(resCourses?.data?.results || []);
      setCoursesMeta(resCourses?.data?.meta || null);

      const resCourseCategories = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/course_categories`,
        method: "GET",
      });
      setCourseCategories(resCourseCategories?.data?.results || []);
      setCourseCategoriesMeta(resCourseCategories?.data?.meta || null);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <CoursesLoading />
      ) : (
        <CourseListing
          courses={courses}
          course_categories={course_categories}
          courses_meta={courses_meta}
        />
      )}
      <Footer />
    </>
  );
};

export default CoursesPage;