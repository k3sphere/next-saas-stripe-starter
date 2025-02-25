import Link from "next/link";

import type { Cluster, ClusterNode, Service } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface NodeItemProps {
  node: Pick<Service, "name"  | "namespace" | "ports">;
}

export function ServiceItem({ node }: NodeItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(node.name)}>
        <TableCell className="text-left">
        {node.name}
        </TableCell>
        <TableCell className="font-medium">
          <Link
            target="_blank"
            href={`https://ssh.k3sphere.com/${String(node.name)}/${String(node.name)}/${String(node.name)}/${String(node.name)}`}
            className="font-semibold hover:underline"
          >
            {node.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{node.name}</TableCell>
        <TableCell className="text-left">
        </TableCell>
        <TableCell className="text-left">{node.name}</TableCell>
        <TableCell className="text-left">RUNNING</TableCell>

      </TableRow>
    </TableBody>
  );
}
