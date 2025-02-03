"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function syncUser() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const clerkUser = await currentUser()
    if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
      throw new Error("User email not found")
    }

    const primaryEmail = clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)

    if (!primaryEmail) {
      throw new Error("Primary email not found")
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: primaryEmail.emailAddress,
      },
      create: {
        clerkId: userId,
        email: primaryEmail.emailAddress,
      },
    })

    return user
  } catch (error) {
    console.error("Error syncing user:", error)
    throw new Error("Failed to sync user")
  }
}

export async function fetchUserCredentials() {
  await syncUser(); // Ensure user is synced before fetching credentials
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        email: true,
        apiKey: true,
        apiSecret: true,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    if (!user.apiKey || !user.apiSecret) {
      const apiKey = crypto.randomBytes(16).toString("hex")
      const apiSecret = crypto.randomBytes(32).toString("hex")

      const updatedUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          apiKey,
          apiSecret,
        },
        select: {
          email: true,
          apiKey: true,
          apiSecret: true,
        },
      })

      return updatedUser
    }

    return user
  } catch (error) {
    console.error("Error fetching user credentials:", error)
    throw new Error("Failed to fetch user credentials")
  }
}

