import { prisma } from "@/lib/db";
import { useEffect, useState } from "react";


const useCluster = () => {
  const [clusters, setClusters] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    // Retrieve from localStorage
    console.log("fetch clusters")
     fetch(`/api/clusters`, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (res) => {
          if (res.status === 200) {
            // delay to allow for the route change to complete
            const result = await res.json()
            setClusters(result);
          }
      });
  });

  const setValue = (value: any) => {
    // Save state
    setSelected(value);
  };
  return {clusters, selected, setValue};
};

export default useCluster;
