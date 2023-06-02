import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, MeshReflectorMaterial, MeshTransmissionMaterial, useTexture, MeshRefractionMaterial } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { Color, CubeTextureLoader, MeshPhysicalMaterial, MeshStandardMaterial, TextureLoader, UVMapping } from "three";

export default function Skirt({ model, pageTitle, isActive }) {
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
    materials['dress-baked'].bumpMap = clothBump;
    materials['dress-baked'].bumpScale = 0.0025;
  }, [materials, nodes, clothBump] )

  useFrame((state, delta) => {
    if (isActive) {
        ref.current.rotation.y += delta/9;
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
      <group ref={ref} dispose={null}>
          <group name="Scene" scale={4}>
              <mesh
                  name="bag_opti"
                  castShadow
                  receiveShadow
                  geometry={nodes.bag_opti.geometry}
                  material={materials["Default OBJ"]}
                  position={[-0.01, -0.7, -0.02]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={0.0104}
              >
                <meshStandardMaterial color="rgb(143, 145, 135)" bumpMap={clothBump} bumpScale={0.01}/>
              </mesh>
              <mesh
                  name="dress_body"
                  castShadow
                  receiveShadow
                  geometry={nodes.dress_body.geometry}
                  material={materials["default"]}
              >
                  {/* <MeshRefractionMaterial envMap={texture} bounces={1} ior={1.25} fastChroma /> */}
                  <MeshTransmissionMaterial background={texture} transmission={1} chromaticAberration={0.2} distortion={2} thickness={10} distortionScale={0.5} roughness={0.2}/>
              </mesh>
              <mesh
                  name="dress_opti_ani"
                  castShadow
                  receiveShadow
                  geometry={nodes.dress_opti_ani.geometry}
                  material={nodes.dress_opti_ani.material}
                  morphTargetDictionary={nodes.dress_opti_ani.morphTargetDictionary}
                  morphTargetInfluences={nodes.dress_opti_ani.morphTargetInfluences}
            //   
                >
                </mesh>
              {/* <mesh
                position={[0, -0.69, 0]}
                rotation={[-Math.PI/2,0,0]}
              >
                <planeBufferGeometry args={[100,100, 100, 100]} />
                <meshStandardMaterial wireframe color={'beige'} receiveShadow={false} />
              </mesh> */}
          </group>
      </group>
  )
}