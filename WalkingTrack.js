import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * Creates a walking track with directional arrows guiding players through the zoo
 */
export function createWalkingTrack(scene) {
  const trackWidth = 4;
  const arrowSpacing = 8;
  
  // Light beige/tan color for the track
  const trackColor = 0xE8D4B8;
  
  // Create track segments between waypoints
  const waypoints = CONFIG.PATH_WAYPOINTS;
  const arrows = [];
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i];
    const end = waypoints[i + 1];
    
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    
    // Create track segment
    const trackGeometry = new THREE.PlaneGeometry(trackWidth, length);
    const trackMaterial = new THREE.MeshStandardMaterial({ 
      color: trackColor,
      roughness: 0.8,
      metalness: 0.0
    });
    
    const trackSegment = new THREE.Mesh(trackGeometry, trackMaterial);
    trackSegment.rotation.x = -Math.PI / 2;
    trackSegment.rotation.z = angle;
    trackSegment.position.set(
      (start.x + end.x) / 2,
      0.02,
      (start.z + end.z) / 2
    );
    trackSegment.receiveShadow = true;
    scene.add(trackSegment);
    
    // Add dashed white lines on sides of track
    createDashedLines(scene, start, end, trackWidth, angle);
    
    // Add directional arrows along the segment
    const numArrows = Math.max(1, Math.floor(length / arrowSpacing));
    for (let j = 0; j < numArrows; j++) {
      const t = (j + 0.5) / numArrows;
      const x = start.x + dx * t;
      const z = start.z + dz * t;
      
      const arrow = createArrow(scene, x, z, angle);
      arrows.push(arrow);
    }
  }
  
  // Add circular intersections at waypoints
  waypoints.forEach((waypoint) => {
    const intersectionGeometry = new THREE.CircleGeometry(trackWidth / 2, 32);
    const intersectionMaterial = new THREE.MeshStandardMaterial({ 
      color: trackColor,
      roughness: 0.8,
      metalness: 0.0
    });
    
    const intersection = new THREE.Mesh(intersectionGeometry, intersectionMaterial);
    intersection.rotation.x = -Math.PI / 2;
    intersection.position.set(waypoint.x, 0.03, waypoint.z);
    intersection.receiveShadow = true;
    scene.add(intersection);
  });
  
  return { arrows };
}

/**
 * Create a directional arrow on the track
 */
function createArrow(scene, x, z, angle) {
  const arrowGroup = new THREE.Group();
  
  // Arrow body (rectangle)
  const bodyGeometry = new THREE.PlaneGeometry(0.6, 1.2);
  const arrowMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF, // White arrows
    roughness: 0.3,
    metalness: 0.0,
    transparent: true,
    opacity: 0.9
  });
  
  const body = new THREE.Mesh(bodyGeometry, arrowMaterial);
  body.rotation.x = -Math.PI / 2;
  body.position.y = 0.04; // Slightly above track
  arrowGroup.add(body);
  
  // Arrow head (triangle)
  const headShape = new THREE.Shape();
  headShape.moveTo(0, 0.8);
  headShape.lineTo(-0.6, 0);
  headShape.lineTo(0.6, 0);
  headShape.lineTo(0, 0.8);
  
  const headGeometry = new THREE.ShapeGeometry(headShape);
  const head = new THREE.Mesh(headGeometry, arrowMaterial);
  head.rotation.x = -Math.PI / 2;
  head.position.y = 0.04;
  head.position.z = 0.6; // Position at top of body
  arrowGroup.add(head);
  
  arrowGroup.position.set(x, 0, z);
  arrowGroup.rotation.y = angle;
  
  // Store initial rotation for animation
  arrowGroup.userData.initialRotation = angle;
  arrowGroup.userData.time = Math.random() * Math.PI * 2; // Random start phase
  
  scene.add(arrowGroup);
  return arrowGroup;
}

/**
 * Create dashed white lines on sides of track
 */
function createDashedLines(scene, start, end, trackWidth, angle) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dz * dz);
  
  const dashLength = 0.8;
  const gapLength = 0.6;
  const segmentLength = dashLength + gapLength;
  const numDashes = Math.floor(length / segmentLength);
  
  const lineMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    roughness: 0.5,
    metalness: 0.0
  });
  
  // Create dashes on both sides
  const offsets = [-trackWidth / 2 + 0.15, trackWidth / 2 - 0.15];
  
  offsets.forEach(offset => {
    for (let i = 0; i < numDashes; i++) {
      const t1 = (i * segmentLength) / length;
      const t2 = ((i * segmentLength) + dashLength) / length;
      
      const x1 = start.x + dx * t1;
      const z1 = start.z + dz * t1;
      const x2 = start.x + dx * t2;
      const z2 = start.z + dz * t2;
      
      const dashGeometry = new THREE.PlaneGeometry(0.15, dashLength);
      const dash = new THREE.Mesh(dashGeometry, lineMaterial);
      dash.rotation.x = -Math.PI / 2;
      dash.rotation.z = angle;
      dash.position.set(
        (x1 + x2) / 2 + Math.sin(angle) * offset,
        0.03,
        (z1 + z2) / 2 + Math.cos(angle) * offset
      );
      dash.receiveShadow = true;
      scene.add(dash);
    }
  });
}

/**
 * Animate arrows with subtle pulsing and glow effect
 */
export function animateWalkingTrack(arrows, deltaTime) {
  arrows.forEach(arrow => {
    // Update time
    arrow.userData.time += deltaTime * 2;
    
    // Subtle pulse animation
    const pulse = Math.sin(arrow.userData.time) * 0.1 + 1;
    arrow.scale.y = pulse;
    
    // Subtle opacity pulse
    arrow.children.forEach(child => {
      if (child.material) {
        child.material.opacity = 0.85 + Math.sin(arrow.userData.time) * 0.15;
      }
    });
  });
}
