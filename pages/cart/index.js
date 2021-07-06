import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShoppingCart } from '@/hooks/use-shopping-cart';
import axios from 'axios';
import { formatCurrency } from '@/lib/utils';
import getStripe from '@/lib/get-stripe';
import { toast } from 'react-hot-toast';
import {
  XCircleIcon,
  XIcon,
  MinusSmIcon,
  PlusSmIcon,
} from '@heroicons/react/outline';

const Cart = () => {
  const { cartDetails, totalPrice, cartCount, addItem, removeItem, clearCart } =
    useShoppingCart();
  const [redirecting, setRedirecting] = useState(false);

  const redirectToCheckout = async () => {
    const createSesssionAndRedirect = async () => {
      setRedirecting(true);

      // Create Stripe checkout
      const {
        data: { id },
      } = await axios.post('/api/checkout_sessions', {
        items: Object.entries(cartDetails).map(([_, { id, quantity }]) => ({
          price: id,
          quantity,
        })),
      });

      // Redirect to checkout
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id });
    };

    toast.promise(createSesssionAndRedirect(), {
      loading: 'Redirecting...',
      error: () => {
        setRedirecting(false);
        return 'Something went wrong. Please try again later';
      },
    });
  };

  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
      {cartCount > 0 ? (
        <>
          <h2 className="text-4xl font-semibold">Your shopping cart</h2>
          <p className="mt-1 text-xl">
            {cartCount} items{' '}
            <button
              onClick={clearCart}
              className="opacity-50 hover:opacity-100 text-base capitalize"
            >
              (Clear all)
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-semibold">
            Your shopping cart is empty.
          </h2>
          <p className="mt-1 text-xl">
            Check out our awesome plants{' '}
            <Link href="/">
              <a className="text-red-500 underline">here!</a>
            </Link>
          </p>
        </>
      )}

      {cartCount > 0 ? (
        <div className="mt-12">
          {Object.entries(cartDetails).map(([key, product]) => (
            <div
              key={key}
              className="flex justify-between space-x-4 hover:shadow-lg hover:border-opacity-50 border border-opacity-0 rounded-md p-4"
            >
              {/* Image + Name */}
              <Link href={`/products/${product.id}`}>
                <a className="flex items-center space-x-4 group">
                  <div className="relative w-20 h-20 group-hover:scale-110 transition-transform">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <p className="font-semibold text-xl group-hover:underline">
                    {product.name}
                  </p>
                </a>
              </Link>

              {/* Price + Actions */}
              <div className="flex items-center">
                {/* Quantity */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => removeItem(product)}
                    disabled={product?.quantity <= 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current hover:bg-rose-100 hover:text-rose-500 rounded-md p-1"
                  >
                    <MinusSmIcon className="w-6 h-6 flex-shrink-0" />
                  </button>
                  <p className="font-semibold text-xl">{product.quantity}</p>
                  <button
                    onClick={() => addItem(product)}
                    className="hover:bg-green-100 hover:text-green-500 rounded-md p-1"
                  >
                    <PlusSmIcon className="w-6 h-6 flex-shrink-0 " />
                  </button>
                </div>

                {/* Price */}
                <p className="font-semibold text-xl ml-16">
                  <XIcon className="w-4 h-4 text-gray-500 inline-block" />
                  {formatCurrency(product.price)}
                </p>

                {/* Remove item */}
                <button
                  onClick={() => removeItem(product, product.quantity)}
                  className="ml-4 hover:text-rose-500"
                >
                  <XCircleIcon className="w-6 h-6 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-end border-t py-4 mt-8">
            <p className="text-xl">
              Total:{' '}
              <span className="font-semibold">
                {formatCurrency(totalPrice)}
              </span>
            </p>

            <button
              onClick={redirectToCheckout}
              disabled={redirecting}
              className="border rounded py-2 px-6 bg-rose-500 hover:bg-rose-600 border-rose-500 hover:border-rose-600 focus:ring-4 focus:ring-opacity-50 focus:ring-rose-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-500 max-w-max mt-4"
            >
              {redirecting ? 'Redirecting...' : 'Go to Checkout'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
