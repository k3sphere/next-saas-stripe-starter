import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  let authHeader = req.headers.get('authorization');
  if (!authHeader) {
    authHeader = req.headers.get('Authorization');
  }
  console.log(authHeader);
  if (authHeader && authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.substring(6);
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [clusterId, password] = decoded.split(':');

    if (!clusterId || !password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Query database using Prisma
    const cluster = await prisma.k8sCluster.findUnique({
      where: { id: clusterId  },
      select: {
        id: true,
        name: true,
        location: true,
        apiKey: true,
        userId: true,
        relays: {
          select: {
            id: true,
            relay: true,
          },
        },
      }
    });

    if (!cluster || cluster.apiKey !== password) {
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
    }
    return new Response(JSON.stringify(cluster), { status: 200 });
  }else {
    if (!req.auth) {
      return new Response("Not authenticated", { status: 401 });
    }
    const currentUser = req.auth.user;
    if (!currentUser) {
      return new Response("Invalid user", { status: 401 });
    }
    
    const { pathname } = req.nextUrl;

    const slug = pathname.split("/").pop(); // Get the last segment


    try {
      const cluster = await prisma.k8sCluster.findFirst({
        where: {
          userId: currentUser.id,
          OR: [
            { id: slug },
            { name: slug }
          ]
        },
        select: {
          id: true,
          name: true,
          location: true,
          apiKey: true,
          publicKey: true,
          host: true,
          ip: true,
          dns: true,
          relays: {
            select: {
              id: true,
              relay: {
                select: {
                  ip: true
                }
              },
            },
          },
        }
      });
      return new Response(JSON.stringify(cluster), { status: 200 });
    } catch (error) {
      return new Response("Internal server error", { status: 500 });
    }
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
  try {
    const clusters = await prisma.k8sCluster.create({ data: { userId, name, location, apiKey: "something"}});
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});



export const DELETE = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }

  const { pathname } = req.nextUrl;

  const slug = pathname.split("/").pop(); // Get the last segment


  try {
    const cluster = await prisma.k8sCluster.update({
      where: {
        userId: currentUser.id,
        id: slug
      },
      data: {
        delete: true,
        synched: false,
      },
      select: {
        id: true,
        name: true,
        location: true,
        host: true,
        delete: true,
        ip: true,
        dns: true
        }
      });
    return new Response(JSON.stringify(cluster), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});
