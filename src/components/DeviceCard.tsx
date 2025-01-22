import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DeviceCardProps {
  deviceName: string
  deviceId: string
}

const DeviceCard: React.FC<DeviceCardProps> = ({ deviceName, deviceId }) => {
  return (
    <Card className="w-full max-w-sm max-h-48">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Device Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Device Name:</span>
            <span className="font-bold">{deviceName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Device ID:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{deviceId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DeviceCard

