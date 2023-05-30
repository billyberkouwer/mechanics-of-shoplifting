import { useEffect, useRef } from "react"
import useMousePosition from "../hooks/useMousePosition"
import Image from "next/image"
import { isMobile } from "react-device-detect"

export default function Candle({eyeController}) {
    const vignetteRef = useRef()
    const candleContainerRef = useRef()
    const candleRef = useRef()

    console.log(eyeController)
    
    useEffect(() => {
        function setVignettePosition(e) {
            if (vignetteRef.current) {
                let factor = 2;
                if (e.type === "mousemove") {
                    vignetteRef.current.style.transform = `translate(${e.clientX-(window.innerWidth/factor)}px, ${e.clientY-(window.innerHeight/factor)}px)`
                    candleContainerRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
                }

                if (e.type === 'touchmove') {
                    vignetteRef.current.style.transform = `translate(${e.touches[0].clientX-(window.innerWidth/factor)}px, ${e.touches[0].clientY-(window.innerHeight/factor)}px)`
                    candleContainerRef.current.style.transform = `translate(calc(${e.touches[0].clientX}px - 50%), calc(${e.touches[0].clientY}px - 50%))`
                }
            }
        }
        document.addEventListener("mousemove", e => setVignettePosition(e));
        document.addEventListener("touchmove", e => setVignettePosition(e));

        return () => {
            document.removeEventListener("mousemove", setVignettePosition);
            document.removeEventListener("touchmove", setVignettePosition);
        }
    }, [])

    useEffect(() => {
        if (!isMobile) {
            if (eyeController.backward) {
                candleRef.current.style.transform = 'rotateY(180deg)'
            }
            if (!eyeController.backward) {
                candleRef.current.style.transform = 'rotateY(0deg)'
            }
            if (eyeController.visible) {
                candleRef.current.style.opacity = '1'
            }
            if (!eyeController.visible) {
                candleRef.current.style.opacity = '0'
            }
        }
    }, [eyeController])

    return (
        <>
            <div className='vignette' ref={vignetteRef} />
            <div  className="eye--container" ref={candleContainerRef} >
                <Image src="assets/eye-2.svg" className="eye" ref={candleRef} alt={'candle mouse illuminator'} width={100} height={100} sizes="100px"  />
            </div>
        </>
    )
}