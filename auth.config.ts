import type { NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import Passkey from "next-auth/providers/passkey"

import { env } from "@/env.mjs";

export default {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    Passkey,
  ],
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        domain: ".k3sphere.com", // Allows sharing cookies across subdomains
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
      },
    },
  },
  experimental: { enableWebAuthn: true },
} satisfies NextAuthConfig;
