import { useState } from "react";

export default function Footnote({ title, footnoteElements }) {
    const [isDisplayed, setIsDisplayed] = useState(false);


    return (
        <span>
            <a onClick={() => setIsDisplayed(!isDisplayed)} onMouseEnter={() => document.body.style.cursor = 'pointer'} onMouseLeave={() => document.body.style.cursor = 'auto'} style={{ textDecoration: 'underline dashed 1px' }}>{title}</a>
            <span style={{ left: 0, width: 'max-content', maxWidth: '100%', margin: '0.5em 0', display: isDisplayed ? 'block' : 'none' }}>
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