import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import Footnote from "./Footnote";
import Image from "next/image";
import { isMobile } from "react-device-detect";

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
        let factor = 20;
        if (isMobile) {
            factor = 10;
        }
        const rotation = { start: (Math.random() - 0.5) * factor, end: (Math.random() - 0.5) * factor }
        setPageRotation(rotation)
    }, [])

    return (
        <motion.div className='container--page' ref={el => ref.current[index] = el} initial={{ scale: 2, rotateZ: pageRotation.start }} transition={{ duration: 0.5 }} animate={{ scale: 1, rotateZ: pageRotation.end }}>
            <div style={{position: 'fixed', zIndex: -1, height: '100%', width: '100%', top: 0, left: 0}}>
                <Image src={"/assets/paper.png"} fill />
            </div>
            <div className="text--body" ref={el => pageElementsRef.current[0] = el}>
                <PortableText value={content} components={PortableTextComponents} />
            </div>
        </motion.div>
    )
})

Page.displayName = 'Page'

export default Page;