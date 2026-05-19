import FeedCard from "./Feedcard"

export default function FeedList({ feeds }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {feeds.map((feed) => (
        <FeedCard
          key={feed._id}
          feed={feed}
        />
      ))}
    </div>
  )
}