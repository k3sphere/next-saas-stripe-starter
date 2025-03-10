import { NextRequest, NextResponse } from "next/server";


import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { getNextIpFromCidr, getStartIpFromCidr } from "@/lib/ipUtils";


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
      if (maxIpMachine) {
          const maxIp = maxIpMachine.ip;
          ip = getNextIpFromCidr(cidr, maxIp);
      } else {
          // If no machines found, start with the first IP in the CIDR range
          ip = getStartIpFromCidr(cidr);
      }
  
      const foundServers = joiningKey.cluster.relays;
      const url = foundServers.map((srv) => srv.relay.url).join(",");
  
      await prisma.machine.upsert({where: {
          id: id,
        },create: {
          id,ip,name,port,clusterId, username: username?username:"",platform
         },update: {
          ip,name,port,clusterId, username: username?username:"",platform
        }})
  
      return new NextResponse(JSON.stringify({
          ip,
          subnet:cidr,
          relay: url,
          vlan: joiningKey.cluster.apiKey,
          tags: joiningKey.tags,
      }), { status: 200 });
    }else {
      return new NextResponse('Unauthorized', { status: 401 });
    }
});
