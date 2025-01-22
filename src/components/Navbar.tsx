"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {  SignInButton, UserButton } from "@clerk/nextjs"
import { CreateDeviceDialog } from "@/components/CreateDevice";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex flex-wrap  justify-between items-center">
        <Link href="/" className="text-xl font-bold ">
          LOGO
        </Link>
        <div className="flex items-center space-x-4">
            <CreateDeviceDialog />
          <SignInButton mode="modal">
            <UserButton />  
          </SignInButton>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

