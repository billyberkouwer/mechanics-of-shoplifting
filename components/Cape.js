import React, { useMemo, useRef } from "react";
import { useGLTF, useAnimations, MeshReflectorMaterial, MeshTransmissionMaterial, useTexture, MeshRefractionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Color, CubeTextureLoader } from "three";

export default function Cape({ model, pageTitle, isActive }) {
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

    useFrame((state, delta) => {
        if (isActive) {
            ref.current.rotation.y += delta / 9;
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
        <group ref={ref} dispose={null} scale={4}>
            <group name="Scene">
                <mesh
                    name="3_z"
                    castShadow
                    receiveShadow
                    geometry={nodes["3_z"].geometry}
                    material={nodes["3_z"].material}
                    morphTargetDictionary={nodes["3_z"].morphTargetDictionary}
                    morphTargetInfluences={nodes["3_z"].morphTargetInfluences}
                    position={[0, 0.44, -0.01]}
                >
                    <meshStandardMaterial color={'rgb(89, 41, 54)'} roughness={1} specularColor={'rgb(89, 54, 63)'} bumpMap={clothBump} bumpScale={0.005}/>
                </mesh>
                <mesh
                    name="6k_wood_arm"
                    castShadow
                    receiveShadow
                    geometry={nodes["6k_wood_arm"].geometry}
                    material={materials["default.002"]}
                    position={[-0.26, 0.44, 0.08]}
                >
                    <meshStandardMaterial color={'rgb(145, 135, 121)'} roughness={0.1} specularColor={'rgb(89, 54, 63)'}/>
                </mesh>
                <mesh
                    name="ornate_leg_base_onlyobj"
                    castShadow
                    receiveShadow
                    geometry={nodes.ornate_leg_base_onlyobj.geometry}
                    material={materials["default"]}
                    position={[0.01, -0.55, 0]}
                >
                    <meshStandardMaterial color={'rgb(31, 15, 19)'} roughness={1} specularColor={'rgb(89, 54, 63)'}/>
                </mesh>
                <mesh
                    name="Genesis8_1FemaleShape"
                    castShadow
                    receiveShadow
                    geometry={nodes.Genesis8_1FemaleShape.geometry}
                    material={materials["default.001"]}
                    position={[0.03, 0.35, 0.03]}
                >  
                
                <MeshTransmissionMaterial background={texture} transmission={1} chromaticAberration={0.2} distortion={2} thickness={10} distortionScale={0.5} roughness={0.2}/>
                </mesh>
            </group>
        </group>
    )
}