import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }

  const { pathname } = req.nextUrl;

  const slug = pathname.split("/").pop(); // Get the last segment


  try {
    const cluster = await prisma.k8sCluster.findFirst({
      where: {
        userId: currentUser.id,
        id: slug
      },
    });
    return new Response(JSON.stringify(cluster), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});


export const POST = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser || !currentUser.id) {
    return new Response("Invalid user", { status: 401 });
  }
  const userId = currentUser.id
  const { name, location } =
  await req.json();
  console.log(name, location)
  try {
    const clusters = await prisma.k8sCluster.create({ data: { userId, name, location, apiKey: "something"}});
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});