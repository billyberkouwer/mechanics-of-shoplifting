import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import Image from "next/image"
import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { isMobile } from "react-device-detect"

function Mesh({ model }) {
    const { scene } = useGLTF(model);

    const firstTargetDirection = useRef('decreasing')
    const firstTarget = useRef(100);
    const firstMorphTargetAmount = useRef(0);

    const secondTargetDirection = useRef('increasing')
    const secondTarget = useRef(50);
    const secondMorphTargetAmount = useRef((4.3));


    useFrame((state, delta) => {
        scene.children.forEach(mesh => {
            if (mesh.morphTargetInfluences) {
                const speed = 2.5;
                const firstMorphFactor = (Math.cos(firstMorphTargetAmount.current) + 1) / 2;
                firstMorphTargetAmount.current = firstMorphTargetAmount.current + (delta * speed);
                mesh.morphTargetInfluences.forEach((morphTarget) => { morphTarget = 0 })
                mesh.morphTargetInfluences[firstTarget.current] = firstMorphFactor;
                if (firstTargetDirection.current === 'increasing') {
                    if (firstMorphFactor > 0.99) {
                        firstTargetDirection.current = 'decreasing';
                    }
                }

                if (firstTargetDirection.current === 'decreasing') {
                    if (firstMorphFactor < 0.01) {
                        mesh.morphTargetInfluences[firstTarget.current] = 0;
                        firstTarget.current = Math.floor(Math.random() * mesh.morphTargetInfluences.length);
                        firstTargetDirection.current = 'increasing';

                    }
                }


                const secondMorphFactor = (Math.sin(secondMorphTargetAmount.current) + 1) / 2;
                secondMorphTargetAmount.current = secondMorphTargetAmount.current + (delta * speed);
                mesh.morphTargetInfluences[secondTarget.current] = secondMorphFactor;
                if (secondTargetDirection.current === 'increasing') {
                    if (secondMorphFactor > 0.99) {
                        secondTargetDirection.current = 'decreasing';
                    }
                }
                if (secondTargetDirection.current === 'decreasing') {
                    if (secondMorphFactor < 0.01) {
                        mesh.morphTargetInfluences[secondTarget.current] = 0;
                        secondTarget.current = Math.floor(Math.random() * mesh.morphTargetInfluences.length);
                        secondTargetDirection.current = 'increasing';
                    }
                }
            }
        });
    });




    return (
        <primitive key={scene} object={scene} scale={[4, 4, 4]} position={[0, 0, 0]} />
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
            <Canvas camera={{ fov: 30, position: [0, 0, 15] }}>
                <pointLight position={[0, 0, -4]} />
                <pointLight position={[0, 0, 4]} />
                <pointLight position={[4, 0, 0]} intensity={0.25} />
                <pointLight position={[-4, 0, 0]} intensity={0.25} />
                <pointLight position={[0, 4, 0]} intensity={0.75} />
                <Mesh model={model} />
                <OrbitControls />
            </Canvas>
        </motion.div>
    )
})

ThreeScene.displayName = 'ThreeScene';

export default ThreeScene;