import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 全站普通页面防刷限制 (每分钟 600 次)
const generalLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(600, "1 m"),
});

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // 1. 放行逻辑不变
  if (pathname.startsWith('/_next') || pathname.startsWith('/admin') || pathname.includes('.')) {
    return intlMiddleware(request);
  }

  // 💡 2. 第一道防线：检查手动黑名单（极快）
  const isBlocked = await redis.get(`blocked_ip:${ip}`);
  if (isBlocked) {
    return new NextResponse(`您的 IP 已被管理员封禁。原因: ${isBlocked}`, { status: 403 });
  }

  // 3. 第二道防线：全站页面级基础防御（限流）
  const { success } = await generalLimit.limit(`ratelimit_gen_${ip}`);
  if (!success) {
    return new NextResponse('请求过于频繁，请稍后再试', { status: 429 });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(cn|jp|en)/:path*',
    '/((?!_next|_vercel|admin|.*\\..*).*)'
  ]
};