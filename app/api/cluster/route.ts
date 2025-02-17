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

  try {
    const clusters = await prisma.k8sCluster.findMany({
      where: {
        userId: currentUser.id,
      },
    });
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});
