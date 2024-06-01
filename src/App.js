import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './App.css';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} />;
};

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [objectUrl, setObjectUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send prompt to server to generate 3D object
      const response = await axios.post('http://localhost:5003/process_prompt', { prompt });
      setObjectUrl(response.data.object_path);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className='form'>
        <h1>Generate 3D Object from Prompt</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Prompt:
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <button type="submit" disabled={isLoading}>
            Generate 3D Object
          </button>
        </form>
      </div>

      {isLoading && <p>Loading...</p>}

      {objectUrl && (
        <div className="canvas-container">
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            <Model url={objectUrl} />
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default App;
