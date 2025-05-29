import { useState } from "react"
import { Star } from "lucide-react"

export function CommentRating({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e, starIndex) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - left) / width

    // Calculate value with 0.5 step precision
    // For the last star (index 4), allow it to reach 5.0
    let newValue
    if (starIndex === 4) {
      newValue = starIndex + (percent < 0.5 ? 0.5 : 1)
    } else {
      newValue = starIndex + (percent < 0.5 ? 0 : 0.5)
    }

    // Ensure the value is between 0.5 and 5
    newValue = Math.max(0.5, Math.min(5, newValue))

    setHoverValue(newValue)
  }

  const handleClick = () => {
    onChange(hoverValue)
  }

  return (
    <div className="flex" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const displayValue = isHovering ? hoverValue : value
        const percent = Math.min(100, Math.max(0, (displayValue - starIndex) * 100))

        return (
          <div
            key={starIndex}
            className="relative cursor-pointer w-5 h-5"
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={handleClick}
          >
            <Star className="absolute w-5 h-5 text-muted-foreground/30" />
            <div className="absolute overflow-hidden" style={{ width: `${percent}%` }}>
              <Star className="w-5 h-5 text-yellow-400" fill="#ffa33d" />
            </div>
          </div>
        )
      })}
    </div>
  )
}