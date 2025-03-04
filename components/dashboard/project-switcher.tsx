"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import useCluster from "@/hooks/use-cluster";
import { Cluster } from "@/types/k8s";

type ProjectType = {
  id: string
  name: string
  color: string;
};

export default function ProjectSwitcher({
  large = false,
}: {
  large?: boolean;
}) {
  const { data: session, status } = useSession();
  const {clusters, selected, setValue} = useCluster();
  const [openPopover, setOpenPopover] = useState(false);
  if (!clusters || status === "loading") {
    return <ProjectSwitcherPlaceholder />;
  }

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <Button
            className="h-8 px-2"
            variant={openPopover ? "secondary" : "ghost"}
            onClick={() => setOpenPopover(!openPopover)}
          >
            <div className="flex items-center space-x-3 pr-2">
              <div
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  selected?.color,
                )}
              />
              <div className="flex items-center space-x-3">
                <span
                  className={cn(
                    "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                    large ? "w-full" : "max-w-[80px]",
                  )}
                >
                  {selected?selected.name:"No Cluster"}
                </span>
              </div>
            </div>
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <ProjectList
            selected={selected}
            projects={clusters}
            onSelect={setValue}
            setOpenPopover={setOpenPopover}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ProjectList({
  selected,
  projects,
  setOpenPopover,
  onSelect,
}: {
  selected: Cluster | null;
  projects: Cluster[];
  setOpenPopover: (open: boolean) => void;
  onSelect: (value: any) => void;
}) {

  const router = useRouter();
  return (
    <div className="flex flex-col gap-1">
      {projects.map((project) => (
        <Link
          key={project.id}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          href="#"
          onClick={() => {
            onSelect(project);
            setOpenPopover(false);
            window.location.reload();
          }
          }
        >
          <div className={cn("size-3 shrink-0 rounded-full")} />
          <span
            className={`flex-1 truncate text-sm ${
              selected?.id === project.id
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {project.name}
          </span>
          {selected?.id === project.id && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </Link>
      ))}
      <Button
        variant="outline"
        className="relative flex h-9 items-center justify-center gap-2 p-2"
        onClick={() => {
          setOpenPopover(false);router.push("/dashboard/cluster/new");
        }}
      >
        <Plus size={18} className="absolute left-2.5 top-2" />
        <span className="flex-1 truncate text-center">New Cluster</span>
      </Button>
     
    </div>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}
