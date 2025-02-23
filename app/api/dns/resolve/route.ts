import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Cron job running...");
  const clusters = await prisma.k8sCluster.findMany({});
  console.log("number of clusters: " + clusters.length)
  return NextResponse.json({ ok: true });
}