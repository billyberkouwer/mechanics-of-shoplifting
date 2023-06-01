import { MeshRefractionMaterial, OrbitControls, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import Image from "next/image"
import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { isMobile } from "react-device-detect"
import { CubeTextureLoader } from "three"
import Skirt from "./Skirt"

const ThreeScene = forwardRef(({
    model,
    index,
    pageTitle
}, ref) => {
    const [pageRotation, setPageRotation] = useState({ start: undefined, end: undefined });
    useEffect(() => {
        let factor = 20;
        if (isMobile) {
            factor = 10;
        }
        const rotation = { start: (Math.random() - 0.5) * factor, end: (Math.random() - 0.5) * factor }
        setPageRotation(rotation)
    }, [])

    return (
        <motion.div className='container--page' ref={el => ref.current[index] = el} initial={{ rotateZ: pageRotation.start }} transition={{ duration: 0.5 }} animate={{ rotateZ: pageRotation.end }}>
            <div style={{ position: 'fixed', zIndex: -1, height: '100%', width: '100%', top: 0, left: 0 }}>
                <Image src={"/assets/paper.png"} fill alt={'old paper sheet'} />
            </div>
            <Canvas camera={{ fov: 30, position: [0, 0, 15] }}>
                <pointLight position={[0, 0, -4]} />
                <pointLight position={[0, 0, 4]} />
                <pointLight position={[4, 0, 0]} intensity={0.25} />
                <pointLight position={[-4, 0, 0]} intensity={0.25} />
                <pointLight position={[0, 4, 0]} intensity={0.75} />
                {pageTitle === "3D Page - The Skirt" ? <Skirt model={model} /> : null}
                <OrbitControls />
            </Canvas>
        </motion.div>
    )
})

ThreeScene.displayName = 'ThreeScene';

export default ThreeScene;