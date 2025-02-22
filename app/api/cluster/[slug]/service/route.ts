import { auth } from "@/auth";

import { prisma } from "@/lib/db";

const checkApiKey = (req: Request, token: string|null) => {
  const apiKey = req.headers.get("authorization");
  return token!= null && apiKey === `Bearer ${token}`;
};

export const GET = auth(async (req) => {

  const { pathname } = req.nextUrl;

  const slug = pathname.split("/").pop(); // Get the last segment
  


  try {
    const cluster = await prisma.k8sCluster.findFirst({
      where: {
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
    if (!cluster) {
      return new Response("Cluster not found", { status: 404 });
    }
    

    return new Response(JSON.stringify(cluster), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});


export const POST = auth(async (req) => {


  const { pathname } = req.nextUrl;

  const slug = pathname.split("/").pop(); // Get the last segment


  try {
    const cluster = await prisma.k8sCluster.findFirst({
      where: {
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
    if (!cluster) {
      return new Response("Cluster not found", { status: 404 });
    }
    if (!checkApiKey(req, cluster.publicKey)) {
      return new Response("Unauthorized", { status: 401 });
    }
    return new Response(JSON.stringify(cluster), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
  

});



export const DELETE = auth(async (req) => {

  const { pathname } = req.nextUrl;

  const slug = pathname.split("/").pop(); // Get the last segment


  try {
    const cluster = await prisma.k8sCluster.findFirst({
      where: {
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
    if (!cluster) {
      return new Response("Cluster not found", { status: 404 });
    }
    if (!checkApiKey(req, cluster.publicKey)) {
      return new Response("Unauthorized", { status: 401 });
    }
    return new Response(JSON.stringify(cluster), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});
