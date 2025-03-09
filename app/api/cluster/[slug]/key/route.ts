import { NextResponse } from 'next/server';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export const POST = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }
  console.log("register key ", currentUser)
  // Step 1: Generate registration options
  const options = generateRegistrationOptions({
    rpName: "K3Sphere", // Change to your app's name
    rpID: "k3sphere.com", // Change to your domain for production
    userID: currentUser.id!,
    userName: currentUser.name!,
    attestationType: "none",
  });

  // Step 2: Send the options back to the frontend
  return NextResponse.json(options);
});

// Handle the registration verification response
export const PUT = auth(async (req) => {
    if (!req.auth) {
      return new Response("Not authenticated", { status: 401 });
    }
  
    const currentUser = req.auth.user;
    if (!currentUser) {
      return new Response("Invalid user", { status: 401 });
    }
  const body = await req.json();

  // Step 1: Verify the registration response
  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: "some-challenge-stored", // Replace with actual challenge stored during the initial request
    expectedOrigin: "http://localhost:3000",    // Change for production
    expectedRPID: "localhost",
  });

  if (verification.verified) {


    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
});
