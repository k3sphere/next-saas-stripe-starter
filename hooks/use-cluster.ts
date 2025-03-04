import { prisma } from "@/lib/db";
import { Cluster } from "@/types/k8s";
import { useEffect, useState } from "react";


const useCluster = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selected, setSelected] = useState<Cluster | null>(null);

  useEffect(() => {
    // Retrieve from localStorage
    console.log("fetch clusters")
     fetch(`/api/cluster`, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (res) => {
          if (res.status === 200) {
            // delay to allow for the route change to complete
            const result = await res.json() as Cluster[]
            setClusters(result);
            const selectedId = localStorage.getItem("cluster")
            if(selectedId) {
              const selectedCluster =  result.filter((item)=>item.id === selectedId);
              if(selectedCluster.length > 0) {
                setSelected(selectedCluster[0]);
              }else {
                if(result.length > 0) {
                  setValue(result[0])
                }
              }
            }else {
              if(result.length > 0) {
                setValue(result[0])
              }
            }
            
            
          }
      });
  }, []);

  const setValue = (value: any) => {
    // Save state
    setSelected(value);
    localStorage.setItem("cluster", value.id)
  };
  return {clusters, selected, setValue};
};

export default useCluster;
