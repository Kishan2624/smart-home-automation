import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { devices: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.devices)
  } catch (error) {
    console.error("Error fetching devices:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name } = await request.json()
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const device = await prisma.device.create({
      data: {
        name,
        userId: user.id,
      },
    })

    return NextResponse.json(device)
  } catch (error) {
    console.error("Error creating device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

