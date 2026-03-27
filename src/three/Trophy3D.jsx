import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

function Trophy() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <meshStandardMaterial color="#F6BF3B" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.5, 32]} />
          <meshStandardMaterial color="#E3A21E" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.15, 32]} />
          <meshStandardMaterial color="#F6BF3B" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.25, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#E3A21E" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.25, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#E3A21E" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

export function Trophy3D({ size = 120, className = '' }) {
  return (
    <div className={`trophy-3d-container ${className}`} style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#75ACEC" />
        <Trophy />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

function Mate() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.3;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={meshRef}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.4, 16]} />
          <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.05, 16]} />
          <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

export function Mate3D({ size = 80, className = '' }) {
  return (
    <div className={`mate-3d-container ${className}`} style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Mate />
      </Canvas>
    </div>
  );
}