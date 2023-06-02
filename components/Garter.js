import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, MeshReflectorMaterial, MeshTransmissionMaterial, useTexture, MeshRefractionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Color, CubeTextureLoader } from "three";

export default function Garter({ model, pageTitle, isActive }) {
    const { scene, materials, nodes } = useGLTF(model);
    const ref = useRef();
    const texture = useMemo(() => new CubeTextureLoader().setPath('/assets/').load(['square.jpg', 'square.jpg', 'square.jpg', 'square.jpg', 'square.jpg', 'square.jpg',]), [])
    const clothBump = useTexture('/assets/3d/cloth-bump.jpg');

    const firstTargetDirection = useRef('decreasing')
    const firstTarget = useRef(100);
    const firstMorphTargetAmount = useRef(0);
    const secondTargetDirection = useRef('increasing')
    const secondTarget = useRef(50);
    const secondMorphTargetAmount = useRef((4.3));

    useEffect(() => {
        console.log(materials)
    }, [materials])

    useFrame((state, delta) => {
        if (isActive) {
            // ref.current.rotation.y += delta / 4;
        scene.children.forEach(mesh => {
            if (mesh.morphTargetInfluences) {
                const speed = 3.5;
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
        }
    });

    return (
        <group ref={ref} dispose={null} scale={5}>
            <group name="Scene">
                <mesh
                    name="straight_leg_opti_(1)"
                    castShadow
                    receiveShadow
                    geometry={nodes["straight_leg_opti_(1)"].geometry}
                    material={nodes["straight_leg_opti_(1)"].material}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                >
                    <MeshTransmissionMaterial background={texture} transmission={1} chromaticAberration={0.2} distortion={2} thickness={10} distortionScale={0.5} roughness={0.2}/>

                </mesh>
                <mesh
                    name="Garter_straight_quads_(1)"
                    castShadow
                    receiveShadow
                    geometry={nodes["Garter_straight_quads_(1)"].geometry}
                    material={materials["FABRIC 1_FRONT_442229.002"]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                >
                    <meshStandardMaterial color={'rgb(182, 186, 168)'} bumpMap={clothBump} bumpScale={0.003} />
                </mesh>
                <mesh
                    name="hooks_opti1"
                    castShadow
                    receiveShadow
                    geometry={nodes.hooks_opti1.geometry}
                    material={materials["default"]}
                    position={[0.06, 0.17, -0.195]}
                    rotation={[1.8, 0, 0]}
                    scale={0.02}
                />
                <mesh
                    name="hooks_opti2"
                    castShadow
                    receiveShadow
                    geometry={nodes.hooks_opti2.geometry}
                    material={materials["default"]}
                    position={[0.135, 0.135, -0.03]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.02}
                />
                <mesh
                    name="hooks_opti3"
                    castShadow
                    receiveShadow
                    geometry={nodes.hooks_opti3.geometry}
                    material={materials["default"]}
                    position={[0.03, 0.095, 0.075]}
                    rotation={[1.55, 0, 0]}
                    scale={0.02}
                />
                <mesh
                    name="hooks_opti4"
                    castShadow
                    receiveShadow
                    geometry={nodes.hooks_opti4.geometry}
                    material={materials["default"]}
                    position={[-0.10, 0.1, 0.012]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.02}
                />
                <mesh
                    name="hooks_opti5"
                    castShadow
                    receiveShadow
                    geometry={nodes.hooks_opti5.geometry}
                    material={materials["default"]}
                    position={[-0.13, 0.125, -0.11]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.02}
                />
            </group>
        </group>
    )
}