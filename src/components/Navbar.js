

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const isAdmin = pathname === "/admin"

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold tracking-wide">
          Coaching Feed
        </h1>

        <Link
          href={isAdmin ? "/" : "/admin"}
          className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          {isAdmin ? "Home" : "Admin"}
        </Link>

      </div>
    </nav>
  )
}