"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionFormData } from "./types";
import productCategories from "@/data/product-categories.json";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TransactionFormData;
  total: number;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  onOpenChange,
  formData,
  total,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="text-center text-blue-600 font-normal">
            Confirm Transaction
          </Dialog.Title>
          <Dialog.Description className="text-center">
            Please review the transaction details before submitting.
          </Dialog.Description>
        </Dialog.Header>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-md p-4">
            <div className="space-y-2 text-center">
              <div>
                <span className="text-sm font-medium text-gray-700">Customer Phone:</span>
                <p className="text-base text-gray-900 mt-1">{formData.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Products:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {formData.items.map((item, index) => {
                const category = productCategories.find((cat) => cat.id === item.categoryId);
                const itemTotal = (typeof item.price === "number" ? item.price : 0) * item.quantity;
                return (
                  <div key={item.id} className="border border-gray-200 rounded-md p-3 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {index + 1}. {item.productName || "Unnamed Product"}
                        </p>
                        {item.reference && (
                          <p className="text-xs text-gray-500 mt-1">Ref: {item.reference}</p>
                        )}
                        {category && (
                          <p className="text-xs text-gray-500">Category: {category.name}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>Price: {typeof item.price === "number" ? item.price.toFixed(2) : "0.00"} Dh</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {itemTotal.toFixed(2)} Dh
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-2xl font-medium text-blue-600">
                {total.toFixed(2)} Dh
              </span>
            </div>
          </div>
        </div>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onConfirm}
          >
            Confirm & Submit
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

