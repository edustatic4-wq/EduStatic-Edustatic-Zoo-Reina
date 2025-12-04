// Game Configuration
export const CONFIG = {
  // Display settings
  SCREEN_WIDTH: 1920,
  SCREEN_HEIGHT: 1080,
  ENABLE_SHADOWS: true,
  ENABLE_FOG: true,
  
  // Player settings
  PLAYER_MOVE_SPEED: 12,
  PLAYER_HEIGHT: 1.8,
  PLAYER_GROUND_LEVEL: 0.9,
  
  // Camera settings
  CAMERA_DISTANCE: 12,
  CAMERA_HEIGHT: 6,
  
  // Zoo layout - RECTANGULAR GRID
  ZOO_SIZE: 200,
  ENCLOSURE_COUNT: 13,
  
  // Interaction
  INTERACTION_DISTANCE: 10,
  
  // Colors - Warm pastel palette
  COLORS: {
    grass: 0x90EE90,
    path: 0xF5DEB3,
    sky: 0x87CEEB,
    fog: 0xFFE5B4,
    
    playerSkin: 0xFFDBB5,
    playerShirt: 0xFF6B9D,
    playerPants: 0x6B9BD1,
    playerHat: 0xFFA07A,
    
    fenceLight: 0xD2B48C,
    fenceDark: 0x8B7355,
    
    treeGreen: 0x7FBF7F,
    treeTrunk: 0x8B4513,
    flowers: [
      0xFFB6C1,
      0xFFD700,
      0xFF69B4,
      0xFFA500,
    ]
  },
  
  // Animal data organized in RECTANGULAR GRID layout
  // Zoo dimensions: 100 units wide × 150 units deep
  // Grid: 3 rows × 3 columns (but center bottom is path)
  ANIMALS: {
    // BOTTOM LEFT - Garden Zone
    garden: [
      {
        name: "🐼 Panda",
        description: "Adorable bears who love munching on bamboo all day!",
        color: 0x000000,
        position: { x: -35, z: 40 }
      },
      {
        name: "🦎 Lizard",
        description: "Colorful reptiles that love basking in warm sunshine!",
        color: 0x32CD32,
        position: { x: -35, z: 20 }
      }
    ],
    
    // BOTTOM RIGHT - Small Animals Zone
    smallAnimals: [
      {
        name: "🐰 Rabbit",
        description: "Fluffy hoppers with long ears who love munching carrots!",
        color: 0xF5DEB3,
        position: { x: 35, z: 40 }
      },
      {
        name: "🦓 Zebra",
        description: "Beautiful horses with black and white stripes!",
        color: 0x333333,
        position: { x: 35, z: 20 }
      }
    ],
    
    // MIDDLE LEFT - Forest Zone
    forest: [
      {
        name: "🐻 Bear",
        description: "Big fluffy animals who love honey and fish!",
        color: 0x8B4513,
        position: { x: -35, z: -10 }
      },
      {
        name: "🦉 Owl",
        description: "Wise night birds with big eyes who say 'hoot hoot!'",
        color: 0x8B7355,
        position: { x: -35, z: -30 }
      },
      {
        name: "🦘 Kangaroo",
        description: "Amazing jumpers from Australia who carry babies in pouches!",
        color: 0xD2691E,
        position: { x: -35, z: -50 }
      }
    ],
    
    // MIDDLE RIGHT - Water Zone
    water: [
      {
        name: "🐧 Penguin",
        description: "Tuxedo birds who waddle and are excellent swimmers!",
        color: 0x000000,
        position: { x: 35, z: -10 }
      },
      {
        name: "🦩 Flamingo",
        description: "Pink birds who stand on one leg and love to splash!",
        color: 0xFF69B4,
        position: { x: 35, z: -30 }
      },
      {
        name: "🐢 Turtle",
        description: "Slow and steady reptiles who carry their homes on their backs!",
        color: 0x228B22,
        position: { x: 35, z: -50 }
      }
    ],
    
    // TOP CENTER - Safari Zone (3 animals in back row)
    safari: [
      {
        name: "🦁 Lion",
        description: "The mighty king of the jungle! Lions love to nap in the sun.",
        color: 0xFFA500,
        position: { x: -20, z: -75 }
      },
      {
        name: "🐘 Elephant",
        description: "Gentle giants with amazing memories and long trunks!",
        color: 0x808080,
        position: { x: 0, z: -80 }
      },
      {
        name: "🦒 Giraffe",
        description: "The tallest animals on Earth with super long necks!",
        color: 0xFFD700,
        position: { x: 20, z: -75 }
      }
    ],
    
    // TOP RIGHT - Ice Cave Zone (Arctic animals)
    iceCave: [
      {
        name: "🐻‍❄️ Polar Bear",
        description: "Powerful Arctic bears with thick white fur who love the cold!",
        color: 0xFFFFFF,
        position: { x: 40, z: -85 }
      },
      {
        name: "🐧 Arctic Penguin",
        description: "Adorable waddling birds who slide on ice!",
        color: 0x000000,
        position: { x: 45, z: -65 }
      }
    ]
  },
  
  // Path waypoints for RECTANGULAR GRID - straight lines forming grid
  PATH_WAYPOINTS: [
    // Main central path - entrance to back (vertical spine)
    { x: 0, z: 55 },   // Entrance
    { x: 0, z: 45 },
    { x: 0, z: 35 },
    { x: 0, z: 25 },
    { x: 0, z: 15 },
    { x: 0, z: 5 },
    { x: 0, z: -5 },
    { x: 0, z: -15 },
    { x: 0, z: -25 },
    { x: 0, z: -35 },
    { x: 0, z: -45 },
    { x: 0, z: -55 },
    { x: 0, z: -65 },
    { x: 0, z: -75 },  // Back
    
    // Bottom horizontal path (garden and small animals level)
    { x: -45, z: 30 },
    { x: -35, z: 30 },
    { x: -25, z: 30 },
    { x: -15, z: 30 },
    { x: -5, z: 30 },
    { x: 5, z: 30 },
    { x: 15, z: 30 },
    { x: 25, z: 30 },
    { x: 35, z: 30 },
    { x: 45, z: 30 },
    
    // Middle horizontal path (forest and water level)
    { x: -45, z: -30 },
    { x: -35, z: -30 },
    { x: -25, z: -30 },
    { x: -15, z: -30 },
    { x: -5, z: -30 },
    { x: 5, z: -30 },
    { x: 15, z: -30 },
    { x: 25, z: -30 },
    { x: 35, z: -30 },
    { x: 45, z: -30 },
    
    // Left vertical path (connects garden-forest)
    { x: -35, z: 45 },
    { x: -35, z: 35 },
    { x: -35, z: 25 },
    { x: -35, z: 15 },
    { x: -35, z: 5 },
    { x: -35, z: -5 },
    { x: -35, z: -15 },
    { x: -35, z: -25 },
    { x: -35, z: -40 },
    { x: -35, z: -60 },
    
    // Right vertical path (connects small animals-water-ice cave)
    { x: 35, z: 45 },
    { x: 35, z: 35 },
    { x: 35, z: 25 },
    { x: 35, z: 15 },
    { x: 35, z: 5 },
    { x: 35, z: -5 },
    { x: 35, z: -15 },
    { x: 35, z: -25 },
    { x: 35, z: -40 },
    { x: 35, z: -60 },
    { x: 35, z: -70 },
    
    // Path to Ice Cave Zone (top right corner)
    { x: 40, z: -70 },
    { x: 45, z: -70 },
    
    // Path to Aquarium (top left corner)
    { x: -40, z: -60 },
    { x: -45, z: -65 },
    { x: -50, z: -70 }
  ]
};
