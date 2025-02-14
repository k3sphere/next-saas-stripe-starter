import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

import { env } from "@/env.mjs";
import { sendVerificationRequest } from "@/lib/email";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 587,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
} satisfies NextAuthConfig;
