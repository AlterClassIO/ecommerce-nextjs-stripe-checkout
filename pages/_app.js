import 'tailwindcss/tailwind.css';
import { CartProvider } from '@/hooks/use-shopping-cart';
import { Header } from '@/components/index';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </CartProvider>
  );
}

export default MyApp;
