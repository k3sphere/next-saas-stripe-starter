
"use client";

import { signIn } from "next-auth/webauthn"
export function RegisterKeyForm() {
    return <button onClick={() => signIn("passkey", { action: "register" })}>
                Register new Passkey
              </button>
}