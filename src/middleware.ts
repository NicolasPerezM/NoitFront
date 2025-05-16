import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isPublic =
    pathname === '/login' ||
    pathname === "/register" ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_astro/') ||
    pathname === '/favicon.ico';

  if (!isPublic) {
    const token = context.cookies.get('token')?.value;

    if (!token) {
      return context.redirect('/login');
    }
  }

  return next();
});

