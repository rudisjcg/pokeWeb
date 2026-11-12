import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  { ignores: [".next/**", "next-env.d.ts", "test-results/**", "playwright-report/**", "lib/supabase/database.types.ts"] },
];

export default config;
