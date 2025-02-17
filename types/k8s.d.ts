interface ClusterStatus {
  PENDING: "PENDING";
  CREATING: "CREATING";
  INITING: "INITING";
  RUNNING: "RUNNING";
  STOPPED: "STOPPED";
  DELETED: "DELETED";
}

type ClusterPlan = "FREE" | "BUSINESS" | "PRO";

export interface Cluster {
  id: string;
  name: string;
  status: keyof ClusterStatus | null;
  location: string;
  userId: string;
  plan: string | null;
  apiKey: string | null;
  network: string | null;
  createdAt: Date;
  updatedAt: Date;
  delete: boolean | null;
}

export type ClustersArray = Cluster[] | undefined;
