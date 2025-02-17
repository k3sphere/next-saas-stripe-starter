"use client"

import { Cluster } from "@/types/k8s";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";

export function ClusterInfo() {
  const [cluster, setCluster] = useState<Cluster|null>(null)
  useEffect(()=> {
    const clusterId = localStorage.getItem("cluster");
    if(clusterId) {

      fetch(`/api/cluster/${clusterId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          // delay to allow for the route change to complete
          const result = await res.json() as Cluster
          setCluster(result);
        }
    });
        
    }
  },[])
  return (
    <Table>
    <TableBody className="divide-y divide-gray-100">
      <TableRow>
      <TableCell className="text-left">Name</TableCell>
        <TableCell className="font-medium">
          <Link
            href={`/editor/cluster/${String(cluster?.id)}`}
            className="font-semibold hover:underline"
          >
            {cluster?.name}
          </Link>
        </TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">Location</TableCell>
        <TableCell className="text-left">{cluster?.location}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">ID</TableCell>
        <TableCell className="text-left">{cluster?.id}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">API Key</TableCell>
        <TableCell className="text-left">{cluster?.apiKey}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-right">
        </TableCell>
      </TableRow>
    </TableBody>
    </Table>
  );
}
