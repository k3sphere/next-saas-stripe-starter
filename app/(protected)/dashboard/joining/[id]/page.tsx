import { notFound, redirect } from "next/navigation";
import type { User } from "next-auth";

import { prisma } from "@/lib/db";

import { ClusterConfig } from "@/components/k8s/cluster-config";
import type { Cluster } from "@/types/k8s";
import { getCurrentUser } from "@/lib/session";
import { MemberConfig } from "@/components/k8s/member-config";
import { UserRole } from "@prisma/client";
import { JoiningConfig } from "@/components/k8s/joining-config";

async function getMemberForCluster(id: string,  userId: User["id"]) {
  const result = await prisma.joiningKey.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      purpose: true,
      max: true,
      expireDate: true,
      counter: true,
      clusterId: true,
    }
  });
  if (!result) {
    return null;
  }
  // make sure the user has access to the cluster
  const cluster = await prisma.member.findFirst({
    where: {
      clusterId: result.clusterId,
      userId: userId,
    },
    select: {
      id: true,
      role: true,
    }
  });
  if (!cluster) {
    return null;
  }
  return result;

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
  const cluster = params.id === "new" ? {id: "", name: "", purpose: "", max:0, counter:0} : await getMemberForCluster( params.id, user.id);

  if (!cluster) {
    notFound();
  }
  return (
    <JoiningConfig
      config={cluster}
      params={{ lang: params.lang }}
    />
  );
}
