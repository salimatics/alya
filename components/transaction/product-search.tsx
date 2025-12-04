"use client";

import { useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import productCategories from "@/data/product-categories.json";

interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  categoryId: number;
}

interface ProductSearchProps {
  productSearch: string;
  setProductSearch: (value: string) => void;
  showProductResults: boolean;
  setShowProductResults: (value: boolean) => void;
  filteredProducts: Product[];
  onProductSelect: (product: Product) => void;
}

export default function ProductSearch({
  productSearch,
  setProductSearch,
  showProductResults,
  setShowProductResults,
  filteredProducts,
  onProductSelect,
}: ProductSearchProps) {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowProductResults]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search product by name or reference..."
          value={productSearch}
          onChange={(e) => {
            setProductSearch(e.target.value);
            setShowProductResults(true);
          }}
          onFocus={() => {
            if (productSearch) {
              setShowProductResults(true);
            }
          }}
          className="pl-10 h-12 text-base"
        />
      </div>
      {showProductResults && filteredProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => {
            const category = productCategories.find((cat) => cat.id === product.categoryId);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onProductSelect(product)}
                className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
              >
                <div className="font-medium text-sm text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Ref: {product.reference} • {category?.name || "Unknown"}
                </div>
                <div className="text-sm font-medium text-blue-600 mt-1">
                  {product.price.toFixed(2)} Dh
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

