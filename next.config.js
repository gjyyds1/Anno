/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置公告文件目录作为静态资源
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
    return config
  }
}

module.exports = nextConfig