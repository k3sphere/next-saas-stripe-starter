// app/api/v2/[...slug]/route.js
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
    // Return 401 Unauthorized with required headers
    let authHeader = req.headers.get('authorization');
    if (!authHeader) {
      authHeader = req.headers.get('Authorization');
    }
    console.log(authHeader);
    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.substring(6);
      const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');

      if (!username || !password) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      // Query database using Prisma
      const user = await prisma.k8sCluster.findUnique({
        where: { id: username  },
      });

      if (!user || user.apiKey !== password) {
        return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
      }

      return NextResponse.json({
        'content-type': 'application/json',
        'docker-distribution-api-version': 'registry/2.0',
      });
    }

    return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
            "Content-Type": "application/json",
            "Docker-Distribution-API-Version": "registry/2.0",
            "WWW-Authenticate": 'Basic realm="Docker Registry"',
        },
    });
}
