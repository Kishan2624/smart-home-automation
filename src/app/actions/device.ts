"use server"

import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createDevice(name: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (!user) {
      throw new Error("User not found")
    }

    const device = await prisma.device.create({
      data: {
        name,
        userId: user.id,
      },
    })

    return device
  } catch (error) {
    console.error("Error creating device:", error)
    throw new Error("Failed to create device")
  }
}

export async function getDevices() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { devices: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user.devices
  } catch (error) {
    console.error("Error fetching devices:", error)
    throw new Error("Failed to fetch devices")
  }
}

export async function updateDevice(id: string, data: { name?: string; status?: boolean }) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (!user) {
      throw new Error("User not found")
    }

    const device = await prisma.device.update({
      where: { id, userId: user.id },
      data,
    })

    return device
  } catch (error) {
    console.error("Error updating device:", error)
    throw new Error("Failed to update device")
  }
}

export async function deleteDevice(id: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (!user) {
      throw new Error("User not found")
    }

    await prisma.device.delete({
      where: { id, userId: user.id },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting device:", error)
    throw new Error("Failed to delete device")
  }
}

