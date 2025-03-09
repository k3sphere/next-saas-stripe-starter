import { NextResponse } from 'next/server';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { RegistrationResponseJSON } from '@simplewebauthn/server/script/deps';

let challengeStore: { [key: string]: { challenge: string; userId: any } } = {};

export const POST = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }
  const { userId } = await req.json();

  // Step 1: Generate registration options
  const options = await generateRegistrationOptions({
    rpName: "K3Sphere", // Change to your app's name
    rpID: "k3sphere.com", // Change to your domain for production
    userID: currentUser.id!,
    userName: userId,
    attestationType: "none",
  });

  // Store the challenge in the global variable
  challengeStore[currentUser.id!] = { challenge: options.challenge, userId};

  console.log(options);
  return new Response(JSON.stringify(options), { status: 200 });
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

    const { pathname } = req.nextUrl;
    const path = pathname.split("/")
    path.pop();
    const slug = path.pop(); // Get the last segment

  const body = await req.json() as RegistrationResponseJSON;


  // Extract the counter from authenticatorData
  if (!body.response.authenticatorData) {
    return new Response("Invalid authenticator data", { status: 400 });
  }
  const authenticatorData = new DataView(Buffer.from(body.response.authenticatorData, 'base64').buffer);
  const counter = authenticatorData.getUint32(33, false);

  // Step 1: Verify the registration response
  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: challengeStore[currentUser.id!].challenge, // Replace with actual challenge stored during the initial request
    expectedOrigin: "https://k3sphere.com",    // Change for production
    expectedRPID: "k3sphere.com",
  });
  if (verification.verified) {
    // save key to database
    console.log(body, challengeStore[currentUser.id!].userId);
    await prisma.k8sCluster.update({
      where: {
        id: slug
      },
      data: {
        keyType: body.authenticatorAttachment!,
        passKey: body.response.publicKey!,
        counter: counter,
      },
    });

    delete challengeStore[currentUser.id!];
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
});
