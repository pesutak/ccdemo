export default function Avatar({ src, alt, size = 40, hasStory, viewed, className = '' }) {
  const dim = `${size}px`

  if (hasStory) {
    const ringPad = Math.max(2, size * 0.06)
    const total = size + ringPad * 2 + 4
    return (
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: total,
          height: total,
          padding: 2,
          background: viewed
            ? '#3f3f46'
            : 'linear-gradient(135deg, #f97316, #fbbf24, #f97316)',
          borderRadius: '9999px',
        }}
      >
        <div className="w-full h-full rounded-full p-0.5 bg-zinc-950">
          <img
            src={src}
            alt={alt}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
      style={{ width: dim, height: dim }}
    />
  )
}
