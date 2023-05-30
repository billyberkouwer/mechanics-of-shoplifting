import { OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import Image from "next/image"
import { forwardRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { isMobile } from "react-device-detect"

function Mesh({ model }) {
    const { scene } = useGLTF(model)
    return (
        <primitive object={scene} scale={[4, 4, 4]} position={[0,-1.5,0]} />
    )
}

const ThreeScene = forwardRef(({
    model,
    index
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
            <Canvas>
                <pointLight />
                <pointLight position={[0,0,2]} />
                <Mesh model={model} />
                <OrbitControls />
            </Canvas>
        </motion.div>
    )
})

ThreeScene.displayName = 'ThreeScene';

export default ThreeScene;