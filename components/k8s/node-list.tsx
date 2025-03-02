

"use client"

import { Cluster, ClusterNode } from "@/types/k8s";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {  NodeItem } from "./node-item";


export function NodeList() {
  const [nodes, setNodes] = useState<ClusterNode[]>([])
  const clusterId = localStorage.getItem("cluster");
  useEffect(()=> {

    if(clusterId) {

      fetch(`/api/cluster/${clusterId}/node`, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          // delay to allow for the route change to complete
          const result = await res.json() as ClusterNode[]

          setNodes(result);
        }
    });
        
    }
  },[])
  return (
        <div className="divide-y divide-border rounded-md border">
              <div className="flex items-center justify-between p-4">
                <Table className="divide-y divide-gray-200">
                  <TableCaption>A list of your vm node .</TableCaption>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50">
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>UpdatedAt</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  {nodes.map((node) => (
                    <NodeItem
                      key={String(node.id)}
                      node={node}
                      cluster={clusterId}
                    ></NodeItem>
                  ))}
                </Table>
              </div>
            </div>
  );
}


