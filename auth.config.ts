import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import KeycloakProvider from "next-auth/providers/keycloak";

import { env } from "@/env.mjs";
import { sendVerificationRequest } from "@/lib/email";
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
} satisfies NextAuthConfig;
