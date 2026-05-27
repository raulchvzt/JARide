import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { useInView } from 'react-intersection-observer'
import * as THREE from 'three'

const COLORES = [
  { label: '⬜ Blanco',    hex: '#ffffff' },
  { label: '⬛ Negro',     hex: '#111111' },
  { label: '🔴 Rojo',     hex: '#cc1111' },
  { label: '🔵 Azul',     hex: '#1133cc' },
  { label: '🟡 Amarillo', hex: '#f1c93a' },
  { label: '🟢 Verde',    hex: '#1a7a2a' },
]

// Materiales a excluir (nunca son carrocería)
const EXCLUIDOS = [
  'glass', 'window', 'windshield', 'windscreen',
  'tire', 'tyre', 'rubber', 'wheel',
  'light', 'lamp', 'headlight', 'taillight',
  'chrome', 'mirror', 'exhaust', 'brake',
  'interior', 'seat', 'dashboard', 'steering',
  'carpet', 'fabric', 'leather',
  'badge', 'logo', 'emblem', 'plate',
  'caliper', 'disc', 'rotor',
  'carbon', 'grille',
]

// Materiales que siempre van en negro fijo (solo Porsche 911)
const NEGRO_911 = [
  'wheel1a_3d',
  'rewardrecycled_2018badgea',
  'rewardrecycled_2018base_material',
]

function esExcluido(name) {
  return EXCLUIDOS.some(ex => name.includes(ex))
}

function CarModel({ url, color }) {
  const { scene } = useGLTF(url)

  // Escala y centrado
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(3 / maxDim)
    box.setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.y -= center.y
  }, [scene])

  // Negro fijo → solo Porsche 911
  useEffect(() => {
    if (!url.includes('porsche911')) return
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = (child.material.name || child.name || '').toLowerCase()
        if (NEGRO_911.some(n => name.includes(n))) {
          child.material = child.material.clone()
          child.material.color.set('#111111')
        }
      }
    })
  }, [scene, url])

  // Carrocería → color seleccionable (aplica a todos los modelos)
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = (child.material.name || child.name || '').toLowerCase()
        if (!esExcluido(name)) {
          child.material = child.material.clone()
          child.material.color.set(color)
        }
      }
    })
  }, [scene, color])

  return <primitive object={scene} />
}

export default function Car3DViewer({ modelUrl, colorInicial }) {
  const [colorActivo, setColorActivo] = useState(colorInicial || '#ffffff')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div ref={ref} style={{ marginBottom: 32 }}>
      {/* Visor */}
      <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', background: '#111' }}>
        {inView ? (
          <Canvas
            camera={{ position: [4, 2, 5], fov: 45 }}
            performance={{ min: 0.5 }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} intensity={1.2} castShadow />
            <Suspense fallback={null}>
              <CarModel url={modelUrl} color={colorActivo} />
              <Environment preset="city" />
              <ContactShadows position={[0, -1.5, 0]} opacity={0.5} blur={2} />
            </Suspense>
            <OrbitControls autoRotate={inView} autoRotateSpeed={1.5} enableZoom enablePan={false} />
          </Canvas>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: 13 }}>🚗 Cargando visor 3D...</p>
          </div>
        )}
      </div>

      {/* Selector de color */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        {COLORES.map(c => (
          <button key={c.hex} onClick={() => setColorActivo(c.hex)}
            style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all .2s',
              background: colorActivo === c.hex ? '#f1c98a20' : '#1a1a1a',
              border:     colorActivo === c.hex ? '1px solid #f1c98a' : '1px solid #2a2a2a',
              color:      colorActivo === c.hex ? '#f1c98a' : '#9ca3af',
            }}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

useGLTF.preload('/models/porsche-gt3/scene.gltf')
useGLTF.preload('/models/ford-raptor/scene.gltf')
useGLTF.preload('/models/lamborghini-svj/scene.gltf')
useGLTF.preload('/models/porsche911/scene.gltf')