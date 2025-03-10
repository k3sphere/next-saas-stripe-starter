import { notFound, redirect } from "next/navigation";
import type { User } from "next-auth";

import { prisma } from "@/lib/db";

import { ClusterConfig } from "@/components/k8s/cluster-config";
import type { Cluster } from "@/types/k8s";
import { getCurrentUser } from "@/lib/session";
import { MemberConfig } from "@/components/k8s/member-config";
import { UserRole } from "@prisma/client";

async function getMemberForCluster(userId: User["id"]) {
  return await prisma.member.findFirst({
    where: {
      id: userId,
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
  const cluster = params.id === "new" ? {id: "", name: "", email: "", role: UserRole.USER} : await getMemberForCluster( params.id);

  if (!cluster) {
    notFound();
  }
  return (
    <MemberConfig
      member={cluster}
      params={{ lang: params.lang }}
    />
  );
}
