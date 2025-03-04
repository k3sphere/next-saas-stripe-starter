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
    const nodes = await prisma.member.findMany({
      where: {
        clusterId: slug,
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        cluster: {
          select: {
            name: true,
          }
        }
      }
    });
    return new Response(JSON.stringify(nodes), { status: 200 });
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
  const { email, name,role } =
  await req.json();
  console.log(email, name,role)
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/")
  const clusterId = segments[segments.length-2]; // Get the last segment

  try {

    const member = await prisma.member.findFirst({
      where: {
        userId: currentUser.id,
        clusterId: clusterId,
        delete: false
      },
      select: {
        role: true,
        cluster: {
          select: {
            id: true,
            name: true,
            location: true,
            publicKey: true,
          }
        },
      },
    });
    if (member == null || member.role !== "OWNER") {
      return new Response("No access", { status: 401 });
    }
    const clusters = await prisma.member.create({ data: { email,name,role,clusterId}});
    return new Response(JSON.stringify(clusters), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});