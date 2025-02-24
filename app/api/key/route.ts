import { NextRequest, NextResponse } from 'next/server';

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
    const clusters = await prisma.key.findMany({
      where: {
        userId: currentUser.id,
      },
    });
    const response = new Response(JSON.stringify(clusters), { status: 200 });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://ssh.k3sphere.com"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
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
  const { sshKey, hostName,name,type,x,y,ID} =
  await req.json();

  console.log(sshKey, hostName,name,type,x,y,ID)
  
  
  try {
    await prisma.key.create({data: { name, sshKey, x, y, keyId: ID, keyType: type,  userId}});
    const clusters = await prisma.key.findMany({
      where: {
        userId: currentUser.id,
      },
    });
    const response = new Response(JSON.stringify(clusters), { status: 200 });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://ssh.k3sphere.com"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error) {
    console.log(error)
    return new Response("Internal server error", { status: 500 });
  }

});


// Handle OPTIONS preflight requests
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://ssh.k3sphere.com"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
