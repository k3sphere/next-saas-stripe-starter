import Link from "next/link";

import type { Cluster, ClusterMember, ClusterNode } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface NodeItemProps {
  cluster: string | null
  node: Pick<ClusterMember, "id" | "name" | "email" | "role" >;
}

export function NodeItem({ cluster, node }: NodeItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(node.id)}>

        <TableCell className="font-medium">
          <Link
            target="_blank"
            href={`https://ssh.k3sphere.com/${String(node.id)}/${String(node.name)}/${String(node.name)}/${String(node.name)}`}
            className="font-semibold hover:underline"
          >
            {node.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{node.name}</TableCell>
        <TableCell className="text-left">
        {node.role}
        </TableCell>
        <TableCell className="text-left">
        </TableCell>
        <TableCell className="text-left">{node.name}</TableCell>
        <TableCell className="text-left">
 
        </TableCell>

      </TableRow>
    </TableBody>
  );
}
