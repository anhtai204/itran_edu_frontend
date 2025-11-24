"use server";

import { auth, signIn } from "@/auth";
import { revalidateTag } from "next/cache";
import { sendRequest } from "./api";
export const getSession = async () => {
  const session = await auth();
  return session;
};

export async function authenticate(username: string, password: string) {
  try {
    const r = await signIn("credentials", {
      username: username,
      password: password,
      // callbackUrl: "/",
      redirect: false,
    });
    console.log(">>> check r: ", r);
    return r;
  } catch (error) {
    if ((error as any).name === "InvalidEmailPasswordError") {
      return {
        error: (error as any).type,
        code: 1,
      };
    } else if ((error as any).name === "InactiveAccountError") {
      return {
        error: (error as any).type,
        code: 2,
      };
    } else {
      return {
        error: "Internal server error",
        code: 0,
      };
    }
  }
}

// Hàm lấy tất cả users từ API
export const getUsers = async () => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

export const handleCreateUserAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-users");
  return res;
};

export const handleUpdateUserAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-users");
  return res;
};

export const handleDeleteUserAction = async (id: any) => {
  const session = await auth();
  console.log(id);
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-users");
  return res;
};

export const handleGetUserById = async () => {
  const session = await auth();
  const id = session?.user?.id;
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return res;
};

export const changePasswordWithoutCode = async (
  id: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres/change-password/${id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: {
        oldPassword,
        newPassword,
        confirmPassword,
      },
    });
    if (res.statusCode === 200) {
      return res;
    }
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const handleGetRoles = async () => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/roles`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    const items = res.data.map((role) => ({
      label: role.description, // Gán label từ description
      key: role.id, // Gán key từ name
    }));
    return items;
  }
  return [];
};

// Category Post/News
export const handleGetCategories = async () => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/all`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      const items = res.data.map((category) => ({
        label: category.name, // Gán label từ name
        key: category.id, // Gán key từ id
        description: category.description || "",
        slug: category.slug || "",
        parent_id: category.parent_id || null, // Get parent_id directly from the category
      }));
      return items;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const handleGetCategoryRelationships = async () => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/relationships`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

export const handleCreateCategory = async (data: any) => {
  const session = await auth();

  // Create a copy of the data to modify
  const requestData = { ...data };

  console.log(">>> requestData: ", requestData);
  // If parent_id is "none" or empty string, set it to null
  if (requestData.parent_id === "none" || requestData.parent_id === "") {
    requestData.parent_id = null;
  } else {
    requestData.parent_id = requestData.parent_id;
  }

  // Keep the parent_id property as it's needed in the API

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: requestData,
    });

    revalidateTag("categories");
    return res;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

interface UpdateCategory {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
}

export const handleUpdateCategory = async (
  id: string,
  data: UpdateCategory
) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${id}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parent_id: data.parent_id,
    },
  });

  revalidateTag("categories");
  return res;
};

export const handleDeleteCategory = async (id: string) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("categories");
  return res;
};

// Category Quiz
export const handleGetCategoriesQuiz = async () => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-quiz/all`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      const items = res.data.map((category) => ({
        label: category.name, // Gán label từ name
        key: category.id, // Gán key từ id
        description: category.description || "",
        slug: category.slug || "",
        parent_id: category.parent_id || null, // Get parent_id directly from the category
      }));
      return items;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const handleGetCategoryQuizRelationships = async () => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-quiz/relationships`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

export const handleCreateCategoryQuiz = async (data: any) => {
  const session = await auth();

  // Create a copy of the data to modify
  const requestData = { ...data };

  console.log(">>> requestData: ", requestData);
  // If parent_id is "none" or empty string, set it to null
  if (requestData.parent_id === "none" || requestData.parent_id === "") {
    requestData.parent_id = null;
  } else {
    requestData.parent_id = requestData.parent_id;
  }

  // Keep the parent_id property as it's needed in the API

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-quiz`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: requestData,
    });

    revalidateTag("category-quiz");
    return res;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

interface UpdateCategoryQuiz {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
}

export const handleUpdateCategoryQuiz = async (
  id: string,
  data: UpdateCategoryQuiz
) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-quiz/${id}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parent_id: data.parent_id,
    },
  });

  revalidateTag("category-quiz");
  return res;
};

