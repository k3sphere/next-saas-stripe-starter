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
  const path = pathname.split("/")
  path.pop();
  const slug = path.pop(); // Get the last segment

  console.log("cluster:",slug);
  try {
    const nodes = await prisma.machine.findMany({
      where: {
        clusterId: slug,
      },

    });
    return new Response(JSON.stringify(nodes), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});

