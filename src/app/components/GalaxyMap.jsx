'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 🔧 ADDED: Utility function to convert 3D position to screen coordinates
function getScreenPosition(worldPosition, camera, canvas) {
  const vector = new THREE.Vector3(...worldPosition);
  vector.project(camera);

  const x = (vector.x + 1) / 2 * canvas.clientWidth;
  const y = (-vector.y + 1) / 2 * canvas.clientHeight;

  return { x, y };
}

// 🔧 FIXED: Planet Component - Accept planetData prop
function Planet({ position, color, name, type, userCount, planetData, onHover, onLeave }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const { camera, gl } = useThree();

  // Load planet texture based on name
  const getTexturePath = (planetName) => {
    const textureMap = {
      'Planet Xylos': '/images/planet-xylos-wrapper.jpg',
      'Planet Zylos': '/images/planet-zylos-wrapper.jpg',
      'Planet Nilos': '/images/planet-nilos-wrapper.jpg'
    };
    return textureMap[planetName];
  };

  let planetTexture = null;
  try {
    const texturePath = getTexturePath(name);
    if (texturePath) {
      planetTexture = useTexture(texturePath);
    }
  } catch (error) {
    console.warn(`Failed to load texture for ${name}, using color fallback`);
    planetTexture = null;
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef} scale={2.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          // 🔧 FIX: Pass complete planet data
          const canvas = gl.domElement;
          const screenPos = getScreenPosition(position, camera, canvas);
          onHover(screenPos, {
            type: 'planet',
            planet: planetData, // Use complete planetData object
            userCount
          });
        }}
        onPointerOut={onLeave}
      >
        <sphereGeometry args={[1, 32, 32]} />
        {planetTexture ? (
          <meshStandardMaterial
            map={planetTexture}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.6}
            metalness={0.2}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.6}
            metalness={0.2}
          />
        )}
      </mesh>

      <Text
        position={[0, -1.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

// Orbiting User Component with Dynamic Tooltip Position
function OrbitingUser({ planetPosition, angle, radius, user, planetColor, onHover, onLeave }) {
  const meshRef = useRef();
  const wrapperRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  // Load userwrapper texture
  const wrapperTexture = useTexture('/images/userwrapper.png');

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * 0.3;
      const currentAngle = angle + time;
      const x = planetPosition[0] + Math.cos(currentAngle) * radius;
      const y = planetPosition[1] + Math.sin(time * 0.5 + angle) * 0.2;
      const z = planetPosition[2] + Math.sin(currentAngle) * radius;
      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (meshRef.current) {
          const worldPos = new THREE.Vector3();
          meshRef.current.getWorldPosition(worldPos);
          const canvas = gl.domElement;
          const screenPos = getScreenPosition([worldPos.x, worldPos.y, worldPos.z], camera, canvas);
          onHover(screenPos, { type: 'user', user });
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onLeave();
      }}
      scale={hovered ? 1.5 : 1}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial
        color={hovered ? "yellow" : "white"}
      />
    </mesh>
  );
}

// Background Stars
function Stars() {
  const starsRef = useRef();

  useEffect(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    starsRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, []);

  return (
    <points>
      <bufferGeometry ref={starsRef} />
      <pointsMaterial color="white" size={0.3} sizeAttenuation={false} />
    </points>
  );
}

// 3D Scene Component
function GalaxyScene({ planetsData, usersData, onPlanetHover, onPlanetLeave, onUserHover, onUserLeave }) {
  const usersByPlanet = {};

  console.log('🌌 === DEBUGGING GALAXY DATA ===');
  console.log('📊 Planets:', planetsData.map(p => ({ id: p.id, name: p.name })));

  const planetNameToId = {};
  planetsData.forEach(planet => {
    planetNameToId[planet.name] = planet.id;
    planetNameToId[planet.name.toLowerCase()] = planet.id;
    if (planet.slug) {
      planetNameToId[planet.slug] = planet.id;
    }
  });

  usersData.forEach((user, index) => {
    let planetId = null;

    if (user.matched_planet?.id) {
      const directMatch = planetsData.find(p => p.id === user.matched_planet.id);
      if (directMatch) {
        planetId = directMatch.id;
      }
    }

    if (!planetId && user.matched_planet?.name) {
      planetId = planetNameToId[user.matched_planet.name];
    }

    if (!planetId && user.matched_planet?.name) {
      const matchingPlanet = planetsData.find(planet =>
        planet.name.toLowerCase().includes(user.matched_planet.name.toLowerCase()) ||
        user.matched_planet.name.toLowerCase().includes(planet.name.toLowerCase())
      );
      if (matchingPlanet) {
        planetId = matchingPlanet.id;
      }
    }

    if (planetId) {
      if (!usersByPlanet[planetId]) {
        usersByPlanet[planetId] = [];
      }
      usersByPlanet[planetId].push(user);
    }
  });

  const planetPositions = [
    [0, 0, 0],     // Planet Xylos
    [8, 0, 0],     // Planet Zylos  
    [-8, 0, 0]     // Planet Nilos
  ];

  const planetColors = {
    'Planet Xylos': '#9d4edd',
    'Planet Zylos': '#f72585',
    'Planet Nilos': '#4cc9f0'
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4cc9f0" />

      <Stars />

      {planetsData.map((planet, index) => {
        const position = planetPositions[index] || [index * 5, 0, 0];
        const color = planetColors[planet.name] || '#ffffff';
        const userCount = usersByPlanet[planet.id]?.length || 0;

        return (
          <Planet
            key={planet.id}
            position={position}
            color={color}
            name={planet.name}
            type={planet.type}
            userCount={userCount}
            planetData={planet} // 🔧 Pass complete planet object
            onHover={onPlanetHover}
            onLeave={onPlanetLeave}
          />
        );
      })}

      {planetsData.map((planet) => {
        const users = usersByPlanet[planet.id] || [];
        const planetIndex = planetsData.indexOf(planet);
        const position = planetPositions[planetIndex] || [planetIndex * 5, 0, 0];
        const color = planetColors[planet.name] || '#ffffff';

        if (users.length === 0) return null;

        return users.map((user, userIndex) => {
          const angle = users.length > 0 ? (2 * Math.PI * userIndex) / users.length : 0;
          const radiusBase = 1.2;
          const radiusVariation = (userIndex % 3) * 0.2;
          const radius = radiusBase + radiusVariation;

          return (
            <OrbitingUser
              key={`${planet.id}-user-${user._id || user.name || userIndex}`}
              planetPosition={position}
              angle={angle}
              radius={radius}
              user={user}
              planetColor={color}
              onHover={onUserHover}
              onLeave={onUserLeave}
            />
          );
        });
      })}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={30}
      />
    </>
  );
}

