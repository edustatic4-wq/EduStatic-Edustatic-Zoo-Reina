import { CONFIG } from './config.js';

/**
 * Simple minimap overlay to help navigate the large zoo
 */
export class Minimap {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'minimap';
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '20px';
    this.canvas.style.right = '20px';
    this.canvas.style.border = '3px solid white';
    this.canvas.style.borderRadius = '10px';
    this.canvas.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    this.canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '100';
    
    // Hide on mobile devices
    if (window.innerWidth <= 768) {
      this.canvas.style.display = 'none';
    }
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // Scale factor to fit zoo on minimap
    this.scale = 1.2;
    this.offsetX = this.canvas.width / 2;
    this.offsetY = this.canvas.height / 2;
  }
  
  /**
   * Convert world coordinates to minimap coordinates
   */
  worldToMap(x, z) {
    return {
      x: this.offsetX + x * this.scale,
      y: this.offsetY + z * this.scale
    };
  }
  
  /**
   * Update and render the minimap
   */
  update(playerPosition, enclosures) {
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    ctx.fillStyle = '#E8F5E9';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw paths (simplified)
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const waypoints = CONFIG.PATH_WAYPOINTS;
    waypoints.forEach((wp, i) => {
      const pos = this.worldToMap(wp.x, wp.z);
      if (i === 0) {
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    });
    ctx.stroke();
    
    // Draw themed area labels with colors
    this.drawAreaMarker('Safari', 0, -55, '#FFE4B5');
    this.drawAreaMarker('Water', 60, -5, '#B3E5FC');
    this.drawAreaMarker('Forest', -60, 10, '#A5D6A7');
    this.drawAreaMarker('Garden', 0, 62, '#FFCCBC');
    
    // Draw enclosures
    enclosures.forEach(enclosure => {
      const pos = this.worldToMap(enclosure.position.x, enclosure.position.z);
      
      ctx.fillStyle = '#8B7355';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#90EE90';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw player position
    const playerPos = this.worldToMap(playerPosition.x, playerPosition.z);
    
    // Player outer circle
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Player inner circle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Add "You are here" label for first few seconds
    if (Date.now() % 2000 < 1000) {
      ctx.fillStyle = '#FF6B9D';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You', playerPos.x, playerPos.y - 12);
    }
  }
  
  /**
   * Draw area marker on minimap
   */
  drawAreaMarker(name, worldX, worldZ, color) {
    const pos = this.worldToMap(worldX, worldZ);
    const ctx = this.ctx;
    
    // Area background
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Area label
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, pos.x, pos.y + 2);
  }
  
  /**
   * Clean up minimap
   */
  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
