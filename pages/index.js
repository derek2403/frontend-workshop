import Logo from '../components/Logo';
import Checkerboard from '../components/Checkerboard';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <Logo />
      <Checkerboard />
    </div>
  );
}