export const handleDeleteCategoryQuiz = async (id: string) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-quiz/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("category-quiz");
  return res;
};

// Posts
export const handleCreatePost = async (data: any) => {
  const session = await auth();

  // Tạo một bản sao của dữ liệu để xử lý
  const postData = { ...data };

  if (!Array.isArray(postData.blocks_data)) {
    console.error("blocks_data must be an array");
    throw new Error("blocks_data must be an array");
  }

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: postData,
    });

    revalidateTag("list-posts");
    return res;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const handleUpdatePost = async (data: any) => {
  const session = await auth();

  // Tạo một bản sao của dữ liệu để xử lý
  const postData = { ...data };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/update`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: postData,
    });

    revalidateTag("list-posts");
    return res;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const handleDeletePost = async (id: string) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/delete/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-posts");
  return res;
};

export const handleGetPostBySlug = async (slug: string) => {
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/${slug}`,
      method: "GET",
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export interface RawPost {
  id: string;
  title: string;
  author: string;
  create_at: Date;
  content: string;
  excerpt: string | null;
  description: string;
  post_status: string;
  visibility: string;
  comment_status: boolean;
  ping_status: boolean;
  slug: string;
  categories: string[];
  feature_image: string;
  scheduled_at: string;
}

export const handleGetCustomPost = async (): Promise<RawPost[]> => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<RawPost[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

// Post tags
export const handleDeletePostTagAction = async (id: any) => {
  const session = await auth();
  console.log(id);
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-tags/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-tags");
  return res;
};

export const handleCreatePostTagAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-tags`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-tags");
  return res;
};

export const handleUpdatePostTagAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-tags`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-tags");
  return res;
};

export const handleGetPostTags = async () => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-tags`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      const items = res.data.map((category) => ({
        label: category.name, // Gán label từ name
        key: category.id, // Gán key từ id
      }));
      return items;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// News
export interface RawNews {
  id: string;
  title: string;
  author: string;
  create_at: Date;
  content: string;
  excerpt: string | null;
  description: string;
  news_status: string;
  visibility: string;
  slug: string;
  categories: {
    id: string;
    name: string;
  }[];
  feature_image: string;
  scheduled_at: string;
}

export const handleCreateNews = async (data: any) => {
  const session = await auth();

  // Tạo một bản sao của dữ liệu để xử lý
  const newsData = { ...data };

  if (!Array.isArray(newsData.blocks_data)) {
    console.error("blocks_data must be an array");
    throw new Error("blocks_data must be an array");
  }

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: newsData,
    });

    revalidateTag("list-news");
    return res;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

export const handleUpdateNews = async (data: any) => {
  const session = await auth();

  // Tạo một bản sao của dữ liệu để xử lý
  const newsData = { ...data };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/update`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: newsData,
    });

    revalidateTag("list-news");
    return res;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

export const handleDeleteNews = async (id: string) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/delete/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-news");
  return res;
};

export const handleGetNewsBySlug = async (slug: string) => {
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/${slug}`,
      method: "GET",
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const handleGetCustomNews = async (): Promise<RawNews[]> => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<RawNews[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/custom`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

// News tags
export const handleDeleteNewsTagAction = async (id: any) => {
  const session = await auth();
  console.log(id);
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news-tags/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-tags");
  return res;
};

export const handleCreateNewsTagAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news-tags`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-tags");
  return res;
};

export const handleUpdateNewsTagAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news-tags`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-tags");
  return res;
};

export const handleGetNewsTags = async () => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news-tags`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      const items = res.data.map((category) => ({
        label: category.name, // Gán label từ name
        key: category.id, // Gán key từ id
      }));
      return items;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const handleGetLessons = async () => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lessons`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      const lessons = res.data.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
      }));
      return lessons;
    }
    return [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};


// Quiz levels - Difficulties
export const handleDeleteQuizLevelAction = async (id: any) => {
  const session = await auth();
  console.log(id);
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/difficulties/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-quiz-levels");
  return res;
};

export const handleCreateQuizLevelAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/difficulties`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-quiz-levels");
  return res;
};

export const handleUpdateQuizLevelAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/difficulties`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  revalidateTag("list-quiz-levels");
  return res;
};


