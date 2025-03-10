import { NextRequest, NextResponse } from "next/server";


import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { getLastIpFromCidr, getNextIpFromCidr, getStartIpFromCidr } from "@/lib/ipUtils";


export const POST = auth(async (req) => {
    let authHeader = req.headers.get('authorization');
    if (!authHeader) {
      authHeader = req.headers.get('Authorization');
    }
    console.log(authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const credential = authHeader.substring(7);
     
      // Query database using Prisma
      const joiningKey = await prisma.joiningKey.findFirst({
        where: { key: credential  },
        select: {
          cluster: {
              select: {
                  id: true,
                  name: true,
                  cidr: true,
                  apiKey: true,
                  passKey: true,
                  relays: {
                      select: {
                          id: true,
                          relay: true,
                      },
                  },
              }
          },
          tags: true,
          expireDate: true,
        }
      });
      if(!joiningKey) {
        return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
      }
      if(joiningKey.expireDate && new Date() > joiningKey.expireDate) {
        return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
      }
      const cidr = joiningKey.cluster.cidr;
      if(!cidr) {
          return NextResponse.json({ message: 'CIDR is required' }, { status: 400 });
        }
      const { id, name, port, username, platform } =
      await req.json();
  
      const clusterId = joiningKey.cluster.id;
      // generate ip from  cluster cidr
      const maxIpMachine = await prisma.machine.findFirst({
        where: {
          clusterId: clusterId,
        },
        orderBy: {
          ip: 'desc',
        },
      });
  
      let ip;
      const gateway = getStartIpFromCidr(cidr);
      const host = getLastIpFromCidr(cidr);
      if (maxIpMachine) {
          const maxIp = maxIpMachine.ip;
          ip = getNextIpFromCidr(cidr, maxIp);
      } else {
          // If no machines found, start with the first IP in the CIDR range
          ip = getNextIpFromCidr(cidr,gateway);
      }
  
      const foundServers = joiningKey.cluster.relays;
      const url = foundServers.map((srv) => srv.relay.url).join(",");
      const tags = joiningKey.tags;
      await prisma.machine.upsert({where: {
          id: id,
        },create: {
          id,ip,name,port,clusterId, username: username?username:"",platform,tags
         },update: {
          ip,name,port,clusterId, username: username?username:"",platform,tags
        }})
  
      return new NextResponse(JSON.stringify({
          ip,
          subnet:cidr,
          gateway: gateway,
          host: host,
          relay: url,
          vlan: joiningKey.cluster.apiKey,
          tags: joiningKey.tags,
          trust: joiningKey.cluster.passKey,
      }), { status: 200 });
    }else {
      return new NextResponse('Unauthorized', { status: 401 });
    }
});
