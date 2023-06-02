import { useEffect, useRef, useState } from "react";

export default function Footnote({ title, footnoteElements }) {
    const [isDisplayed, setIsDisplayed] = useState(false);
    const ref = useRef()

    useEffect(() => {
        if (isDisplayed && ref.current) {

        }
    }, [isDisplayed])

    return (
        <span>
            <a onClick={() => setIsDisplayed(!isDisplayed)} onMouseEnter={() => document.body.style.cursor = 'pointer'} onMouseLeave={() => document.body.style.cursor = 'auto'} style={{ textDecoration: 'underline dashed 1px' }}>{title}</a>
            <span ref={ref} style={{ left: 0, width: 'max-content', maxWidth: '100%', margin: '0.5em', display: isDisplayed ? 'block' : 'none' }}>
                {footnoteElements.map((element) => {
                    if (element.marks.includes("em")) {
                        return (
                            <span key={element.text} style={{ fontStyle: 'italic' }}>{element.text}</span>
                        )
                    }
                    return (
                        <span key={element.text}>{element.text}</span>
                    )
                })}
            </span>
        </span>
    )
}