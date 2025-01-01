import Logo from '../components/Logo';
import Checkerboard from '../components/Checkerboard';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-900">
      <Logo />
      <Checkerboard />
    </div>
  );
}
