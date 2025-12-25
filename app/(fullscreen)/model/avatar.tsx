'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import * as THREE from 'three';

export function Avatar() {
    const group = useRef<any>(null);
    // 1. Load the GLB model
    // Ensure you have a valid model at this path or handle the error
    const { scene } = useGLTF('/models/avatar-optimized.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const { animations: defeatedAnimations } = useFBX('/models/Defeated.fbx');
    defeatedAnimations[0].name = 'Defeated';
    const { actions } = useAnimations([defeatedAnimations[0]], group);

    useEffect(() => {
        if (!actions) return;
        // actions['Defeated']?.reset().play();
    }, [actions]);

    // Positioned to align the head near (0,0,0) based on typical RPM avatars. 
    // y = -1.65 usually centers the face of a standard 1.7m avatar at y=0.
    return (
        <group ref={group} dispose={null}>
            {/*  0, -1.65, 0*/}
            <primitive object={scene} position={[0, 1, -0.85]} />
        </group>
    )
}
