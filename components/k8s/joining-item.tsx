import Link from "next/link";

import type { Cluster, ClusterMember, ClusterNode } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { JoiningKey } from "@prisma/client";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface JoiningItemProps {
  cluster: string | null
  item: Pick<JoiningKey, "id" | "name" | "purpose" | "max" | "counter" | "expireDate" >;
}

export function JoiningItem({ cluster, item }: JoiningItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(item.id)}>

        <TableCell className="font-medium">
          <Link
            target="_blank"
            href={`/dashboard/joining/${String(item.id)}`}
            className="font-semibold hover:underline"
          >
            {item.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{item.purpose}</TableCell>
        <TableCell className="text-left">
        {item.counter}
        </TableCell>
        <TableCell className="text-left">
        {item.counter}
        </TableCell>
        <TableCell className="text-left">{item.expireDate ? new Date(item.expireDate).toISOString() : ""}</TableCell>
        <TableCell className="text-left">
 
        </TableCell>

      </TableRow>
    </TableBody>
  );
}
