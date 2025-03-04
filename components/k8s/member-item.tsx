import Link from "next/link";

import type { Cluster, ClusterMember, ClusterNode } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface MemberItemProps {
  cluster: string | null
  member: Pick<ClusterMember, "id" | "name" | "email" | "role" >;
}

export function MemberItem({ cluster, member }: MemberItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(member.id)}>

        <TableCell className="font-medium">
          <Link
            target="_blank"
            href={`/dashboard/members/${String(member.id)}`}
            className="font-semibold hover:underline"
          >
            {member.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{member.name}</TableCell>
        <TableCell className="text-left">
        {member.role}
        </TableCell>
        <TableCell className="text-left">
        </TableCell>
        <TableCell className="text-left">{member.name}</TableCell>
        <TableCell className="text-left">
 
        </TableCell>

      </TableRow>
    </TableBody>
  );
}
