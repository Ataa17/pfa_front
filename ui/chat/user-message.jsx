"use client"

import React from "react"
import { User } from "lucide-react"

export default function UserMessage({ children }) {
  return (
    <div className="w-full flex justify-end">
      <div className="flex items-end gap-3 max-w-[80%]">
        <div className="rounded-xl bg-blue-600 px-4 py-2 text-white text-right break-words">
          {children}
        </div>
        <div className="rounded-full bg-white/10 p-2">
          <User className="size-5 text-white" />
        </div>
      </div>
    </div>
  )
}
