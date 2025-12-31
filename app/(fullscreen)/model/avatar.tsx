'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
    morphTargetInfluences?: Record<string, number>;
    onMorphTargetsLoaded?: (morphTargets: string[]) => void;
}

export function Avatar({ morphTargetInfluences = {}, onMorphTargetsLoaded }: AvatarProps) {
    const { scene, nodes } = useGLTF('/models/final.glb');
    const meshesRef = useRef<(THREE.Mesh | THREE.SkinnedMesh)[]>([]);
    const [morphTargetNames, setMorphTargetNames] = useState<string[]>([]);

    // Find all meshes with morph targets
    useEffect(() => {
        const meshesWithMorphs: (THREE.Mesh | THREE.SkinnedMesh)[] = [];
        const morphTargetSet = new Set<string>();

        scene.traverse((child) => {
            if ((child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) && child.morphTargetDictionary) {
                meshesWithMorphs.push(child);
                Object.keys(child.morphTargetDictionary).forEach((name) => {
                    morphTargetSet.add(name);
                });
            }
        });

        // Convert Set to sorted array for consistent ordering
        const uniqueMorphTargets = Array.from(morphTargetSet).sort();

        if (meshesWithMorphs.length > 0) {
            meshesRef.current = meshesWithMorphs;
            setMorphTargetNames(uniqueMorphTargets);
            onMorphTargetsLoaded?.(uniqueMorphTargets);
        }
    }, [scene, nodes, onMorphTargetsLoaded]);

    // Apply morph target influences to all meshes
    useFrame(() => {
        meshesRef.current.forEach((mesh) => {
            if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;

            const dict = mesh.morphTargetDictionary;
            const influences = mesh.morphTargetInfluences;

            Object.entries(morphTargetInfluences).forEach(([name, value]) => {
                const index = dict[name];
                if (index !== undefined) {
                    influences[index] = value;
                }
            });
        });
    });

    return (
        <primitive object={scene} position={[0, 0, 0]} />
    );
}
