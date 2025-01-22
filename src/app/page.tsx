import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DeviceCard from "@/components/DeviceCard";
import { Toaster } from "@/components/ui/toaster";
import { UserCredentialsSidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="min-h-[calc(100vh-128px)] grid flex-1 gap-10 py-4 px-4 grid-cols-3 content-start justify-items-center">
          <DeviceCard deviceName="LED 1" deviceId="xyz" />
        </div>
        <UserCredentialsSidebar />
      </div>
      <Footer />
    </>
  );
}
