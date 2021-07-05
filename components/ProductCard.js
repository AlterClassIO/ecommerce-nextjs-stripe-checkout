import Link from 'next/link';
import Image from 'next/image';
import { useShoppingCart } from '@/hooks/use-shopping-cart';
import { formatCurrency } from '@/lib/utils';
import { Rating } from '@/components/index';

const ProductCard = props => {
  const { addItem } = useShoppingCart();

  const handleOnAddToCart = event => {
    event.preventDefault();
    addItem(props);
  };

  return (
    <Link href={`/products/${props.id}`}>
      <a className="border rounded-md cursor-pointer p-6 group">
        {/* Product's image */}
        <div className="relative w-full h-64 group-hover:transform group-hover:scale-125 group-hover:ease-in-out group-hover:duration-500">
          <Image
            src={props.image}
            alt={props.name}
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* Name + Rating */}
        <div className="mt-4 sm:mt-8">
          <p className="font-semibold text-lg capitalize">{props.name}</p>
          <Rating rate={props?.rating?.rate} count={props?.rating?.count} />
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between space-x-2">
          <div>
            <p className="text-gray-500">Price</p>
            <p className="text-lg font-semibold">
              {formatCurrency(props.price, props.currency)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOnAddToCart}
            className="border rounded-lg py-1 px-4 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-colors"
          >
            Add to cart
          </button>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
