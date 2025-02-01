import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await currentUser()

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: "User email not found" }, { status: 404 })
    }

    const primaryEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)

    if (!primaryEmail) {
      return NextResponse.json({ error: "Primary email not found" }, { status: 404 })
    }

    const apiKey = crypto.randomBytes(16).toString("hex")
    const apiSecret = crypto.randomBytes(32).toString("hex")

    const updatedUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        apiKey,
        apiSecret,
        email: primaryEmail.emailAddress,
      },
      create: {
        clerkId: userId,
        email: primaryEmail.emailAddress,
        apiKey,
        apiSecret,
      },
    })

    return NextResponse.json({
      apiKey: updatedUser.apiKey,
      apiSecret: updatedUser.apiSecret,
      email: updatedUser.email,
    })
  } catch (error) {
    console.error("Error generating credentials:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

