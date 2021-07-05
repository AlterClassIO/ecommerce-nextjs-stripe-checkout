import Head from 'next/head';
import Image from 'next/image';
import { Rating } from '@/components/index';
import { HeartIcon as EmptyHeartIcon } from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';

import products from '../products';

export default function Home() {
  return (
    <>
      <Head>
        <title>
          E-commerce store built with Next.js and Stripe checkout | AlterClass
        </title>
        <meta
          name="description"
          content="E-commerce store built with Next.js and Stripe checkout by AlterClass.io"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="border rounded-md cursor-pointer p-6 group relative"
            >
              {/* Add to whishlist button */}
              <button
                onClick={null}
                className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded-lg border-rose-100 group-hover:border group-hover:bg-rose-100"
              >
                <EmptyHeartIcon className="w-6 h-6 text-rose-500" />
              </button>

              {/* Product's image */}
              <div className="relative w-full h-64 group-hover:transform group-hover:scale-125 group-hover:ease-in-out group-hover:duration-500">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>

              {/* Name + Rating */}
              <div className="mt-4 sm:mt-8">
                <p className="font-semibold text-lg capitalize">
                  {product.name}
                </p>
                <Rating
                  rate={product?.rating?.rate}
                  count={product?.rating?.count}
                />
              </div>

              {/* Price + CTA */}
              <div className="mt-4 flex items-center justify-between space-x-2">
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="text-lg font-semibold">$ {product.price}</p>
                </div>

                <button
                  type="button"
                  onClick={null}
                  className="border rounded-lg py-1 px-4 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
