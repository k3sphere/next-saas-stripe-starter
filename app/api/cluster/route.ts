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
    const members = await prisma.member.findMany({
      where: {
        userId: currentUser.id,
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
    const clusters = members.map((mem)=>{return {...mem.cluster, role: mem.role}});
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
    const relays = await prisma.relayServer.findMany({ where: { location}});
    await prisma.clusterRelay.createMany({ data: relays.map((relay) => ({ clusterId: clusters.id, relayId: relay.id}))}) 
    await prisma.member.create({ data: { userId, clusterId: clusters.id, role: "OWNER", name: currentUser.name,synched:true}}) 
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});