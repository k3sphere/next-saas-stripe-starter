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
         
          {node.name}
        
        </TableCell>
        <TableCell className="text-left">{node.namespace}</TableCell>
        <TableCell className="text-left">
          {node.ports.map((item)=>{
            return <p>{item.name} {item.protocol} {item.nodePort}:{item.port}</p>
          })}
        </TableCell>
        <TableCell className="text-left"></TableCell>
        <TableCell className="text-left"></TableCell>

      </TableRow>
    </TableBody>
  );
}
