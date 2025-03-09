"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { Cluster, ClusterMember, JoiningKey } from "@/types/k8s";
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
import exp from "constants";

interface MemberProps {
  config: Pick<JoiningKey, "id" | "name" | "purpose" | "max" | "counter" | "expireDate">;
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
  purpose: z.string(),
  max: z.number(),
  counter: z.number(),
  expireDate: z.date().nullable(),
});

export function JoiningConfig({ config, params: { lang } }: MemberProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: config.name ?? "", // default value
      purpose: config.purpose ?? "",
      max: config.max ?? 0,
      counter: config.counter ?? 0,
      expireDate: config.expireDate ? new Date(config.expireDate) : null,
    },
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const { selected } = useCluster();
  const [_isSaving, setIsSaving] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSaving(true);
    const response = await fetch(`/api/cluster/${selected?.id}/joining`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Input placeholder="Purpose of the joining key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="w-2/3 space-y-6">
            <div className="w/full grid items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="w-2/3 space-y-6">
            <div className="w/full grid items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="counter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Counter</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="w-2/3 space-y-6">
            <div className="w/full grid items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="expireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expire Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="yyyy/MM/dd"
                          className="input"
                        />
                      </FormControl>
                      <FormMessage />
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
