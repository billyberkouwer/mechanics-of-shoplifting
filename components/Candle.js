import { useEffect, useRef } from "react"
import useMousePosition from "../hooks/useMousePosition"
import Image from "next/image"

export default function Candle() {
    const vignetteRef = useRef()
    const candleRef = useRef()
    
    useEffect(() => {
        function setVignettePosition(e) {
            if (vignetteRef.current) {
                let factor = 2;
                if (e.type === "mousemove") {
                    vignetteRef.current.style.transform = `translate(${e.clientX-(window.innerWidth/factor)}px, ${e.clientY-(window.innerHeight/factor)}px)`
                    // candleRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
                }

                if (e.type === 'touchmove') {
                    vignetteRef.current.style.transform = `translate(${e.touches[0].clientX-(window.innerWidth/factor)}px, ${e.touches[0].clientY-(window.innerHeight/factor)}px)`
                    // candleRef.current.style.transform = `translate(calc(${e.touches[0].clientX}px - 50%), calc(${e.touches[0].clientY}px - 50%))`
                }
            }
        }
        document.addEventListener("mousemove", e => setVignettePosition(e));
        document.addEventListener("touchmove", e => setVignettePosition(e));
    }, [])

    return (
        <>
            <div className='vignette' ref={vignetteRef} />
            {/* <Image src="/assets/candle.png" ref={candleRef} alt={'candle mouse illuminator'} className="candle" width={100} height={100} sizes="100px" /> */}
        </>
    )
}