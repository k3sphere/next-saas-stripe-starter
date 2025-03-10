// pages/register.tsx
"use client"; // Required in Next.js App Router

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import useCluster from "@/hooks/use-cluster";

export default function Register() {

  const {selected} = useCluster();

  const registerPasskey = async () => {
    const response = await fetch(`/api/cluster/${selected?.id}/key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const options = await response.json();

    try {
      const attestationResponse = await startRegistration(options);

      const verificationResponse = await fetch(`/api/cluster/${selected?.id}/key`, {
        method: "PUT",
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

      <button onClick={registerPasskey}>Register Passkey</button>
    </div>
  );
}
