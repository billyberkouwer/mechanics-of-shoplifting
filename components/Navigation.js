import { useState } from "react"
import Candle from "./Candle"

export default function Navigation({ setSwipeData, swipeData, isDesktop, handleSwipe, contentLength, setIsProjectInfoDisplayed }) {
    const [eyeController, setEyeController] = useState({ backward: false, visible: false })

    return (
        <>
            <div
                className={`click-area-left ${isDesktop ? null : 'hidden'}`}
                onMouseEnter={() => { swipeData.index < contentLength - 1 && setEyeController({ backward: false, visible: true }) }}
                onMouseLeave={() => setEyeController({ backward: false, visible: false })}
                onClick={() => handleSwipe({ dir: 'Left' })}
                style={{transform: swipeData.index === 0 ? 'scale(1.75)' : null}}
            />
            <div
                className={`click-area-right ${isDesktop ? null : 'hidden'}`}
                onMouseEnter={() => swipeData.index > 0 && setEyeController({ backward: true, visible: true })}
                onMouseLeave={() => setEyeController({ backward: true, visible: false })}
                onClick={() => handleSwipe({ dir: 'Right' })}
            />
            <Candle eyeController={eyeController} />
            <button className="project-info--button--container" onClick={() => setIsProjectInfoDisplayed((curr) => !curr)}>
                i
            </button>
        </>
    )
}