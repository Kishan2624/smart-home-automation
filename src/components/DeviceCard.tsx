"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, RefreshCw, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DeviceCardProps {
  deviceName: string;
  deviceId: string;
  initialStatus?: boolean;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: boolean) => void;
  isLoading: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  deviceName,
  deviceId,
  initialStatus = false,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedDeviceName, setEditedDeviceName] = useState(deviceName);
  const [isOn, setIsOn] = useState(initialStatus);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsEditLoading(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteLoading(true);
    onDelete(deviceId);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onEdit(deviceId, editedDeviceName);
    setIsDialogOpen(false);
    setIsEditLoading(false);
  };

  const handleStatusChange = (checked: boolean) => {
    setIsOn(checked);
    onStatusChange(deviceId, checked);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(deviceId);
    toast({
      title: "Copied",
      description: "Device ID copied to clipboard",
    });
  };

  return (
    <Card className="w-[360px] sm:w-[440px] md:w-[480px] lg:w-[520px] mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Device Name
          </span>
          <span className="font-medium">{deviceName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Device ID
          </span>
          <div className="flex items-center gap-2">
            <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-sm font-semibold">
              {deviceId}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopyClick}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Status
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isOn ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {isOn ? "Online" : "Offline"}
            </span>
            <Switch
              checked={isOn}
              onCheckedChange={handleStatusChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleEditClick}
                disabled={isLoading || isEditLoading || isDeleteLoading}
              >
                {isEditLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Device</DialogTitle>
                  <DialogDescription>
                    Update the device name here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editedDeviceName}
                      onChange={(e) => setEditedDeviceName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || isEditLoading}>
                    {isEditLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDeleteClick}
            disabled={isLoading || isEditLoading || isDeleteLoading}
          >
            {isDeleteLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
