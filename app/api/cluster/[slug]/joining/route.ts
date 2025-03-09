import { auth } from "@/auth";

import { prisma } from "@/lib/db";

import { randomBytes } from 'crypto';

async function generateClientSecret(length: number = 32): Promise<string> {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const randomBytesArray = randomBytes(length);
  let secret = '';

  for (let retry = 0; retry < 10; retry++) {
      // check whether it's used
    for (let i = 0; i < length; i++) {
      secret += charset[randomBytesArray[i] % charset.length];
    }
    // check whether it's used
    const result = await prisma.joiningKey.findFirst({
      where: {
        key: secret,
      },
    })
    if (!result) {
      return secret;
    }
  }

  return "";
}

export const GET = auth(async (req) => {
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

  console.log("cluster:",slug);
  try {
    const nodes = await prisma.joiningKey.findMany({
      where: {
        clusterId: slug,
      },
      select: {
        id: true,
        name: true,
        purpose: true,
        max: true,
        counter: true,
        expireDate: true,
        tags: true,
        cluster: {
          select: {
            name: true,
          }
        }
      }
    });
    return new Response(JSON.stringify(nodes), { status: 200 });
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
  const {  name,purpose,max,expireDate, tags } =
  await req.json() as { name: string, purpose: string, max: number, tags: string[], expireDate: Date | null };
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/")
  const clusterId = segments[segments.length-2]; // Get the last segment

  try {

    const member = await prisma.member.findFirst({
      where: {
        userId: currentUser.id,
        clusterId: clusterId,
        delete: false
      },
      select: {
        role: true,
        cluster: {
          select: {
            id: true,
            name: true,
            location: true,
            publicKey: true,
          }
        },
      },
    });
    if (member == null || member.role !== "OWNER") {
      return new Response("No access", { status: 401 });
    }
    const key = await generateClientSecret(); // Assuming you have a function to generate a unique key
    if(key == "") {
      return new Response("Internal server error", { status: 500 });
    }
    const clusters = await prisma.joiningKey.create({ data: { clusterId, name, purpose, max, expireDate, key, tags }});
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});