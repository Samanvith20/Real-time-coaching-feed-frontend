"use client"

import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

export default function FeedCard({ feed }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {feed.image && (
        <img
  src={feed.image}
  alt={feed.title}
  className="w-full h-56 object-cover"
/>
      )}

      <div className="p-5">
        <h2 className="text-2xl font-bold mb-2">
          {feed.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {feed.description}
        </p>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{feed.author}</span>

          <span>
            {formatDistanceToNow(
              new Date(feed.createdAt),
              { addSuffix: true }
            )}
          </span>
        </div>
      </div>
    </div>
  )
}