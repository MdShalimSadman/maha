'use client'; 

import { useState } from 'react';
import { Product } from '@/types/product';
import AddToCartButton from '@/components/cart/AddToCartButton';
import WishlistButton from '@/components/wishlist/WIshlistButton';

interface ProductInteractionProps {
  product: Product;
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product.sizes?.length ? product.sizes[0] : null
  );

  return (
    <>
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Select Size</h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 border rounded transition cursor-pointer hover:bg-[#A6686A] hover:text-white
                  ${
                    selectedSize === size
                      ? 'bg-[#A6686A] text-white border-[#A6686A]'
                      : 'border-[#A6686A] text-[#A6686A]'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
          {product.sizes.length > 0 && !selectedSize && (
            <p className="text-sm text-red-500 mt-2">Please select a size.</p>
          )}
        </div>
      )}

      <div className="flex gap-4 items-center">
        <AddToCartButton 
          product={product} 
          selectedSize={selectedSize} 
          disabled={!selectedSize && product.sizes && product.sizes.length > 0} 
        />
        <WishlistButton product={product} />
      </div>
    </>
  );
}