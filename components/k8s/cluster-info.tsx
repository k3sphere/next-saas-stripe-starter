"use client"

import { Cluster } from "@/types/k8s";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";
import { Button } from "../ui/button";

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
          if(!result.relays) {
            result.relays = []
          }
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
            target="_blank"
            href={`https://app.k3sphere.com/c/${String(cluster?.name)}`}
            className="font-semibold hover:underline"
          >
            {cluster?.name}
          </Link>
          <Button
            className="font-semibold hover:underline"
            onClick={async () => {
              if(cluster) {
                await fetch(`/api/cluster/${cluster.id}`, {
                  method: "DELETE",
                });
                localStorage.removeItem("cluster");
                window.location.reload();
              }
            }
            }
          >
            Delete
          </Button>
        </TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">API Endpoint</TableCell>
        <TableCell className="text-left">{cluster?`https://${cluster.name}.k3sphere.io`:""}</TableCell>
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
        <TableCell className="text-left">Host</TableCell>
        <TableCell className="text-left">{cluster?.host}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">IP</TableCell>
        <TableCell className="text-left">{cluster?.ip}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">Public Key</TableCell>
        <TableCell className="w-64 break-all text-left">{cluster?.publicKey}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">DNS Key</TableCell>
        <TableCell className="w-64 break-all text-left">{cluster?.dns}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-left">DNS Servers</TableCell>
        <TableCell className="text-left">
          {
              cluster?.relays.map((item)=>{
                return <p>{item.relay.ip} </p>
              })
          }
        </TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="text-right">
          connect to cluster using the commandline below
          
        </TableCell>
      </TableRow>
    </TableBody>
    </Table>
  );
}
