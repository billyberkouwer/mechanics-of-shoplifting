import { motion } from "framer-motion"
import { forwardRef } from "react"
const SvgComponent = (props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={115}
    height={115}
    fill="none"
    className="bog-logo"
    ref={ref}
    {...props}
  >
    <path
      fill="#000"
      d="M47.88 53.988c4.33-6.022 9.002-9.033 14.014-9.033 4.59 0 8.594 1.97 12.012 5.908 3.418 3.907 5.127 9.261 5.127 16.065 0 7.942-2.636 14.339-7.91 19.19-4.525 4.166-9.57 6.25-15.137 6.25-2.604 0-5.257-.473-7.959-1.417-2.669-.944-5.403-2.36-8.203-4.248V40.365c0-5.078-.13-8.203-.39-9.375-.228-1.172-.603-1.97-1.123-2.392-.521-.424-1.172-.635-1.954-.635-.911 0-2.05.26-3.417.781l-.684-1.709 13.428-5.469h2.197v32.422Zm0 3.125v26.758c1.661 1.628 3.37 2.865 5.128 3.711 1.79.814 3.613 1.22 5.469 1.22 2.962 0 5.712-1.627 8.252-4.882 2.571-3.255 3.857-7.992 3.857-14.21 0-5.728-1.286-10.123-3.858-13.183-2.538-3.092-5.436-4.638-8.69-4.638-1.726 0-3.451.44-5.177 1.318-1.302.651-2.962 1.953-4.98 3.906Z"
    />
    <rect
      width={112}
      height={112}
      x={1.5}
      y={1.5}
      stroke="#000"
      strokeWidth={3}
      rx={56}
    />
  </svg>
)
const BogLogo = forwardRef(SvgComponent)

export default function Loading() {
    return (
        <motion.div className="container--loading-page" initial={{x: 0}} exit={{x: '-100vw'}} transition={{duration: 1}}>
            <BogLogo />
        </motion.div>
    )
}