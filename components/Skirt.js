import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Skirt(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/skirt-with-bag.glb");
  
  const firstTargetDirection = useRef('decreasing')
  const firstTarget = useRef(100);
  const firstMorphTargetAmount = useRef(0);

  const secondTargetDirection = useRef('increasing')
  const secondTarget = useRef(50);
  const secondMorphTargetAmount = useRef((4.3));

  console.log(nodes)
  
  useFrame((state, delta) => {
        nodes.Scene.children.forEach(mesh => {
            if (mesh.morphTargetInfluences) {
                const speed = 2.5;
                const firstMorphFactor = (Math.cos(firstMorphTargetAmount.current) + 1) / 2;
                firstMorphTargetAmount.current = firstMorphTargetAmount.current + (delta * speed);
                mesh.morphTargetInfluences.forEach((morphTarget) => { morphTarget = 0 })
                mesh.morphTargetInfluences[firstTarget.current] = firstMorphFactor;
                if (firstTargetDirection.current === 'increasing') {
                    if (firstMorphFactor > 0.9) {
                        firstTargetDirection.current = 'decreasing';
                    }
                }
  
                if (firstTargetDirection.current === 'decreasing') {
                    if (firstMorphFactor < 0.1) {
                        mesh.morphTargetInfluences[firstTarget.current] = 0;
                        firstTarget.current = Math.floor(Math.random() * mesh.morphTargetInfluences.length);
                        firstTargetDirection.current = 'increasing';
  
                    }
                }
  
  
                const secondMorphFactor = (Math.sin(secondMorphTargetAmount.current) + 1) / 2;
                secondMorphTargetAmount.current = secondMorphTargetAmount.current + (delta * speed);
                mesh.morphTargetInfluences[secondTarget.current] = secondMorphFactor;
                if (secondTargetDirection.current === 'increasing') {
                    if (secondMorphFactor > 0.9) {
                        secondTargetDirection.current = 'decreasing';
                    }
                }
                if (secondTargetDirection.current === 'decreasing') {
                    if (secondMorphFactor < 0.1) {
                        mesh.morphTargetInfluences[secondTarget.current] = 0;
                        secondTarget.current = Math.floor(Math.random() * mesh.morphTargetInfluences.length);
                        secondTargetDirection.current = 'increasing';
                    }
                }
            }
                
        });      
  });

  return (
    <group ref={group} key={Math.random()} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="bag_opti"
          castShadow
          receiveShadow
          geometry={nodes.bag_opti.geometry}
          material={materials["Default OBJ"]}
          position={[0, -0.68, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <mesh
          name="dress_body"
          castShadow
          receiveShadow
          geometry={nodes.dress_body.geometry}
          material={materials["default"]}
        />
        <mesh
          name="dress_opti_ani"
          castShadow
          receiveShadow
          geometry={nodes.dress_opti_ani.geometry}
          material={nodes.dress_opti_ani.material}
          morphTargetDictionary={nodes.dress_opti_ani.morphTargetDictionary}
          morphTargetInfluences={nodes.dress_opti_ani.morphTargetInfluences}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/skirt-with-bag.glb");