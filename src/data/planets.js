import { v4 as uuidv4 } from 'uuid';

export const planetsData = [
  {
    id: uuidv4(), // ✅ Generate UUID instead of "xylos"
    name: 'Planet Xylos',
    slug: 'xylos', // Keep the original name as slug
    type: 'Visionary',
    description: 'A mystical realm where creativity flows like liquid starlight...',
    traits: ['creative', 'imaginative', 'artistic', 'dreamer', 'visionary', 'ethereal', 'mystical'],
    image: '/images/planet-xylos.jpg',
    community_vibe: 'artistic and dreamy',
    element: 'air'
  },
  {
    id: uuidv4(), // ✅ Generate UUID instead of "zylos"
    name: 'Planet Zylos',
    slug: 'zylos', 
    type: 'Pioneer',
    description: 'A frontier world of endless adventures and uncharted territories...',
    traits: ['adventurous', 'explorer', 'pioneer', 'bold', 'dynamic', 'fearless', 'frontier'],
    image: '/images/planet-zylos.jpg', 
    community_vibe: 'adventurous and bold',
    element: 'fire'
  },
  {
    id: uuidv4(), // ✅ Generate UUID instead of "nilos"
    name: 'Planet Nilos',
    slug: 'nilos',
    type: 'Scholar',
    description: 'An advanced civilization dedicated to knowledge and innovation...',
    traits: ['intelligent', 'scholarly', 'innovative', 'logical', 'curious', 'analytical', 'wise'],
    image: '/images/planet-nilos.jpg',
    community_vibe: 'intellectual and innovative', 
    element: 'earth'
  }
];
