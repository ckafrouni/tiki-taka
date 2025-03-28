import type { NextConfig } from "next";

export default {
  allowedDevOrigins: [
    "http://localhost:3001",
    "http://localhost:3000",
    "http://127.0.0.1:53035",
  ],
} satisfies NextConfig;
