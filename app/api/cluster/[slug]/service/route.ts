import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { Service } from "@/types/k8s";

const checkApiKey = (req: Request, token: string|null) => {
  const apiKey = req.headers.get("Authorization");
  console.log(apiKey, token);
  return true;
};

export const GET = auth(async (req) => {


  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }

  const { pathname } = req.nextUrl;
  const segments = pathname.split("/")
  const slug = segments[segments.length-2]; // Get the last segment


  try {
    const cluster = await prisma.k8sCluster.findFirst({
      where: {
        userId: currentUser.id,
        delete: false
      },
      select: {
        id: true,
        name: true,
        location: true,
        publicKey: true,
        services: {
          select: {
            id: true,
            name: true,
            namespace: true,
            ports: true,
          }
        }
      },
    });
    if(!cluster) {
      return new Response("cluster not found", { status: 404 });
    }
    const services = cluster.services;
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});


export const POST = auth(async (req) => {

  const body: Service = await req.json();
  console.log(body);
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
    // create services   clusterId         String   @map(name: "cluster_id")
    const ip = cluster.relays.map((relay)=>relay.relay.ip);
    const service = await prisma.service.create({data: {clusterId: cluster.id, name: body.name, namespace: body.namespace, ip}})
    body.ports.forEach(async (item)=> {
      const port = await getNextAvailablePort(cluster.location);
      await prisma.servicePort.create({data: {serviceId: service.id, name: item.name, port: item.port, region: cluster.location, protocol: item.protocol, nodePort: item.nodePort, relayPort: port}})
    })
    return new Response(JSON.stringify({ip}), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
  

});


async function getNextAvailablePort(location: string) {
  const maxPort = await prisma.servicePort.findFirst({
    where: { region: location },
    orderBy: { relayPort: 'desc' },
    select: { relayPort: true }
  });

  return maxPort ? maxPort.relayPort + 1 : 10001; 
}

