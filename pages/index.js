import Logo from '../components/Logo';
import Checkerboard from '../components/Checkerboard';

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden relative">
      <Logo />
      <Checkerboard />
    </main>
  );
}
