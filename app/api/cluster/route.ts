import { auth } from "@/auth";

import { prisma } from "@/lib/db";

import { randomBytes } from 'crypto';

function generateClientSecret(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const randomBytesArray = randomBytes(length);
  let secret = '';

  for (let i = 0; i < length; i++) {
    secret += charset[randomBytesArray[i] % charset.length];
  }

  return secret;
}

export const GET = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }

  try {
    const clusters = await prisma.k8sCluster.findMany({
      where: {
        userId: currentUser.id,
      },
      select: {
        id: true,
        name: true,
        location: true,
        publicKey: true,
      },
    });
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});


export const POST = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser || !currentUser.id) {
    return new Response("Invalid user", { status: 401 });
  }
  const userId = currentUser.id
  const { name, location } =
  await req.json();
  console.log(name, location)
  const apiKey = generateClientSecret(32)
  
  try {
    const clusters = await prisma.k8sCluster.create({ data: { userId, name, location, apiKey}});
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});