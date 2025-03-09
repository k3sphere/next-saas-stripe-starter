import { notFound, redirect } from "next/navigation";
import type { User } from "next-auth";

import { prisma } from "@/lib/db";

import type { Cluster } from "@/types/k8s";
import {MemberList} from "@/components/k8s/member-list"; // Adjust the import path as necessary
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { JoiningList } from "@/components/k8s/joining-list";

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
    <div>
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-base font-semibold text-gray-900">Members</h3>
      <div className="mt-3 flex sm:ml-4 sm:mt-0">
        <Link
          href={"/dashboard/joining/new"}
          type="button"
          className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create
        </Link>
      </div>
    </div>
    <JoiningList />
    </div>
  );
}
