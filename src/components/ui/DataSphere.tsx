import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface DataSphereInnerProps {
  position?: [number, number, number];
}

const DataSphereInner: React.FC<DataSphereInnerProps> = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle geometry for data points
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.02,
      color: new THREE.Color(0.4, 0.7, 1),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Main sphere with distortion */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#4c9aff"
          transparent
          opacity={0.3}
          distort={0.1}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Particle cloud */}
      <points ref={particlesRef}>
        <primitive object={particleGeometry} />
        <primitive object={particleMaterial} />
      </points>
      
      {/* Inner glow sphere */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial
          color="#6b46ff"
          transparent
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
};

interface DataSphereProps {
  className?: string;
  size?: number;
}

export const DataSphere: React.FC<DataSphereProps> = ({ className = "", size = 300 }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#4c9aff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#9c40ff" />
        <DataSphereInner />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={1}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};