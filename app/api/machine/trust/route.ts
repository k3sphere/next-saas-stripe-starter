import { NextRequest, NextResponse } from "next/server";


import { auth } from "@/auth";

import { prisma } from "@/lib/db";

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
    const user = await prisma.k8sCluster.findUnique({
      where: { id: clusterId  },
      select: {
        id: true,
        userId: true,
        apiKey: true,
        relays: {
          select: {
            id: true,
            relay: true,
          },
        },
      }
    });

    if (!user || user.apiKey !== password) {
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
    }


    const result = await prisma.authenticator.findMany({
      where: {
        userId:  user.userId
      },
      select: {
        credentialPublicKey: true
      }
    })

    return NextResponse.json(result);
  }



});
