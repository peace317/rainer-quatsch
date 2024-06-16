/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /*instrumentationHook: true,*/
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil"
    });

    return config;
  },
  output: "standalone",
}

module.exports = nextConfig
