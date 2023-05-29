import { useEffect, useRef } from "react";

export default function useMousePosition() {
    const mousePos = useRef({mouse: undefined, touch: undefined});

    useEffect(() => {
        document.addEventListener("mousemove", function(e) { mousePos.current.mouse = e});
        document.addEventListener("touchmove", function(e) { mousePos.current.touch = e});
    }, [])

    return mousePos;
}