import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, status } = await request.json()
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const device = await prisma.device.update({
      where: { id: params.id, userId: user.id },
      data: { name, status },
    })

    return NextResponse.json(device)
  } catch (error) {
    console.error("Error updating device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.device.delete({
      where: { id: params.id, userId: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

