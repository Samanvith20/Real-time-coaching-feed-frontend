
"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import socket from "@/socket/socket";
import FeedList from "@/components/FeedList";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

// ── Shimmer card skeleton ────────────────────────────────────────────────────
function FeedCardSkeleton() {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: 20,
        overflow: "hidden",
        animation: "fadeUp 0.5s ease both",
      }}
    >
      {/* Image shimmer */}
      <div
        style={{
          height: 200,
          background: "#161616",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="shimmer-sweep" />
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Author pill shimmer */}
        <div
          style={{
            height: 24,
            width: 80,
            borderRadius: 999,
            background: "#1a1a1a",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="shimmer-sweep" />
        </div>

        {/* Title shimmer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              height: 20,
              width: "85%",
              borderRadius: 8,
              background: "#1a1a1a",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="shimmer-sweep" />
          </div>
          <div
            style={{
              height: 20,
              width: "60%",
              borderRadius: 8,
              background: "#1a1a1a",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="shimmer-sweep" />
          </div>
        </div>

        {/* Description shimmer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[100, 90, 75].map((w, i) => (
            <div
              key={i}
              style={{
                height: 13,
                width: `${w}%`,
                borderRadius: 6,
                background: "#181818",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="shimmer-sweep" style={{ animationDelay: `${i * 0.1}s` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton grid ────────────────────────────────────────────────────────────
function FeedSkeletonGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 0.07}s` }}>
          <FeedCardSkeleton />
        </div>
      ))}
    </div>
  );
}

// ── Live indicator ───────────────────────────────────────────────────────────
function LiveBadge({ newCount }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        background: "rgba(232,255,71,0.08)",
        border: "1px solid rgba(232,255,71,0.2)",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: "#e8ff47",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: 4,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#e8ff47",
          display: "inline-block",
          animation: "livePulse 1.4s ease-in-out infinite",
        }}
      />
      Live {newCount > 0 && `· ${newCount} new`}
    </div>
  );
}

// ── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip({ total }) {
  const stats = [
    { label: "Updates", value: total },
    { label: "Authors", value: "3" },
    { label: "Status", value: "Live" },
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: 1,
        background: "#161616",
        border: "1px solid #1e1e1e",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 40,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: "16px 20px",
            borderRight: i < stats.length - 1 ? "1px solid #1e1e1e" : "none",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#444",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              color: s.label === "Status" ? "#e8ff47" : "#e0e0e0",
              lineHeight: 1,
            }}
          >
            {s.value ?? "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "rgba(232,255,71,0.07)",
          border: "1px solid rgba(232,255,71,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          marginBottom: 8,
        }}
      >
        📭
      </div>
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 32,
          color: "#333",
          letterSpacing: "0.04em",
        }}
      >
        No updates yet
      </h3>
      <p style={{ color: "#444", fontSize: 14, maxWidth: 300, lineHeight: 1.6 }}>
        Coaching feeds will appear here in real-time as they're published.
      </p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);

  const fetchFeeds = async () => {
    try {
      const res = await API.get("/feed");
      setFeeds(res.data.feeds);
    } catch {
      toast.error("Failed to fetch feeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("new-feed", (newFeed) => {
      toast.success("New coaching update received!", {
        icon: "⚡",
        style: {
          background: "#1a1a1a",
          color: "#e8e8e8",
          border: "1px solid rgba(232,255,71,0.3)",
          borderRadius: "12px",
          fontFamily: "'DM Sans', sans-serif",
        },
      });
      setFeeds((prev) => {
        if (prev.find((f) => f._id === newFeed._id)) return prev;
        setNewCount((n) => n + 1);
        return [newFeed, ...prev];
      });
    });
    return () => socket.off("new-feed");
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes slideInNew {
          from { opacity: 0; transform: translateY(-16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        * { box-sizing: border-box; }
        body { background: #0d0d0d; }

        .home-page { font-family: 'DM Sans', sans-serif; background: #0d0d0d; min-height: 100vh; }

        .shimmer-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.045) 50%,
            transparent 100%
          );
          animation: shimmer 1.6s ease-in-out infinite;
        }

        .page-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        .page-header {
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease both;
        }

        .page-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 7vw, 80px);
          color: #f0f0f0;
          line-height: 0.95;
          letter-spacing: 0.02em;
          margin: 10px 0 0;
        }

        .title-accent { color: #e8ff47; }

        .new-feed-badge {
          animation: slideInNew 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
      `}</style>

      <div className="home-page">
        <Toaster position="top-right" />
        <Navbar />

        <div className="page-inner">
          {/* Header */}
          <div className="page-header">
            <LiveBadge newCount={newCount} />
            <h1 className="page-title">
              Coaching <span className="title-accent">Updates</span>
            </h1>
          </div>

          {/* Stats */}
          {!loading && <StatsStrip total={feeds.length} />}

          {/* Content */}
          {loading ? (
            <FeedSkeletonGrid />
          ) : feeds.length === 0 ? (
            <EmptyState />
          ) : (
            <FeedList feeds={feeds} />
          )}
        </div>
      </div>
    </>
  );
}