"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DeviceCard from "@/components/DeviceCard";
import { UserCredentialsSidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { updateDevice, deleteDevice, getDevices } from "@/app/actions/device";
import { useDevices } from "@/app/contexts/DeviceContext";
import { DeviceProvider } from "@/app/contexts/DeviceContext";

interface Device {
  id: string;
  name: string;
  status: boolean;
}

export default function Home() {
  const { toast } = useToast();
  const { devices } = useDevices();
  const [loading, setLoading] = useState<string | null>(null);

  const handleEdit = async (id: string, newName: string) => {
    setLoading(id);
    try {
      await updateDevice(id, { name: newName });
      toast({
        title: "Success",
        description: "Device updated successfully",
      });
    } catch (error) {
      console.error("Error updating device:", error);
      toast({
        title: "Error",
        description: "Failed to update device",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      await deleteDevice(id);
      toast({
        title: "Success",
        description: "Device deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting device:", error);
      toast({
        title: "Error",
        description: "Failed to delete device",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    setLoading(id);
    try {
      await updateDevice(id, { status });
      toast({
        title: "Success",
        description: "Device status updated successfully",
      });
    } catch (error) {
      console.error("Error updating device status:", error);
      toast({
        title: "Error",
        description: "Failed to update device status",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Sort devices by name or any other criteria to maintain consistent order
  const sortedDevices = [...devices].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DeviceProvider>
      <>
        <Navbar />
        <div className="flex">
          <div className="min-h-[calc(100vh-128px)] flex-1 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4  content-start justify-items-center py-4 px-4">
            {sortedDevices.map((device) => (
              <DeviceCard
                key={device.id}
                deviceName={device.name}
                deviceId={device.id}
                initialStatus={device.status}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isLoading={loading === device.id}
              />
            ))}
          </div>
          <UserCredentialsSidebar />
        </div>
        <Footer />
      </>
    </DeviceProvider>
  );
}
