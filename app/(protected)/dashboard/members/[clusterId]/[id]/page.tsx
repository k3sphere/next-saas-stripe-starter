import { notFound, redirect } from "next/navigation";
import type { User } from "next-auth";

import { prisma } from "@/lib/db";

import { ClusterConfig } from "@/components/k8s/cluster-config";
import type { Cluster } from "@/types/k8s";
import { getCurrentUser } from "@/lib/session";
import { MemberConfig } from "@/components/k8s/member-config";
import { UserRole } from "@prisma/client";

async function getMemberForCluster(clusterId: Cluster["id"], userId: User["id"]) {
  return await prisma.member.findFirst({
    where: {
      clusterId: clusterId,
      email: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });
}

interface EditorMemberProps {
  params: {
    id: string;
    clusterId: string;
    lang: string;
  };
}

export default async function EditorMemberPage({
  params,
}: EditorMemberProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // console.log("EditorClusterPage user:" + user.id + "params:", params);
  const cluster = params.clusterId === "new" ? {id: "", name: "", email: "", role: UserRole.USER} : await getMemberForCluster( params.clusterId,params.id);

  if (!cluster) {
    notFound();
  }
  return (
    <MemberConfig
      cluster= {params.clusterId}
      member={cluster}
      params={{ lang: params.lang }}
    />
  );
}
