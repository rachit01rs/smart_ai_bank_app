/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output keeps the Docker image small: the build produces a
  // self-contained server.js with only the node_modules it actually needs.
  output: 'standalone',
};

module.exports = nextConfig;
