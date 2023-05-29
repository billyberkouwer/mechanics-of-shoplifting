import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Mesh({model}) {
    const meshRef = useRef();
    let i = 0;
    const { scene } = useGLTF(model)

    useFrame(() => {
        i+=0.01
        //  meshRef.current.rotation.set(i, i, i) 
    })

    return (    
        <primitive object={scene} />
    )
}

const ThreeCanvasPage = forwardRef(({
    index,
    swipeIndex,
    model
}, ref) => {
    const [pageRotation, setPageRotation] = useState({ start: undefined, end: undefined });
    const pageElementsRef = useRef([]);


    useEffect(() => {
        setPageRotation({ start: (Math.random() - 0.5) * 20, end: (Math.random() - 0.5) * 20 })
    }, [])


    return (
        <motion.div className='container--3d-page' ref={el => ref.current[index] = el} initial={{ rotateZ: pageRotation.start }} transition={{ duration: 0.5 }} animate={{ rotateZ: pageRotation.end }}>
            <Canvas frameloop={index === swipeIndex ? 'always' : 'never'}>
                <pointLight position={[2, 2, 2]} />
                <Mesh model={'/assets/3d/garter.glb'}/>
                <OrbitControls />
            </Canvas>        
        </motion.div>
    )
})

ThreeCanvasPage.displayName = 'Page'

export default ThreeCanvasPage;