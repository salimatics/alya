"use client";

import { FiMinus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TransactionItem } from "./types";
import productCategories from "@/data/product-categories.json";

interface ProductItemProps {
  item: TransactionItem;
  index: number;
  canRemove: boolean;
  errors: Record<string, string>;
  onUpdate: (id: string, field: keyof TransactionItem, value: string | number | "") => void;
  onRemove: (id: string) => void;
  onValidate: (id: string, field: string, value: any) => void;
}

export default function ProductItem({
  item,
  index,
  canRemove,
  errors,
  onUpdate,
  onRemove,
  onValidate,
}: ProductItemProps) {
  const subtotal = ((typeof item.price === "number" ? item.price : 0) * item.quantity).toFixed(2);

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white hover:border-blue-400 transition-all duration-200 fade-in slide-in-from-bottom-2">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-normal text-gray-500">#{index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 cursor-pointer"
            aria-label="Remove product"
          >
            <FiMinus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-normal text-gray-700 mb-1">
            Product Name *
          </label>
          <Input
            type="text"
            value={item.productName}
            onChange={(e) => {
              const value = e.target.value;
              onUpdate(item.id, "productName", value);
              onValidate(item.id, "productName", value);
            }}
            placeholder="Product name"
            className={`h-10 text-sm ${errors.productName ? "border-red-500" : ""}`}
            required
          />
          {errors.productName && (
            <p className="text-xs text-red-600 mt-1">{errors.productName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-normal text-gray-700 mb-1">
            Category *
          </label>
          <Select
            value={item.categoryId}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              onUpdate(item.id, "categoryId", value);
              onValidate(item.id, "categoryId", value);
            }}
            className={`h-10 text-sm ${errors.categoryId ? "border-red-500" : ""}`}
            required
          >
            <option value="0">Select category</option>
            {productCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-red-600 mt-1">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-normal text-gray-700 mb-1">
            Reference
          </label>
          <Input
            type="text"
            value={item.reference}
            onChange={(e) => onUpdate(item.id, "reference", e.target.value)}
            placeholder="# Ref"
            className="h-10 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-normal text-gray-700 mb-1">
              Qty *
            </label>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                onUpdate(item.id, "quantity", value);
                onValidate(item.id, "quantity", value);
              }}
              className={`h-10 text-sm ${errors.quantity ? "border-red-500" : ""}`}
              required
            />
            {errors.quantity && (
              <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-normal text-gray-700 mb-1">
              Price *
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.price === "" ? "" : item.price}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === "") {
                  onUpdate(item.id, "price", "");
                  onValidate(item.id, "price", "");
                  return;
                }
                if (!/^\d*\.?\d*$/.test(inputValue)) {
                  onValidate(item.id, "price", inputValue);
                  return;
                }
                const value = parseFloat(inputValue) || "";
                onUpdate(item.id, "price", value);
                onValidate(item.id, "price", value);
              }}
              placeholder="0.00"
              className={`h-10 text-sm ${errors.price ? "border-red-500" : ""}`}
              required
            />
            {errors.price && (
              <p className="text-xs text-red-600 mt-1">{errors.price}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
        <span className="text-xs text-gray-600">Subtotal: </span>
        <span className="ml-2 font-medium text-sm text-blue-600">
          {subtotal} Dh
        </span>
      </div>
    </div>
  );
}

