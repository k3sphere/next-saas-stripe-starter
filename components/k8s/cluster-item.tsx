import Link from "next/link";

import type { Cluster } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface ClusterItemProps {
  cluster: Pick<Cluster, "id" | "name" | "location" | "plan" | "updatedAt">;
}

export function ClusterItem({ cluster }: ClusterItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(cluster.id)}>
        <TableCell className="font-medium">
          <Link
            href={`/editor/cluster/${String(cluster.id)}`}
            className="font-semibold hover:underline"
          >
            {cluster.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{cluster.location}</TableCell>
        <TableCell className="text-left">
          {cluster.updatedAt?.toDateString()}
        </TableCell>
        <TableCell className="text-left">{cluster.plan}</TableCell>
        <TableCell className="text-left">RUNNING</TableCell>
        <TableCell className="text-right">
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
