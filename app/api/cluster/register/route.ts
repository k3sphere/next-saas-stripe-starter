import { NextRequest, NextResponse } from "next/server";


import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const POST = auth(async (req) => {

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


    const {  ip, host, oidc, publicKey } =
    await req.json();

    console.log(ip, host, oidc, publicKey);
    await prisma.k8sCluster.update({
      where: { id: clusterId },
      data: {
        ip,
        host,
        oidc,
        publicKey,
      },
    });

    return new NextResponse("OK", {
      status: 200,
    });
  }
});
