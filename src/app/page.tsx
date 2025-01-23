"use client"

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DeviceCard from "@/components/DeviceCard";
import { UserCredentialsSidebar } from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [devices, setDevices] = useState([
    { id: "xyz", name: "LED" },
    { id: "abc", name: "Sensor" },
    { id: "abc", name: "Sensor" },
    { id: "abc", name: "Sensor" },
  ])

  const handleEdit = (id: string, newName: string) => {
    setDevices(devices.map((device) => (device.id === id ? { ...device, name: newName } : device)))
  }

  const handleDelete = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))
  }
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="min-h-[calc(100vh-128px)] flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  content-start justify-items-center py-4 px-4">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            deviceName={device.name}
            deviceId={device.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
        <UserCredentialsSidebar />
      </div>
      <Footer />
    </>
  );
}
