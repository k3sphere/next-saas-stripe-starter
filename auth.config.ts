import type { NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { env } from "@/env.mjs";

export default {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
} satisfies NextAuthConfig;
