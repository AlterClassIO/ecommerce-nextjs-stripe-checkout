import { StarIcon as EmptyStarIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';

const Rating = ({ rate = 0, count = 0, max = 5 }) => {
  const roundedRate = Math.round(rate);

  return (
    <div className="flex items-center -ml-1">
      {[...new Array(roundedRate)].map((_, i) => (
        <StarIcon key={i} className="w-6 h-6 flex-shrink-0 text-yellow-400" />
      ))}
      {[...new Array(max - roundedRate)].map((_, i) => (
        <EmptyStarIcon
          key={i}
          className="w-5 h-5 flex-shrink-0 text-yellow-400"
        />
      ))}
      <span className="ml-2 text-gray-500">({count})</span>
    </div>
  );
};

export default Rating;
