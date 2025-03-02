

"use client"

import { Cluster, ClusterNode, Service } from "@/types/k8s";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {  NodeItem } from "./node-item";
import { ServiceItem } from "./service-item";


export function ServiceList() {
  const [services, setServices] = useState<Service[]>([])

  const clusterId = localStorage.getItem("cluster");
  useEffect(()=> {
    if(clusterId) {

      fetch(`/api/cluster/${clusterId}/service`, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          // delay to allow for the route change to complete
          const result = await res.json() as Service[]

          setServices(result);
        }
    });
        
    }
  },[])
  return (
        <div className="divide-y divide-border rounded-md border">
              <div className="flex items-center justify-between p-4">
                <Table className="divide-y divide-gray-200">
                  <TableCaption>A list of your k8s services .</TableCaption>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50">
                      <TableHead>ID</TableHead>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Namespace</TableHead>
                      <TableHead>Ports</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  {services.map((node) => (
                    <ServiceItem
                      key={String(node.name)}
                      node={node}
                      cluster={clusterId}
                    ></ServiceItem>
                  ))}
                </Table>
              </div>
            </div>
  );
}


