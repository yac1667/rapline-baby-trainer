/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? "/rapline-baby-trainer" : "",
  assetPrefix: isGithubPages ? "/rapline-baby-trainer/" : "",
};

export default nextConfig;
