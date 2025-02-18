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



    const { id, ip, region, name, vlan, type, gateway, port, publicIp } =
    await req.json();


  //const cert = issueCertificate(team, name)
  let gatewayId: string = "";
  if (gateway) {
    const gatewayEntity = await getMachine(username, gateway);
    if (gatewayEntity) {
      gatewayId = gatewayEntity.id;
        await registerMachine(
          id,
          ip,
          name,
          gatewayEntity.vlan,
          type,
          gatewayId,
          port,
          publicIp,
          user.id,
          username,
          []
        );
      } else {
        return NextResponse.json({
          error: "invalid team",
        });
      }

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
    const foundServers = await getServers(cluster);
    const url = foundServers.map((srv) => srv.url).join(",");
    const rawToken = id + ":" + ip;
    if (team != null && team.id != null) {
      await registerMachine(
        id,
        ip,
        region,
        name,
        vlan,
        type,
        null,
        port,
        publicIp,
        user.id,
        team.id,
        foundServers
      );
    } else {
      return NextResponse.json({
        error: "invalid team",
      });
    }

    return NextResponse.json({
      relay: url,
      token: await encrypt(rawToken, "mysecretkey"),
      swarmKey,
      vlan,
    });
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
});

async function getMachine(username: string, gateway: any) {
  return prisma.machine.findFirst({
    where: {
      id: gateway,
      clusterId: username
    }
  })
}
