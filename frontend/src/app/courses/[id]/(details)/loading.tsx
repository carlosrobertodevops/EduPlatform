import { Navbar } from "@/components/layout/navbar";

export default function () {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container flex items-center justify-center flex-1">
        <div className="border-4 rounded-full border-l-blue-500 size-7 animate-spin" />
      </div>
    </div>
  )
}