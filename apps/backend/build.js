const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "dist/index.js",
  external: [
    "firebase-admin",
    "firebase-functions",
    "express",
    "cors",
    "cookie-parser",
    "helmet",
    "express-rate-limit",
    "zod",
    "multer",
    "@prisma/client",
    "bcrypt",
    "jsonwebtoken"
  ]
}).catch(() => process.exit(1));
