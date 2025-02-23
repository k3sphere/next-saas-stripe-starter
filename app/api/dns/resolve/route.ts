import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log("Cron job running...");
  let domain = req.searchParams.get('domain');
  let port = 0;
  if(domain && domain.indexOf(":") !== -1) {
    console.log("domain has port, skipping...");
    const parts = domain.split(":");
    domain = parts[0];
    port = parts[1];
  }
  if(!domain) {
    console.log("no domain provided, skipping...");
    return NextResponse.json({ records: [] });
  }
  if (port > 0) {
    // get record for ip and port
    console.log("domain: " + domain + " port: " + port);
    const server = await prisma.relayServer.findFirst({
      where: {
        ip: domain,
      }
    });
    if(!server) {
      console.log("no record found, skipping...");
      return NextResponse.json({ records: [] });
    }
    const rp = await prisma.regionPort.findFirst({
      where: {
        location: server.location,
        port: port,
        active: true
      },
      select: {
        id: true,
        port: true,
        servicePort: true,
        region: true,
        cluster: true
      }
    });
    if(!rp || !rp.cluster) {
      console.log("no record found, skipping...");
      return NextResponse.json({ records: [] });
    }
    const host = rp.cluster!.host
    const ip = rp.cluster!.ip;

    const dns = await encrypt(`${host}:${ip}:${rp.servicePort}`, process.env.ENCRYPTION_KEY!);
    console.log("dns: " + dns);
    return NextResponse.json({ records: [dns] });
  }else {
    // get records for k3sphere.io domains, the domain looks like xxx.cluster-name.k3sphere.io
    const service = domain.split(".")[0];
    const clusterName = domain.split(".")[1];
    console.log("clusterName: " + clusterName);
    const cluster = await prisma.k8sCluster.findFirst({
      where: {
        name: clusterName
      }
    });
    console.log("cluster: " + cluster);
    if(!cluster) {
      console.log("cluster not found, skipping...");
      return NextResponse.json({ records: [] });
    }
    const records = await prisma.clusterRelay.findMany({
      where: {
        clusterId: cluster.id
      },
      select: {
        id: true,
        relay: true
      }
    });
    if(records.length == 0) {
      console.log("no records found, skipping...");
      return NextResponse.json({ records: [] });
    }
    console.log("number of records: " + records.length)
    const host = cluster.host
    const ip = records[0].relay.ip;
    let ports = "80:443";
    if(service == "api") {
      ports = "6443";
    }
    const dns = await encrypt(`${host}:${ip}:${ports}`, process.env.ENCRYPTION_KEY!);
    console.log("dns: " + dns);
    return NextResponse.json({ records: [dns] });
  }

  return NextResponse.json({ records: [] });
}