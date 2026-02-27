/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "current-janela-omaralbaz-22690ac0.koyeb.app",
      },
    ],
  },
};

export default nextConfig;
