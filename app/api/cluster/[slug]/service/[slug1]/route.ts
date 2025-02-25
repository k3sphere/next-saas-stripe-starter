import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { Service } from "@/types/k8s";
import { NextAuthRequest } from "next-auth/lib";



export const DELETE = auth(async (req) => {
  console.log(req);
  const { pathname } = req.nextUrl;

  const segments = pathname.split("/")
  const slug1 = segments[segments.length-1];
  const slug = segments[segments.length-3]; // Get the last segment


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
    const parts = slug1.split(":");
    const namespace = parts[0];
    const service = parts[1];
    prisma.service.deleteMany({ where: {
      clusterId: cluster.id,
      namespace: namespace,
      name: service,
    }})
    return new Response(JSON.stringify(cluster), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});
function checkApiKey(req: NextAuthRequest, publicKey: string | null) {
  return true
}

