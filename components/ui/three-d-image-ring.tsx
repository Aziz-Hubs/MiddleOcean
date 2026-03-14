"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export interface ThreeDImageRingProps {
  /** Array of image URLs (unused in text mode but kept for prop parity) */
  images?: string[];
  /** Array of texts to display in the ring */
  texts?: string[];
  /** Container width in pixels */
  width?: number;
  /** Container height in pixels */
  height?: number;
  /** 3D perspective value */
  perspective?: number;
  /** Distance of items from center */
  imageDistance?: number;
  /** Initial rotation of the ring in degrees */
  initialRotation?: number;
  /** Animation duration for entrance (simulated) */
  animationDuration?: number;
  /** Stagger delay between items */
  staggerDelay?: number;
  /** Hover opacity (unused in Three.js but kept for parity) */
  hoverOpacity?: number;
  /** Enable/disable drag functionality */
  draggable?: boolean;
}

export function ThreeDImageRing({
  texts = [],
  width = 600,
  height = 400,
  perspective = 2000,
  imageDistance = 1500,
  initialRotation = 180,
  draggable = true,
}: ThreeDImageRingProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || texts.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.y = (initialRotation * Math.PI) / 180;
    scene.add(group);

    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const radius = imageDistance / 50; 
      
      texts.forEach((text, i) => {
        const textGeo = new TextGeometry(text, {
          font: font,
          size: 2.0,
          depth: 1.0, // Significant depth for "actually 3D"
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.05,
          bevelOffset: 0,
          bevelSegments: 5
        });

        textGeo.computeBoundingBox();
        const textWidth = textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x;
        const centerOffset = -0.5 * textWidth;

        const material = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          metalness: 0.9, 
          roughness: 0.1,
          transparent: true, // Enable transparency for fading
          opacity: 1,
          emissive: 0xffffff,
          emissiveIntensity: 0.2
        });
        
        const mesh = new THREE.Mesh(textGeo, material);
        mesh.position.x = centerOffset;

        // Facing Inward: Rotate the mesh so it faces the center
        const pivot = new THREE.Group();
        pivot.add(mesh);
        
        const angle = (i / texts.length) * Math.PI * 2;
        
        const itemGroup = new THREE.Group();
        itemGroup.add(pivot);
        itemGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        
        // Orient to face the center
        itemGroup.rotation.y = -angle - Math.PI / 2; 

        // Add a rainbow underline for visual flair
        const lineGeo = new THREE.BoxGeometry(textWidth + 1.5, 0.1, 0.1);
        const lineMat = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          emissive: 0xffffff, 
          emissiveIntensity: 2,
          transparent: true,
          opacity: 1
        });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(0, -1.5, 0.3);
        itemGroup.add(line);

        group.add(itemGroup);
      });
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2ff, 20);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00d4, 20);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 15);
    pointLight3.position.set(0, 0, 40);
    scene.add(pointLight3);

    camera.position.set(0, 0, 35);

    let isUserInteracting = false;
    let targetRotation = group.rotation.y;
    let mouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!draggable) return;
      isUserInteracting = true;
      mouseX = e.clientX;
      targetRotation = group.rotation.y;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isUserInteracting) return;
      const delta = (e.clientX - mouseX) * 0.005;
      group.rotation.y = targetRotation + delta;
    };

    const onMouseUp = () => {
      isUserInteracting = false;
    };

    if (draggable) {
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    const worldPos = new THREE.Vector3();
    const animate = () => {
      requestAnimationFrame(animate);
      if (!isUserInteracting) {
        group.rotation.y += 0.003;
      }

      // Visibility Logic: Hide items in the front hemisphere
      group.children.forEach((child) => {
        child.getWorldPosition(worldPos);
        
        // Calculate opacity based on Z position
        // Behind center (z < -5) -> opacity 1
        // Crossing center (z between -5 and 5) -> fade
        // Front (z > 5) -> opacity 0
        let opacity = 1;
        const fadeStart = -10;
        const fadeEnd = 0;
        
        if (worldPos.z > fadeEnd) {
          opacity = 0;
        } else if (worldPos.z > fadeStart) {
          opacity = 1 - (worldPos.z - fadeStart) / (fadeEnd - fadeStart);
        }

        // Apply opacity to all mesh children
        child.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.material.opacity = opacity;
            node.visible = opacity > 0;
          }
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [texts, width, height, imageDistance, initialRotation, draggable]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full flex items-center justify-center overflow-visible"
      style={{ cursor: draggable ? 'grab' : 'default' }}
    />
  );
}

export default ThreeDImageRing;
