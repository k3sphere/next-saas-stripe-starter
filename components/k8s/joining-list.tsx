

"use client"

import { Cluster, ClusterMember, ClusterNode } from "@/types/k8s";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {  NodeItem } from "./node-item";
import { MemberItem } from "./member-item";
import { JoiningKey } from "@prisma/client";
import { JoiningItem } from "./joining-item";


export function JoiningList() {
  const [members, setMembers] = useState<JoiningKey[]>([])
  const clusterId = localStorage.getItem("cluster");
  useEffect(()=> {

    if(clusterId) {

      fetch(`/api/cluster/${clusterId}/joining`, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          // delay to allow for the route change to complete
          const result = await res.json() as JoiningKey[]

          setMembers(result);
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
                  {members.map((member) => (
                    <JoiningItem
                      key={String(member.id)}
                      item={member}
                      cluster={clusterId}
                    ></JoiningItem>
                  ))}
                </Table>
              </div>
            </div>
  );
}


