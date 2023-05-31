import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import Image from "next/image"
import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { isMobile } from "react-device-detect"
import { AnimationMixer } from "three"

function Mesh({ model }) {
    const { scene, animations, actions } = useGLTF(model);
    let mixer = new AnimationMixer(scene);
    const [initialRender, setInitialRender] = useState(true);

    // animations.forEach((clip) => {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // });

    useEffect(() => {
        setInitialRender(false)
    }, [])

    const firstTargetDirection = useRef('descreasing')
    const firstTarget = useRef(100);
    const firstMorphTargetAmount = useRef(0);

    const secondTargetDirection = useRef('increasing')
    const secondTarget = useRef(50);
    const secondMorphTargetAmount = useRef(4.7);

    useFrame((state, delta) => {
        const speed = 2.5;
        const firstMorphFactor = (Math.cos(firstMorphTargetAmount.current) + 1) / 2;
        firstMorphTargetAmount.current = firstMorphTargetAmount.current + (delta*speed);
        if (scene?.children[0]?.morphTargetInfluences?.length) {
            scene.children[0].morphTargetInfluences[firstTarget.current] = firstMorphFactor;
            if (firstTargetDirection.current === 'increasing') {
                if (firstMorphFactor > 0.999) {
                    firstTargetDirection.current = 'decreasing';
                }
            }
            if (firstTargetDirection.current === 'decreasing') {
                if (firstMorphFactor < 0.001) {
                    scene.children[0].morphTargetInfluences[firstTarget.current] = 0;
                    firstTarget.current = Math.floor(Math.random() * scene.children[0].morphTargetInfluences.length);
                    firstTargetDirection.current = 'increasing';
                }
            }
        }

        const secondMorphFactor = (Math.sin(secondMorphTargetAmount.current) + 1) / 2;
        secondMorphTargetAmount.current = secondMorphTargetAmount.current + (delta*speed);
        if (scene?.children[0]?.morphTargetInfluences?.length) {
            scene.children[0].morphTargetInfluences[secondTarget.current] = secondMorphFactor;
            if (secondTargetDirection.current === 'increasing') {
                if (secondMorphFactor > 0.999) {
                    secondTargetDirection.current = 'decreasing';
                }
            }
            if (secondTargetDirection.current === 'decreasing') {
                if (secondMorphFactor < 0.001) {
                    scene.children[0].morphTargetInfluences[secondTarget.current] = 0;
                    secondTarget.current = Math.floor(Math.random() * scene.children[0].morphTargetInfluences.length);
                    secondTargetDirection.current = 'increasing';
                }
            }
        }

        // console.log(scene.children[0].morphTargetInfluences);
        
        console.log({firstMorphFactor: firstMorphFactor, secondMorphFactor: secondMorphFactor})
    });


    return (
        <primitive key={scene} object={scene} scale={[4, 4, 4]} position={[0, -1.5, 0]} />
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
                <pointLight position={[0, 0, 2]} />
                <Mesh model={model} />
                <OrbitControls />
            </Canvas>
        </motion.div>
    )
})

ThreeScene.displayName = 'ThreeScene';

export default ThreeScene;