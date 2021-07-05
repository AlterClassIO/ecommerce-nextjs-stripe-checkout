import { useState } from 'react';
import { useRouter } from 'next/router';
import { useShoppingCart } from '@/hooks/use-shopping-cart';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline';

import products from 'products';

const Product = props => {
  const router = useRouter();
  const { addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);

  const handleOnAddToCart = () => {
    addItem(props, qty);
    setQty(1);
  };

  return router.isFallback ? (
    <p className="text-center text-lg py-12">Loading...</p>
  ) : (
    <div className="container lg:max-w-screen-lg mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-12">
        {/* Product's image */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96">
          <Image
            src={props.image}
            alt={props.name}
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* Product's details */}
        <div className="flex-1 max-w-md border border-opacity-50 rounded-md shadow-lg p-6">
          <h2 className="text-3xl font-semibold">{props.name}</h2>
          <p>
            <span className="text-gray-500">Availability:</span>{' '}
            <span className="font-semibold">In stock</span>
          </p>

          {/* Price */}
          <div className="mt-8 border-t pt-4">
            <p className="text-gray-500">Price:</p>
            <p className="text-xl font-semibold">
              {formatCurrency(props.price)}
            </p>
          </div>

          <div className="mt-4 border-t pt-4">
            {/* Quantity */}
            <p className="text-gray-500">Quantity:</p>
            <div className="mt-1 flex items-center space-x-3">
              <button
                onClick={() => setQty(prev => prev - 1)}
                disabled={qty <= 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current hover:bg-rose-100 hover:text-rose-500 rounded-md p-1"
              >
                <MinusSmIcon className="w-6 h-6 flex-shrink-0" />
              </button>
              <p className="font-semibold text-xl">{qty}</p>
              <button
                onClick={() => setQty(prev => prev + 1)}
                className="hover:bg-green-100 hover:text-green-500 rounded-md p-1"
              >
                <PlusSmIcon className="w-6 h-6 flex-shrink-0 " />
              </button>
            </div>

            {/* Add to cart button */}
            <button
              type="button"
              onClick={handleOnAddToCart}
              className="mt-8 border rounded py-2 px-6 bg-rose-500 hover:bg-rose-600 border-rose-500 hover:border-rose-600 focus:ring-4 focus:ring-opacity-50 focus:ring-rose-500 text-white transition-colors"
            >
              Add to cart ({qty})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    // Existing posts are rendered to HTML at build time
    paths: Object.keys(products)?.map(id => ({
      params: { id },
    })),
    // Enable statically generating additional pages
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  try {
    const props = products?.find(product => product.id === params.id) ?? {};

    return {
      props,
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every second
      revalidate: 1, // In seconds
    };
  } catch (error) {
    return { notFound: true };
  }
}

export default Product;
