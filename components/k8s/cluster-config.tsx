"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";


import type { Cluster } from "@/types/k8s";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Icons } from "../shared/icons";

interface ClusterProps {
  cluster: Pick<Cluster, "id" | "name" | "location">;
  params: {
    lang: string;
  };
}

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(32, { message: "name must be at most 32 characters." }),
  location: z.enum(["China", "Hong Kong", "Singapore", "Tokyo", "US-West"]),
});
const isValidLocation = (
  location: string,
): location is "China" | "Hong Kong" | "Singapore" | "Tokyo" | "US-West" => {
  return ["China", "Hong Kong", "Singapore", "Tokyo", "US-West"].includes(
    location,
  );
};

export function ClusterConfig({ cluster, params: { lang } }: ClusterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: cluster.name, // default value
      location: isValidLocation(cluster.location)
        ? cluster.location
        : undefined,
    },
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const [_isSaving, setIsSaving] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSaving(true);
    const response = {success: true}
    setIsSaving(false);
    if (!response?.success) {
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
            <CardTitle>Create cluster</CardTitle>
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
                  name="location"
                  render={() => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <Select
                              onValueChange={(val: string) =>
                                field.onChange(val)
                              }
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Select Region</SelectLabel>
                                  <SelectItem value="China">China</SelectItem>
                                  <SelectItem value="Hong Kong">
                                    Hong Kong
                                  </SelectItem>
                                  <SelectItem value="Tokyo">Tokyo</SelectItem>
                                  <SelectItem value="Singapore">
                                    Singapore
                                  </SelectItem>
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
