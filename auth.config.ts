import type { NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { env } from "@/env.mjs";
import Passkey from "next-auth/providers/passkey"

export default {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    Passkey,
  ],
  experimental: { enableWebAuthn: true },
  debug: process.env.NODE_ENV !== "production"
} satisfies NextAuthConfig;
