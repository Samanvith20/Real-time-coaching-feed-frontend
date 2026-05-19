"use client";

import { useState, useRef } from "react";
import API from "@/services/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

// ── Shimmer skeleton (reusable) ──────────────────────────────────────────────
function ShimmerBox({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#1a1a1a] ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 50%,transparent 100%)",
          animation: "shimmer 1.6s infinite",
        }}
      />
    </div>
  );
}

// ── Image preview with shimmer ───────────────────────────────────────────────
function ImageUploadZone({ preview, onChange }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
        ${dragging ? "border-[#e8ff47] bg-[#e8ff47]/5" : "border-[#2e2e2e] hover:border-[#e8ff47]/40"}`}
      style={{ minHeight: 180 }}
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[#e8ff47] font-semibold tracking-widest text-sm uppercase">
              Change Image
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-44 gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#e8ff47" fillOpacity="0.08" />
            <path d="M20 12v16M12 20h16" stroke="#e8ff47" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-[#555] text-sm tracking-wide">
            <span className="text-[#e8ff47]">Click to upload</span> or drag & drop
          </p>
          <p className="text-[#3a3a3a] text-xs">PNG · JPG · WEBP</p>
        </div>
      )}
    </div>
  );
}

// ── Author pill selector ─────────────────────────────────────────────────────
const AUTHORS = [
  { value: "Admin",  icon: "⚡", color: "#e8ff47" },
  { value: "Mentor", icon: "🎯", color: "#7df9b6" },
  { value: "Coach",  icon: "🏆", color: "#ff9f47" },
];

function AuthorSelector({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {AUTHORS.map((a) => (
        <button
          key={a.value}
          type="button"
          onClick={() => onChange(a.value)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 font-semibold text-sm tracking-wide
            ${value === a.value
              ? "border-transparent text-black"
              : "border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#aaa]"
            }`}
          style={
            value === a.value
              ? { background: a.color, boxShadow: `0 0 20px ${a.color}55` }
              : {}
          }
        >
          <span>{a.icon}</span>
          {a.value}
        </button>
      ))}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    author: "Admin",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImage = (file) => {
    if (!file) return;
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim().length < 5)
      return toast.error("Title must be at least 5 characters");
    if (formData.description.trim().length < 10)
      return toast.error("Description must be at least 10 characters");
    if (!formData.image)
      return toast.error("Please upload an image");

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("author", formData.author);
      data.append("image", formData.image);

      await API.post("/feed", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Feed published successfully!");
      setFormData({ title: "", description: "", image: null, author: "Admin" });
      setPreview(null);
    } catch {
      toast.error("Failed to publish feed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,255,71,0); }
          50%       { box-shadow: 0 0 24px 4px rgba(232,255,71,0.18); }
        }

        * { box-sizing: border-box; }
        body { background: #0d0d0d; }

        .admin-page { font-family: 'DM Sans', sans-serif; background: #0d0d0d; min-height: 100vh; }

        .card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 24px;
          padding: 44px 40px;
          animation: fadeUp 0.6s ease both;
        }
        .card-header {
          margin-bottom: 36px;
        }
        .card-label {
          font-size: 11px;
          letter-spacing: 0.22em;
          color: #e8ff47;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          color: #f0f0f0;
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .divider {
          border: none;
          border-top: 1px solid #1e1e1e;
          margin: 28px 0;
        }

        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #555;
          padding-left: 2px;
          transition: color 0.2s;
        }
        .field-label.active { color: #e8ff47; }

        .input-field {
          width: 100%;
          background: #161616;
          border: 1.5px solid #222;
          border-radius: 14px;
          padding: 14px 18px;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          resize: none;
        }
        .input-field::placeholder { color: #3a3a3a; }
        .input-field:focus {
          border-color: #e8ff47;
          box-shadow: 0 0 0 3px rgba(232,255,71,0.08);
        }

        .char-count {
          font-size: 11px;
          color: #333;
          text-align: right;
          transition: color 0.2s;
        }
        .char-count.warn { color: #ff7a47; }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #e8ff47;
          color: #0d0d0d;
          border: none;
          border-radius: 14px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232,255,71,0.3);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          animation: pulse-glow 1.6s infinite;
        }
        .submit-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          animation: shimmer 1.2s infinite;
        }

        .meta-bar {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 14px 18px;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          border-radius: 14px;
          margin-top: -8px;
        }
        .meta-dot { width: 6px; height: 6px; border-radius: 50%; background: #e8ff47; }
        .meta-text { font-size: 12px; color: #444; }
      `}</style>

      <div className="admin-page">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#e8e8e8",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
            },
          }}
        />

        <Navbar />

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }}>
          <div className="card">
            <div className="card-header">
              <p className="card-label">Admin Console</p>
              <h1 className="card-title">Publish Feed</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Title */}
              <div className="field-group">
                <label className={`field-label ${focused === "title" ? "active" : ""}`}>
                  Feed Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter a compelling title…"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={() => setFocused("title")}
                  onBlur={() => setFocused("")}
                  className="input-field"
                  required
                />
                <span className={`char-count ${formData.title.length > 80 ? "warn" : ""}`}>
                  {formData.title.length} / 100
                </span>
              </div>

              {/* Description */}
              <div className="field-group">
                <label className={`field-label ${focused === "description" ? "active" : ""}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Share coaching insights, tips, or updates…"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setFocused("description")}
                  onBlur={() => setFocused("")}
                  className="input-field"
                  rows={5}
                  required
                />
                <span className={`char-count ${formData.description.length > 450 ? "warn" : ""}`}>
                  {formData.description.length} chars
                </span>
              </div>

              <hr className="divider" />

              {/* Image Upload */}
              <div className="field-group">
                <label className="field-label">Cover Image</label>
                <ImageUploadZone preview={preview} onChange={handleImage} />
              </div>

              <hr className="divider" />

              {/* Author */}
              <div className="field-group">
                <label className="field-label">Published As</label>
                <AuthorSelector
                  value={formData.author}
                  onChange={(v) => setFormData({ ...formData, author: v })}
                />
              </div>

              {/* Meta bar */}
              {formData.title && (
                <div className="meta-bar">
                  <div className="meta-dot" />
                  <span className="meta-text">
                    Ready to publish as <strong style={{ color: "#e8e8e8" }}>{formData.author}</strong>
                    {preview ? " · with cover image" : " · no cover image"}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop: 4 }}>
                {loading && <span className="submit-btn-shimmer" />}
                {loading ? "Publishing…" : "Publish Feed →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}