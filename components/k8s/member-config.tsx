"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";


import type { Cluster, ClusterMember } from "@/types/k8s";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Icons } from "../shared/icons";
import useCluster from "@/hooks/use-cluster";

interface MemberProps {
  member: Pick<ClusterMember, "id" | "name" | "email" | "role">;
  params: {
    lang: string;
  };
}

const FormSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "name must be at least 2 characters.",
    })
    .max(32, { message: "name must be at most 32 characters." }),
  email: z.string().email(),
  role: z.string().nullable(),
});


export function MemberConfig({ member, params: { lang } }: MemberProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: member.name??"", // default value
      email: member.email??"",
      role: member.role,
    },
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const {selected} = useCluster()
  const [_isSaving, setIsSaving] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSaving(true);
    const response = await fetch(`/api/cluster/${selected?.id}/member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    setIsSaving(false);
    if (response.status != 200) {
      return toast({
        title: "Something went wrong.",
        description: "Your cluster config was not saved. Please try again.",
        variant: "destructive",
      });
    }

    router.push(`/dashboard`);
    router.refresh();

    return toast({
      description: "Your cluster config has been saved.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Create Member</CardTitle>
            <CardDescription>
              Deploy your new k8s cluster in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-2/3 space-y-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of your cluster" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="w-2/3 space-y-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email of the member" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="w-2/3 space-y-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="role"
                  render={() => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <Select
                              onValueChange={(val: string) =>
                                field.onChange(val)
                              }
                              value={field.value ?? undefined}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Role</SelectLabel>
                                  <SelectItem value="OWNER">OWNER</SelectItem>
                                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                                  <SelectItem value="USER">USER</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          
          <div className="w-2/3 space-y-6 p-6 pt-0">
            <Button type="submit" disabled={_isSaving}>
             
              Submit
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
