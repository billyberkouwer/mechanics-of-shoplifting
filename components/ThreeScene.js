import { OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { forwardRef, useEffect } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const ThreeScene = forwardRef(({model, index}, ref) => {
    // const gltf = useLoader(GLTFLoader, '/assets/3d/garter.gltf');

    return (
        <div style={{minWidth: '500px', height: '500px'}} ref={el => { if (el) {ref.current[index] = el}}}>
            <Canvas style={{backgroundColor: 'red'}}>
                <pointLight />
                {/* <primitive object={scene} /> */}
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    )
})

ThreeScene.displayName = 'ThreeScene'

export default ThreeScene;