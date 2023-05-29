import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import Footnote from "./Footnote";

const Page = forwardRef(({
    windowSize,
    index,
    swipeIndex,
    footnotes,
    content,
    model
}, ref) => {
    const [pageRotation, setPageRotation] = useState({ start: undefined, end: undefined });
    const pageElementsRef = useRef([]);

    const PortableTextComponents = {
        marks: {
            footnote: (children, value) => {
                console.log(children)
                console.log(footnotes)
                return (
                    footnotes.map((footnotes) => {
                        if (children.value['_ref'] === footnotes['_id']) {
                            return <Footnote key={footnotes['_id']} footnoteElements={footnotes.content[0].children} title={children.text} />
                        }
                    })
                )
            }
        },
    }

    useEffect(() => {
        setPageRotation({ start: (Math.random() - 0.5) * 20, end: (Math.random() - 0.5) * 20 })
    }, [])



    return (
        <motion.div className='container--page' ref={el => ref.current[index] = el} initial={{ scale: 2, rotateZ: pageRotation.start }} transition={{ duration: 0.5 }} animate={{ scale: 1, rotateZ: pageRotation.end }}>
            <div className="text--body" ref={el => pageElementsRef.current[0] = el}>
                <PortableText value={content} components={PortableTextComponents} />
            </div>
        </motion.div>
    )
})

Page.displayName = 'Page'

export default Page;