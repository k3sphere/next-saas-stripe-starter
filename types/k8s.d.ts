import { UserRole } from "@prisma/client";

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

export interface ClusterMember {
  id:         string | null
  name:       string | null
  role:       string | null
  email:      string | null
  cluster:  Cluster | null
}

export interface JoiningKey {
  id:         string | null
  name:       string | null
  purpose:    string | null
  max:      number | null
  counter:  number | null
  expireDate: Date | null
  key:    string | null
  tags:   string[] | null
  subnet: string | null
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
  keyType: string | null;
  createdAt: Date;
  color?: string | null;
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
  ip: string[]
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
