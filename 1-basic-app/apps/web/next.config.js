const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    const stub = path.resolve(__dirname, "src/lib/base-account-stub.js");
    const empty = path.resolve(__dirname, "src/lib/empty-module.js");

    config.resolve.alias = {
      ...config.resolve.alias,
      "@base-org/account": stub,
      "@coinbase/cdp-sdk": empty,
      "@x402/svm": empty,
      "@x402/svm/exact/client": empty,
      "@x402/svm/exact/server": empty,
      "@x402/svm/upto/client": empty,
      "@x402/svm/upto/server": empty,
      "@react-native-async-storage/async-storage": empty,
    };

    return config;
  },
};

module.exports = nextConfig;
