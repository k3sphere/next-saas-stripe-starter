import { notFound, redirect } from "next/navigation";
import type { User } from "next-auth";

import { prisma } from "@/lib/db";

import type { Cluster } from "@/types/k8s";
import {ServiceList} from "@/components/k8s/service-list"; // Adjust the import path as necessary
import { getCurrentUser } from "@/lib/session";

interface ClusterNodesProps {
  params: {
    clusterId: string;
    lang: string;
  };
}

export default async function ClusterNodesPage({
  params,
}: ClusterNodesProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <ServiceList />
  );
}
