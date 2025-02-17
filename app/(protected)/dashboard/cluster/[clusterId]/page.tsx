import { notFound, redirect } from "next/navigation";
import type { User } from "next-auth";

import { prisma } from "@/lib/db";

import { ClusterConfig } from "@/components/k8s/cluster-config";
import type { Cluster } from "@/types/k8s";
import { getCurrentUser } from "@/lib/session";

async function getClusterForUser(clusterId: Cluster["id"], userId: User["id"]) {
  return await prisma.k8sCluster.findFirst({});
}

interface EditorClusterProps {
  params: {
    clusterId: string;
    lang: string;
  };
}

export default async function EditorClusterPage({
  params,
}: EditorClusterProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // console.log("EditorClusterPage user:" + user.id + "params:", params);
  const cluster = params.clusterId === "new" ? {id: "", name: "", location: ""} : await getClusterForUser(params.clusterId, user.id);

  if (!cluster) {
    notFound();
  }
  return (
    <ClusterConfig
      cluster={{
        id: cluster.id,
        name: cluster.name,
        location: cluster.location,
      }}
      params={{ lang: params.lang }}
    />
  );
}
