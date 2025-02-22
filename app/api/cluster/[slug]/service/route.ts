import { auth } from "@/auth";

import { prisma } from "@/lib/db";

const checkApiKey = (req: Request, token: string|null) => {
  const apiKey = req.headers.get("Authorization");
  console.log(apiKey, token);
  return true;
};

export const GET = auth(async (req) => {

  const { pathname } = req.nextUrl;
  const segments = pathname.split("/")
  const slug = segments[segments.length-2]; // Get the last segment


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


export const POST = auth(async (req) => {

  console.log(req);
  const { pathname } = req.nextUrl;

  const segments = pathname.split("/")
  const slug = segments[segments.length-2]; // Get the last segment


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
    return new Response(JSON.stringify({ip: "service.home.k3sphere.io"}), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
  

});



export const DELETE = auth(async (req) => {
  console.log(req);
  const { pathname } = req.nextUrl;

  const segments = pathname.split("/")
  const slug = segments[segments.length-2]; // Get the last segment


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