export const handleGetQuizLevels = async () => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/difficulties`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      const difficulties = res.data.map((difficulty) => ({
        id: difficulty.id,
        name: difficulty.name,
        description: difficulty.description,
      }));
      return difficulties;
    }
    return [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

// Quizzes
export interface Quiz {
  id?: string;
  title: string;
  description: string;
  author_id: string;
  lesson_id: string;
  category_id: string;
  difficulty_id: string;
  time_limit: number;
  passing_score: number;
  max_attempts: number;
  randomize_questions: boolean;
  show_results: boolean;
  show_correct_answers: boolean;
  show_explanations: boolean;
  status: string;
}

export const handleCreateQuiz = async (data: any) => {
  const session = await auth();
  const author_id = session?.user?.id;

  // Clean up HTML content by removing unnecessary classes
  const cleanHtml = (html: string) => {
    return html.replace(/class="mb-4 whitespace-pre-wrap"/g, '');
  };

  const quizData = {
    ...data,
    author_id,
    description: cleanHtml(data.description)
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: quizData,
    });

    revalidateTag("list-quizzes");
    return res.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

export const handleUpdateQuiz = async (id: string, data: any) => {
  const session = await auth();
  const author_id = session?.user?.id;

  const quizData = { ...data, author_id };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: quizData,
    });

    revalidateTag("list-quizzes");
    return res.data;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }
};

export const handleCreateQuestion = async (data: any) => {
  const session = await auth();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: data,
    });

    revalidateTag("list-quiz-questions");
    return res.data;
  } catch (error) {
    console.error("Error creating quiz question:", error);
    throw error;
  }
};

export const handleGetQuizById = async (id: string) => {
  const session = await auth();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    revalidateTag("list-quizzes");
    return res.data;
  } catch (error) {
    console.error("Error get quizzes:", error);
    throw error;
  }
};

export const handleDuplicateQuiz = async (id: string) => {
  const session = await auth();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/duplicate/${id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    revalidateTag("list-quizzes");
    return res.data;
  } catch (error) {
    console.error("Error get quizzes:", error);
    throw error;
  }
};

export const handleDeleteQuiz = async (id: string) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  revalidateTag("list-quizzes");
  return res.data;
};

export const handleGetQuizzesPuhlished = async () => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/published`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

export const getQuizById = async(id: string) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${id}/questions`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
}

// Questions
export const handleDuplicateQuestion = async (id: string) => {
  const session = await auth();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/duplicate/${id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    revalidateTag("list-quiz-questions");
    return res.data;
  } catch (error) {
    console.error("Error get quizzes:", error);
    throw error;
  }
};

export const handleDeleteQuestion = async (id: string) => {
  const session = await auth();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    revalidateTag("list-quiz-questions");
    return res.data;
  } catch (error) {
    console.error("Error get quizzes:", error);
    throw error;
  }
};

export const handleUpdateQuestion = async (id: string, questionData: any) => {
  const session = await auth();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/${id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: questionData,
    });

    revalidateTag("list-quiz-questions");
    return res.data;
  } catch (error) {
    console.error("Error updating quiz question:", error);
    throw error;
  }
}


export const getQuizData  = async (quizId: string) => {
    const session = await auth();
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${quizId}/questions`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      });
  
      if (res.statusCode === 200) {
        return res.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
}

export const getQuizDataByQuizId = async (quizId: string) => {
  const session = await auth();
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${quizId}/attempt`,
      method: "POST",
      body: {
        userId: session?.user?.id,
      },
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res.statusCode === 200 || res.statusCode === 201) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
}


export const handleSubmitQuiz = async (attempt_id: string, quizId: string, data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${quizId}/submit`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: {
      attempt_id: attempt_id,
      answers: data.answers  // Chỉ gửi mảng answers từ data
    }
  });

  if(res.statusCode === 200 || res.statusCode === 201) {
    return res.data;
  }
  return [];
}

export const handleGetQuizOverview = async (quizId: string) => {
  const session = await auth();
  try {
    console.log('Fetching quiz overview for quizId:', quizId);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${quizId}/overview`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    console.log('Quiz overview response:', res);

    if(res.statusCode === 200 || res.statusCode === 201) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching quiz overview:', error);
    throw error;
  }
}