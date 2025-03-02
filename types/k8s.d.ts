interface ClusterStatus {
  PENDING: "PENDING";
  CREATING: "CREATING";
  INITING: "INITING";
  RUNNING: "RUNNING";
  STOPPED: "STOPPED";
  DELETED: "DELETED";
}

type ClusterPlan = "FREE" | "BUSINESS" | "PRO";

export interface ClusterRelay {
  relay: Relay;
}

export interface Relay {
  ip: string;
}

export interface ClusterNode {
  id:         String
  name:       String
  port:       Int
  username:   String
  platform:   String
  ip:         String
  publicIp?:   String
  gateway?:    Node
}

export interface Cluster {
  id: string;
  name: string;
  status: keyof ClusterStatus | null;
  location: string;
  clientId: string | null;
  userId: string;
  plan: string | null;
  role: string | null;
  apiKey: string | null;
  network: string | null;
  createdAt: Date;
  updatedAt: Date;
  delete: boolean | null;
  host: string | null;
  ip: string | null;
  dns: string | null;
  publicKey: string | null;
  relays: ClusterRelay[];
}

export interface Service {
  name:       string
  namespace:  string
  ports: ServicePort[]
}

export interface ServicePort {
  name: string?,
  protocol: string,
  port: int,
  nodePort: int
  relayPort: int
}

export type ClustersArray = Cluster[] | undefined;
