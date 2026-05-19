"use client"

import { useEffect, useState } from "react"

import API from "@/services/api"
import socket from "@/socket/socket"

import FeedList from "@/components/FeedList"
import Loader from "@/components/Loader"
import Navbar from "@/components/Navbar"

import toast, { Toaster } from "react-hot-toast"

export default function HomePage() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch feeds
  const fetchFeeds = async () => {
    try {
      const res = await API.get("/feed")

      setFeeds(res.data.feeds)
    } catch (error) {
      console.log(error)

      toast.error("Failed to fetch feeds")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Socket listener
    socket.on("new-feed", (newFeed) => {
      toast.success("New coaching update received")

      // Prevent duplicates
      setFeeds((prev) => {
        const exists = prev.find(
          (feed) => feed._id === newFeed._id
        )

        if (exists) return prev

        return [newFeed, ...prev]
      })
    })

    // Cleanup
    return () => {
      socket.off("new-feed")
    }
  }, [])

  useEffect(() => {
    fetchFeeds()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-4xl font-bold mb-8">
          Live Coaching Updates
        </h2>

        {loading ? (
          <Loader />
        ) : (
          <FeedList feeds={feeds} />
        )}
      </div>
    </div>
  )
}