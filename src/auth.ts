import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sendRequest } from "./utils/api";
import {
  ForbiddenError,
  InactiveAccountError,
  InvalidEmailPasswordError,
  NotFoundError,
  RequestTimeOutError,
} from "./utils/errors";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          body: {
            username: credentials.username,
            password: credentials.password,
          },
        });

        if (res.statusCode === 201) {
          return {
            id: res.data?.user?.id,
            username: res.data?.user?.name,
            email: res.data?.user?.email,
            access_token: res.data?.access_token,
            role_id: res.data?.user?.role_id,
          };
        } else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError();
        } else if (+res.statusCode === 400) {
          throw new InactiveAccountError();
        } else if (+res.statusCode === 403) {
          throw new ForbiddenError();
        } else if (+res.statusCode === 404) {
          throw new NotFoundError();
        } else if (+res.statusCode === 408) {
          throw new RequestTimeOutError();
        } else {
          throw new Error("Internal server error");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
    // authorized: async ({ auth }) => {
    //   return !!auth;
    // },
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;
      // Cho phép truy cập public cho các route và sub-route
      if (
        pathname === "/" ||
        pathname.startsWith("/course") ||
        pathname.startsWith("/blog") ||
        pathname.startsWith("/news")
      ) {
        return true;
      }
      // Yêu cầu session cho các route khác
      return !!auth;
    },
  },
});
