// pages/register.tsx
"use client"; // Required in Next.js App Router

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";

export default function Register() {
  const [userId, setUserId] = useState("");

  const registerPasskey = async () => {
    const response = await fetch("/api/auth/register", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const options = await response.json();

    try {
      const attestationResponse = await startRegistration(options);

      const verificationResponse = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(attestationResponse),
        headers: { "Content-Type": "application/json" },
      });

      const verificationResult = await verificationResponse.json();
      console.log("Passkey registration result:", verificationResult);
    } catch (error) {
      console.error("Error registering passkey:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={registerPasskey}>Register Passkey</button>
    </div>
  );
}
