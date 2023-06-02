import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import useMousePosition from "../hooks/useMousePosition";
import { transform } from "framer-motion";
import PointingHand from "./PointingHand";

const Background = forwardRef(function Background(props, ref) {
    const { windowSize } = props;
    const backgroundImageContainerRefs = useRef([]);
    const handRef = useRef();
    const [renderImageSizes, setRenderedImageSizes] = useState([]);

    useEffect(() => {
        const height = windowSize.y;
        backgroundImageContainerRefs.current.forEach((image, i) => {
            const blendModeClassNames = ["difference", "overlay", "none", "exclusion"];
            const randomBlendMode = blendModeClassNames[(Math.floor(Math.random() * blendModeClassNames.length))];
            image.style.width = height + 'px';
            image.style.height = height * renderImageSizes[i] + 'px';
            image.style.top = (Math.random() - 0.75) * (height / 3) + 'px';
            image.style.marginLeft = - (height / (Math.random() + 1)) + 'px';
            image.style.transform = `rotate(${Math.random() * 20}deg)`;
            image.classList.add(randomBlendMode);
            image.classList.add('block')
        });
    }, [renderImageSizes, windowSize]);

    useEffect(() => {
        if (handRef.current) {
            if (props.isDisplayed) {
                const fadeIn = setTimeout(() => {
                    handRef.current.classList.add("visible");
                }, 3000)
    
                const slide = setTimeout(() => {
                    handRef.current.classList.add("slide");
                }, 8000)
    
                return () => {
                    clearTimeout(slide)
                    clearTimeout(fadeIn)
                }
            }   else {
                handRef.current.classList.remove("visible");
                handRef.current.classList.remove("slide")
            }
            
        }
    }, [props.isDisplayed])

    return (
        <>
            <div className='container--background' ref={el => ref.current[0] = el}>
                <div className="container--background-wall" />
                <div className='container--background-images'>
                    {Array(10).fill('').map((el, index) => (
                        Array(12).fill('').map((el, i) => (
                            <div key={'bg-image' + i} className="poster-container" ref={el => el && backgroundImageContainerRefs.current.push(el)}>
                                <Image priority src={`/assets/images/${i + 1}c.png`} onLoad={(e) => setRenderedImageSizes(curr => [...curr, e.target.naturalWidth / e.target.naturalHeight])} fill alt={'bg image' + i} sizes="80vh" className={"posters"} />
                            </div>
                        ))
                    ))}
                </div>
                <div className="container--hand" ref={handRef}>
                    <PointingHand strokeColor={"black"} />
                </div>
            </div>

        </>
    );
});

export default Background;