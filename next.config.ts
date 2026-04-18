import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 添加 images 配置块
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // 这里填入你报错信息里的那个 hostname
        hostname: "xvwjtmycuaplxmtgwkok.supabase.co",
        port: "",
        // 允许访问 public 文件夹下的所有路径
        pathname: "/storage/v1/object/public/**", 
      },
    ],
  },
};

export default nextConfig;