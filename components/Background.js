import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import useMousePosition from "../hooks/useMousePosition";
import { transform } from "framer-motion";

const Background = forwardRef(function Background(props, ref) {
    const { windowSize } = props;
    const backgroundImageContainerRefs = useRef([]);
    const [renderImageSizes, setRenderedImageSizes] = useState([]);

    useEffect(() => {
        const height = windowSize.y;
        backgroundImageContainerRefs.current.forEach((image, i) => {
            const blendModeClassNames = ["difference", "overlay", "none", "exclusion"];
            const randomBlendMode = blendModeClassNames[(Math.floor(Math.random()*blendModeClassNames.length))];
            image.style.width = height + 'px';
            image.style.height = height * renderImageSizes[i] + 'px';
            image.style.top = (Math.random() - 0.75) * (height / 3) +  'px';
            image.style.marginLeft = - (height / (Math.random() + 1))  + 'px';
            image.style.transform = `rotate(${Math.random() * 20}deg)`;
            image.classList.add(randomBlendMode);
            
        });

    }, [renderImageSizes, windowSize]);

    return (
        <>
            <div className='container--background' ref={el => ref.current[0] = el}>
                <div className="container--background-wall" />
                <div className='container--background-images'>
                    {Array(10).fill('').map((el, index) => (
                        Array(12).fill('').map((el, i) => (
                            <div key={'bg-image' + i} style={{ position: 'relative'}} ref={el => el && backgroundImageContainerRefs.current.push(el)}>
                                <Image src={`/assets/images/${i+1}c.png`} onLoad={(e) => setRenderedImageSizes(curr => [...curr, e.target.naturalWidth / e.target.naturalHeight])} fill alt={'bg image' + i} style={{ objectFit: 'contain', opacity: 1, pointerEvents: 'none' }} />
                            </div>
                        ))
                    ))}
                </div>
            </div>
            
    </>
    );
});

export default Background;