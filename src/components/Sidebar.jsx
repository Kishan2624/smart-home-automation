"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchUserCredentials } from "@/app/actions/user"

export function UserCredentialsSidebar() {
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      const credentials = await fetchUserCredentials()
      setApiKey(credentials.apiKey || "")
      setApiSecret(credentials.apiSecret || "")
      setEmail(credentials.email)
      toast({
        title: "Success",
        description: "Credentials fetched successfully.",
      })
    } catch (error) {
      console.error("Error fetching credentials:", error)
      toast({
        title: "Error",
        description: "Failed to fetch credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  const copyToClipboard = (text, label) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: `${label} has been copied to clipboard.`,
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Error",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="w-64 bg-white min-h-[calc(100vh-128px)] p-4 border-l border-gray-300 ">
      <h2 className="text-xl font-bold mb-4 text-center">User Credentials</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input id="email" value={email} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </Label>
          <div className="flex mt-1">
            <Input id="apiKey" value={apiKey} readOnly className="rounded-r-none" />
            <Button
              onClick={() => copyToClipboard(apiKey, "API Key")}
              variant="outline"
              className="rounded-l-none border-l-0"
              aria-label="Copy API Key"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="apiSecret" className="text-sm font-medium">
            API Secret
          </Label>
          <div className="flex mt-1">
            <Input id="apiSecret" value={apiSecret} readOnly className="rounded-r-none" type="password" />
            <Button
              onClick={() => copyToClipboard(apiSecret, "API Secret")}
              variant="outline"
              className="rounded-l-none border-l-0"
              aria-label="Copy API Secret"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={fetchCredentials} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Credentials
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

