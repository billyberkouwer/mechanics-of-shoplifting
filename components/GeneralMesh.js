const { useGLTF } = require("@react-three/drei");
const { useFrame } = require("@react-three/fiber");
const { useRef } = require("react");

export default function GeneralMesh({ model, pageTitle }) {
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