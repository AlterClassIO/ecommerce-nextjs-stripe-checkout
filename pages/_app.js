import 'tailwindcss/tailwind.css';
import { Logo } from '@/components/index';
import { ShoppingCartIcon } from '@heroicons/react/solid';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <header className="sticky top-0 bg-white z-10 shadow">
        <div className="container mx-auto p-6 flex justify-between">
          <Logo />
          <div className="flex items-center space-x-1">
            <ShoppingCartIcon className="w-6 h-6 flex-shrink-0" />
            <span className="text-lg">$0.00</span>
          </div>
        </div>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
