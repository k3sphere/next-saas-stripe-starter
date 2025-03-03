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



    const { id, ip, name, vlan, gateway, port, publicIp, username, platform } =
    await req.json();


  //const cert = issueCertificate(team, name)
  let gatewayId: string = "";
  if (gateway) {
    const gatewayEntity = await getMachine(clusterId, gateway);
    if (gatewayEntity) {
      gatewayId = gatewayEntity.id;
        await registerMachine(
          id,
          ip,
          name,
          gatewayEntity.vlan,
          gatewayId,
          port,
          publicIp,
          clusterId,
          username,
          platform,
        );


      const relay = `/ip4/${gatewayEntity.publicIp}/tcp/11211/p2p/${gatewayEntity.id}`;
      console.log(relay);
      return NextResponse.json({
        relay,
        token: "",
        swarmKey: "",
        vlan: gatewayEntity.vlan,
      });
    } else {
      return NextResponse.json({
        error: "gateway not found",
      });
    }
  } else {
    const foundServers = user.relays;
    const url = foundServers.map((srv) => srv.relay.url).join(",");
    const rawToken = id + ":" + ip;
      await registerMachine(
        id,
        ip,
        name,
        vlan,
        null,
        port,
        publicIp,
        clusterId,
        username,
      );


    return NextResponse.json({
      relay: url,
      token: "",
      vlan,
    });
  }

 
  }

  return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
          "Content-Type": "application/json",
          "Docker-Distribution-API-Version": "registry/2.0",
          "WWW-Authenticate": 'Basic realm="Docker Registry"',
      },
  });
});

async function getMachine(username: string, gateway: any) {
  return prisma.machine.findFirst({
    where: {
      id: gateway,
      clusterId: username
    }
  })
}
async function registerMachine(id: string, ip: string, name: string, vlan: string, gatewayId: string | null, port: number, publicIp: string | null, clusterId: string, username: string | null, platform: string | null) {
   await prisma.machine.upsert({where: {
    id: id,
  },create: {
    id,ip,name,vlan,gatewayId,port,publicIp: publicIp===""?null:publicIp,clusterId, username: username?username:"",platform
   },update: {
    ip,name,vlan,gatewayId,port,publicIp: publicIp===""?null:publicIp,clusterId,username: username?username:"",platform
  }})
}

