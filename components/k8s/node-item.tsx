import Link from "next/link";

import type { Cluster, ClusterNode } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface NodeItemProps {
  node: Pick<ClusterNode, "id" | "name" | "ip" >;
}

export function NodeItem({ node }: NodeItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(node.id)}>
        <TableCell className="font-medium">
          <Link
            target="_blank"
            href={`https://ssh.k3sphere.com/${String(node.id)}`}
            className="font-semibold hover:underline"
          >
            {node.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{node.ip}</TableCell>
        <TableCell className="text-left">
         
        </TableCell>
        <TableCell className="text-left">{node.name}</TableCell>
        <TableCell className="text-left">RUNNING</TableCell>
        <TableCell className="text-right">
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
