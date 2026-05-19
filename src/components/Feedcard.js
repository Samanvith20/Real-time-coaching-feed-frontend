"use client"

import Image from "next/image"

import { formatDistanceToNow } from "date-fns"

export default function FeedCard({ feed }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden  transition-all duration-300">

      <div className="relative w-full h-64">
        <Image
          src={feed.image}
          alt={feed.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          priority={false}
        />
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold mb-2">
          {feed.title}
        </h2>

        <p className="text-gray-600 mb-5 leading-relaxed">
          {feed.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
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