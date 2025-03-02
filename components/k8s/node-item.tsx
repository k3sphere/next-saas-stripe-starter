import Link from "next/link";

import type { Cluster, ClusterNode } from "@/types/k8s";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";

// import { ClusterOperations } from "~/components/k8s/cluster-operation";
// import { formatDate } from "~/lib/utils";

interface NodeItemProps {
  cluster: string | null
  node: Pick<ClusterNode, "id" | "name" | "ip" | "port" | "username" | "platform">;
}

export function NodeItem({ cluster, node }: NodeItemProps) {
  return (
    <TableBody className="divide-y divide-gray-100">
      <TableRow key={String(node.id)}>

        <TableCell className="font-medium">
          <Link
            target="_blank"
            href={`https://ssh.k3sphere.com/${String(node.id)}/${String(node.ip)}/${String(node.port)}/${String(node.username)}`}
            className="font-semibold hover:underline"
          >
            {node.name}
          </Link>
        </TableCell>
        <TableCell className="text-left">{node.ip}</TableCell>
        <TableCell className="text-left">
        {node.platform}
        </TableCell>
        <TableCell className="text-left">
        </TableCell>
        <TableCell className="text-left">{node.name}</TableCell>
        <TableCell className="text-left">
          {node.platform === "windows" &&
          <Button onClick={()=>{
              fetch(`/api/cluster/${cluster}/service`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({name: "rdp", namespace: node.id, ports: [{
                  name: "rdp",
                  protocol: "tcp",
                  port: 3389,
                  nodePort: 3389
                }]}),
              }).then(async (res) => {
                console.log(await res.text())
              });
        }}>RDP</Button>
      }
                {node.platform !== "windows" &&
          <Button onClick={()=>{
              fetch(`/api/cluster/home/service`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({name: "ssh", namespace: node.id, ports: [{
                  name: "ssh",
                  protocol: "ssh",
                  port: 22,
                  nodePort: 22
                }]}),
              }).then(async (res) => {
                console.log(await res.text())
              });
        }}>SSH</Button>
      }
        </TableCell>

      </TableRow>
    </TableBody>
  );
}
