"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { createDevice } from "@/app/actions/device"
import { useToast } from "@/hooks/use-toast"
import { useDevices } from "@/app/contexts/DeviceContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deviceName, setDeviceName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addDevice } = useDevices()

  const handleCreateDevice = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const newDevice = await createDevice(deviceName)
      addDevice(newDevice)
      setIsDialogOpen(false)
      setDeviceName("")
      toast({
        title: "Success",
        description: "Device created successfully",
      })
    } catch (error) {
      console.error("Error creating device:", error)
      toast({
        title: "Error",
        description: "Failed to create device",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          LOGO
        </Link>
        <div className="flex items-center space-x-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-black border-white hover:scale-105 ease-in-out">
                Create Device
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateDevice}>
                <DialogHeader>
                  <DialogTitle>Create Device</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new device here. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deviceName" className="text-left">
                      Device Name
                    </Label>
                    <Input
                      id="deviceName"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <SignInButton mode="modal">
            <UserButton />
          </SignInButton>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
