import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // Sprites are small, already-optimized PNGs served from the PokeAPI CDN;
      // routing them through the Next image optimizer would only spend quota.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "next-env.d.ts", "test-results/**", "playwright-report/**", "lib/supabase/database.types.ts"] },
];

export default config;
