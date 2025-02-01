"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getDevices } from "@/app/actions/device"

interface Device {
  id: string
  name: string
  status: boolean
}

interface DeviceContextType {
  devices: Device[]
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>
  addDevice: (device: Device) => void
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const fetchedDevices = await getDevices()
        setDevices(fetchedDevices)
      } catch (error) {
        console.error("Error fetching devices:", error)
      }
    }

    fetchDevices()
  }, [devices])

  const addDevice = (device: Device) => {
    setDevices((prevDevices) => [...prevDevices, device])
  }

  return (
    <DeviceContext.Provider value={{ devices, setDevices, addDevice }}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevices() {
  const context = useContext(DeviceContext)
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider")
  }
  return context
}
