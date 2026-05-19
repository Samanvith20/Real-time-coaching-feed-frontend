"use client"

import { useState } from "react"

import API from "@/services/api"
import Navbar from "@/components/Navbar"

import toast, { Toaster } from "react-hot-toast"

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      await API.post("/feed", formData)

      toast.success("Feed added successfully")

      setFormData({
        title: "",
        description: "",
        image: "",
        author: "",
      })
    } catch (error) {
      console.log(error)

      toast.error("Failed to add feed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />

      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">
            Add Coaching Feed
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              name="title"
              placeholder="Feed title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />

            <textarea
              name="description"
              placeholder="Feed description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              rows={5}
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl w-full"
            >
              {loading ? "Adding..." : "Add Feed"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}