// Main Galaxy Map Component
const GalaxyMap = () => {
  const [planetsData, setPlanetsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalaxyData();
  }, []);

  const fetchGalaxyData = async () => {
    try {
      setLoading(true);
      const [planetsResponse, usersResponse] = await Promise.all([
        fetch('/api/galaxy/planets'),
        fetch('/api/galaxy/users')
      ]);

      if (!planetsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch galaxy data');
      }

      const planets = await planetsResponse.json();
      const users = await usersResponse.json();

      setPlanetsData(planets);
      setUsersData(users);
    } catch (error) {
      console.error('❌ Error fetching galaxy data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FIXED: Complete planet hover handler
  const handlePlanetHover = (screenPos, data) => {
    if (data.type === 'planet') {
      setTooltip({
        show: true,
        x: screenPos.x,
        y: screenPos.y - 60,
        content: (
          <div className="text-white">
            <div className="font-bold text-lg">{data.planet.name}</div>
            <div className="text-sm opacity-75">{data.planet.type}</div>
            <div className="text-xs mt-1">
              {data.planet.description?.substring(0, 80)}...
            </div>
            <div className="text-sm mt-2 font-semibold">
              🌟 Community: {data.userCount} cosmic twins
            </div>
            <div className="text-xs mt-1">
              <strong>Traits:</strong> {data.planet.traits?.join(', ')}
            </div>
          </div>
        )
      });
    }
  };

  const handleUserHover = (screenPos, data) => {
    if (data.type === 'user') {
      setTooltip({
        show: true,
        x: screenPos.x,
        y: screenPos.y - 80,
        content: (
          <div className="text-white">
            <div className="font-bold">👤 {data.user.name}</div>
            <div className="text-sm">
              🪐 <strong>Planet:</strong> {data.user.matched_planet?.name || 'Unknown'}
            </div>
            <div className="text-sm">
              ✨ <strong>Type:</strong> {data.user.matched_planet?.type || 'Unknown'}
            </div>
            <div className="text-xs mt-1">
              🎯 <strong>Compatibility:</strong> {Math.round((data.user.matched_planet?.similarity_score || 0.75) * 100)}%
            </div>
          </div>
        )
      });
    }
  };

  const handleHoverLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Loading Galaxy...</h2>
          <p className="text-sm opacity-75">Fetching cosmic twins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 text-white z-10 bg-black bg-opacity-50 p-3 rounded-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-purple-400">
            <path d="M12 2L13.5 7.5L19 6L15 10.5L21 12L15 13.5L19 18L13.5 16.5L12 22L10.5 16.5L5 18L9 13.5L3 12L9 10.5L5 6L10.5 7.5L12 2Z" />
          </svg> Cosmic Twin Galaxy</h2>
        <p className="text-sm opacity-75">
          {planetsData.length} planets • {usersData.length} cosmic twins
        </p>
        <p className="text-xs opacity-50 mt-1">
          Drag to orbit • Scroll to zoom • Hover for details
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        style={{
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle, #1a1a2e 0%, #0f0f0f 100%)'
        }}
      >
        <GalaxyScene
          planetsData={planetsData}
          usersData={usersData}
          onPlanetHover={handlePlanetHover}
          onPlanetLeave={handleHoverLeave}
          onUserHover={handleUserHover}
          onUserLeave={handleHoverLeave}
        />
      </Canvas>

      {/* 🔧 FIXED: Enhanced Tooltip with Complete Planet Data */}
      {tooltip.show && (
        <div
          className="absolute pointer-events-none z-20 bg-black bg-opacity-90 p-4 rounded-lg border border-purple-500"
          style={{
            left: `${Math.min(tooltip.x, window.innerWidth - 300)}px`,
            top: `${Math.max(tooltip.y, 10)}px`,
            transform: tooltip.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
            maxWidth: '300px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-70 p-3 rounded-lg border border-gray-600">
        <div className="space-y-2">
          <div className="font-semibold mb-1">🌟 Planet Types</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Xylos (Visionary)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span>Zylos (Pioneer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Nilos (Scholar)</span>
          </div>
          <div className="text-xs opacity-75 mt-2">
            Each white dot = 1 cosmic twin
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyMap;
