import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await login(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    navigate('/');
  };

  const generateWindows = (width, height) => {
    const windows = [];
    const windowSize = 10;
    const windowSpacing = 15;
    const windowsPerRow = Math.floor((width - 10) / windowSpacing);
    const windowsPerColumn = Math.floor((height - 10) / windowSpacing);

    for (let row = 0; row < windowsPerColumn; row++) {
      for (let col = 0; col < windowsPerRow; col++) {
        const isLit = Math.random() > 0.3;
        windows.push(
          <div
            key={`${row}-${col}`}
            className="building-window"
            style={{
              width: `${windowSize}px`,
              height: `${windowSize}px`,
              left: `${5 + col * windowSpacing}px`,
              top: `${5 + row * windowSpacing}px`,
              opacity: isLit ? 0.8 : 0.2,
            }}
          />
        );
      }
    }
    return windows;
  };

  const generateBuildings = () => {
    const buildings = [];
    const numBuildings = 40;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 300;

    for (let i = 0; i < numBuildings; i++) {
      const angle = (i / numBuildings) * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const height = Math.random() * 200 + 150;
      const width = Math.random() * 40 + 30;
      const depth = Math.random() * 40 + 30;
      const delay = Math.random() * 4;

      buildings.push(
        <div
          key={i}
          className="building"
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${z}px)`,
          }}
        >
          <div
            className="building-model"
            style={{ '--delay': delay }}
          >
            {/* Front face */}
            <div
              className="building-face"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotateY(0deg) translateZ(${depth/2}px)`,
              }}
            >
              {generateWindows(width, height)}
            </div>
            {/* Back face */}
            <div
              className="building-face"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotateY(180deg) translateZ(${depth/2}px)`,
              }}
            >
              {generateWindows(width, height)}
            </div>
            {/* Left face */}
            <div
              className="building-face"
              style={{
                width: `${depth}px`,
                height: `${height}px`,
                transform: `rotateY(-90deg) translateZ(${width/2}px)`,
              }}
            >
              {generateWindows(depth, height)}
            </div>
            {/* Right face */}
            <div
              className="building-face"
              style={{
                width: `${depth}px`,
                height: `${height}px`,
                transform: `rotateY(90deg) translateZ(${width/2}px)`,
              }}
            >
              {generateWindows(depth, height)}
            </div>
            {/* Top face */}
            <div
              className="building-face"
              style={{
                width: `${width}px`,
                height: `${depth}px`,
                transform: `rotateX(90deg) translateZ(${height}px)`,
              }}
            />
          </div>
        </div>
      );
    }
    return buildings;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="city-background">
        <div className="city-container">
          <div className="city-grid" />
          <div className="buildings">
            {generateBuildings()}
          </div>
        </div>
        <div className="glow" />
      </div>

      <div className="w-full max-w-md space-y-8 bg-black/50 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-center text-white">
            NCD-OS
          </h1>
          <p className="mt-2 text-center text-white/60">Sign in to your account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/80 px-4">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border-white/20 focus:border-white text-white rounded-full h-12 px-6"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/80 px-4">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border-white/20 focus:border-white text-white rounded-full h-12 px-6"
              placeholder="Enter your password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
