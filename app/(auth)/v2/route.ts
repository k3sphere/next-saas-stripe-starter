// app/api/v2/[...slug]/route.js
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
    // Return 401 Unauthorized with required headers
    let authHeader = req.headers.get('authorization');
    if (!authHeader) {
      authHeader = req.headers.get('Authorization');
    }
    console.log(authHeader);
    if (authHeader && authHeader.startsWith('Basic ')) {
      //const parsed = await verifyToken(authHeader.substring(7));
      const isExpired = false;
      if(!isExpired) {
        return NextResponse.json({
          'content-type': 'application/json',
          'docker-distribution-api-version': 'registry/2.0',
        });
      }else {
        return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
      }

    }

    return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
            "Content-Type": "application/json",
            "Docker-Distribution-API-Version": "registry/2.0",
        },
    });
}
