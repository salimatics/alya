"use client";

import { useState } from "react";
import { FiShoppingCart, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import productCategories from "@/data/product-categories.json";

interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  categoryId: number;
}

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onNewProductAdd: (product: Omit<Product, "id">) => void;
}

export default function ProductList({ products, onProductSelect, onNewProductAdd }: ProductListProps) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    reference: "",
    price: "",
    categoryId: 0,
  });

  const handleAddNewProduct = () => {
    if (!newProduct.name || !newProduct.reference || !newProduct.price || newProduct.categoryId === 0) {
      return;
    }

    onNewProductAdd({
      name: newProduct.name,
      reference: newProduct.reference,
      price: parseFloat(newProduct.price),
      categoryId: newProduct.categoryId,
    });

    setNewProduct({
      name: "",
      reference: "",
      price: "",
      categoryId: 0,
    });
    setShowAddProduct(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-normal text-gray-900 flex items-center gap-2">
          <FiShoppingCart className="w-5 h-5 text-blue-600" />
          Products
        </h2>
        <Button
          type="button"
          onClick={() => setShowAddProduct(!showAddProduct)}
          variant="outline"
          size="sm"
        >
          <FiPlus className="w-4 h-4 mr-1" />
          Add Product
        </Button>
      </div>

      {showAddProduct && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
          <div>
            <label className="block text-xs font-normal text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product name"
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-normal text-gray-700 mb-1">
              Reference *
            </label>
            <Input
              type="text"
              value={newProduct.reference}
              onChange={(e) => setNewProduct({ ...newProduct, reference: e.target.value })}
              placeholder="Product reference"
              className="h-9 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1">
                Category *
              </label>
              <Select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) || 0 })}
                className="h-9 text-sm"
              >
                <option value="0">Select category</option>
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-normal text-gray-700 mb-1">
                Price *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="0.00"
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddNewProduct}
              variant="default"
              size="sm"
              className="flex-1"
            >
              Save Product
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowAddProduct(false);
                setNewProduct({ name: "", reference: "", price: "", categoryId: 0 });
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
        {products.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No products available</p>
        ) : (
          products.map((product) => {
          const category = productCategories.find((cat) => cat.id === product.categoryId);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onProductSelect(product)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            >
              <div className="font-medium text-sm text-gray-900">{product.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {category?.name || "Unknown"}
              </div>
              <div className="text-sm font-medium text-blue-600 mt-1">
                {product.price.toFixed(2)} Dh
              </div>
            </button>
          );
          })
        )}
      </div>
    </div>
  );
}

