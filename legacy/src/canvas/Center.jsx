/* eslint-disable react/no-unknown-property */
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader";
// eslint-disable-next-line react/prop-types
const Center = ({isMobile}) => {
  const center = useGLTF("./pokecenter/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="yellow" />
      <spotLight
      
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight intensity={0.5} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
      />
      <primitive
        object={center.scene}
        scale={isMobile ? 0.6 : 4}
        position={isMobile ? [0, -4, 0]: [0, -0.25, 0]}
        rotation={[-0.01, 1.25, -0.02]}
      />
    </mesh>
  );
};

const CenterCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    //Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia('(max-width: 400px)');

    //Set the initial value of the 'isMobile' state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    }
    //Add the Callback function as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);

    }
  }, [])

  return (
    <Canvas
    className="max-w-[250px] md:block hidden"
    frameloop='demand'
    shadows
    camera={{position: [20, 3, 5], fov: 25}}
    gl={{preserveDrawingBuffer:true}}>
      <Suspense fallback={<Loader/>}>
    <OrbitControls 
    autoRotate
    enableZoom={false}
    maxPolarAngle={Math.PI / 2}
    minPolarAngle={Math.PI / 2}/>
    <Center isMobile={isMobile}/>
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

export default CenterCanvas

