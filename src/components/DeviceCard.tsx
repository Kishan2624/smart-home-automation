"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DeviceCardProps {
  deviceName: string
  deviceId: string
  onEdit: (id: string, newName: string) => void
  onDelete: (id: string) => void
}

const DeviceCard: React.FC<DeviceCardProps> = ({ deviceName, deviceId, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editedDeviceName, setEditedDeviceName] = useState(deviceName)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onEdit(deviceId, editedDeviceName)
    setIsDialogOpen(false)
  }

  return (
    <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Device Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-2 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium text-gray-600 text-sm sm:text-base">Device Name:</span>
            <span className="font-bold text-base sm:text-lg">{deviceName}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium text-gray-600 text-sm sm:text-base">Device ID:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm sm:text-base">{deviceId}</span>
          </div>
          <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="p-2 sm:p-2.5">
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Edit Device</DialogTitle>
                    <DialogDescription>Update the device name here. Click save when you're done.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <Label htmlFor="editDeviceName" className="text-left sm:text-right">
                        Device Name
                      </Label>
                      <Input
                        id="editDeviceName"
                        value={editedDeviceName}
                        onChange={(e) => setEditedDeviceName(e.target.value)}
                        className="col-span-1 sm:col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" className="p-2 sm:p-2.5" onClick={() => onDelete(deviceId)}>
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DeviceCard

