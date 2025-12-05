"use client";

import { useState } from "react";
import { 
  FiPhone, 
  FiShoppingCart, 
  FiX, 
  FiSave,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import productsData from "@/data/products.json";
import { TransactionFormData, SubmissionState } from "./transaction/types";
import { createEmptyItem, calculateTotal, saveToLocalStorage, getProducts } from "./transaction/utils";
import { validateField, validateItemField, validateForm } from "./transaction/validation";
import SuccessToast from "./transaction/success-toast";
import ProductSearch from "./transaction/product-search";
import ProductItem from "./transaction/product-item";
import ConfirmModal from "./transaction/confirm-modal";

export default function CreateTransaction() {
  const [formData, setFormData] = useState<TransactionFormData>({
    phoneNumber: "",
    items: [createEmptyItem()],
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, Record<string, string>>>({});
  const [productSearch, setProductSearch] = useState<string>("");
  const [showProductResults, setShowProductResults] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const total = calculateTotal(formData.items);

  const allProducts = getProducts();

  const filteredProducts = productSearch
    ? allProducts
        .filter((product: typeof productsData[0]) => {
          const searchLower = productSearch.toLowerCase();
          return product.name.toLowerCase().includes(searchLower);
        })
        .slice(0, 5)
    : [];

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, createEmptyItem()],
    });
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id),
      });
    }
  };

  const addProductToForm = (product: typeof productsData[0], quantity: number = 1) => {
    const emptyItemIndex = formData.items.findIndex(
      (item) => !item.productName && !item.reference && (item.price === "" || item.price === 0)
    );

    const productData = {
      productName: product.name,
      reference: "",
      price: product.price,
      categoryId: product.categoryId,
      quantity: quantity,
    };

    if (emptyItemIndex !== -1) {
      const updatedItems = [...formData.items];
      updatedItems[emptyItemIndex] = {
        ...updatedItems[emptyItemIndex],
        ...productData,
      };
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...createEmptyItem(), ...productData }],
      });
    }
  };

  const addProductFromSearch = (product: typeof productsData[0], quantity: number = 1) => {
    addProductToForm(product, quantity);
    setProductSearch("");
    setShowProductResults(false);
  };


  const handleSearchEnter = (searchValue: string) => {
    const trimmedSearch = searchValue.trim();
    if (!trimmedSearch) return;

    const parts = trimmedSearch.split(/\s+/);
    const possibleQuantity = parseInt(parts[parts.length - 1]);
    const isQuantityValid = !isNaN(possibleQuantity) && possibleQuantity > 0;

    const firstMatch = filteredProducts[0];
    if (firstMatch) {
      const quantity = isQuantityValid ? possibleQuantity : 1;
      addProductFromSearch(firstMatch, quantity);
    }
  };

  const updateItem = (id: string, field: keyof typeof formData.items[0], value: string | number | "") => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
    validateItemField(id, field, value, formData.items, setItemErrors);
  };

  const confirmAndSubmit = async () => {
    setShowConfirmModal(false);
    setSubmissionState("loading");

    const products = formData.items.map((item) => ({
      productName: item.productName,
      productReference: item.reference,
      quantity: item.quantity,
      unitPrice: typeof item.price === "number" ? item.price : 0,
      productCategoryId: item.categoryId,
    }));

    const payload = {
      customerPhone: formData.phoneNumber,
      totalPrice: total,
      products: products,
    };

    try {
      const token = process.env.NEXT_PUBLIC_API_TOKEN || "";

      if (token) {
        const response = await fetch("https://dev-api-3ug2clvfq0vjtzzofva0.alyapay.com/api/v1/merchantapp/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await response.json();
          setSuccessMessage("Transaction has been saved to the server.");
          setShowSuccessToast(true);
          setSubmissionState("idle");
          resetFormAfterSuccess();
          setTimeout(() => setShowSuccessToast(false), 3000);
          return;
        }
      }

      const saved = saveToLocalStorage(payload);
      if (saved) {
        setSuccessMessage("Transaction has been saved locally (localStorage).");
        setShowSuccessToast(true);
        setSubmissionState("idle");
        setErrorMessage("");
        resetFormAfterSuccess();
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        throw new Error("Failed to save transaction locally");
      }
    } catch (error) {
      const saved = saveToLocalStorage(payload);
      if (saved) {
        setSuccessMessage("Transaction has been saved locally (localStorage).");
        setShowSuccessToast(true);
        setSubmissionState("idle");
        setErrorMessage("");
        resetFormAfterSuccess();
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setSubmissionState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while submitting"
        );
      }
    }
  };

  const resetFormAfterSuccess = () => {
    setFormData({
      phoneNumber: "",
      items: [createEmptyItem()],
    });
    setProductSearch("");
    setShowProductResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});
    setItemErrors({});

    if (!validateForm(formData, setFieldErrors, setItemErrors, setErrorMessage)) {
      setSubmissionState("error");
      return;
    }

    setShowConfirmModal(true);
  };

  const resetForm = () => {
    setFormData({
      phoneNumber: "",
      items: [createEmptyItem()],
    });
    setSubmissionState("idle");
    setErrorMessage("");
    setFieldErrors({});
    setItemErrors({});
    setProductSearch("");
    setShowProductResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SuccessToast
        show={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-normal text-gray-900">Create Transaction</h1>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    size="icon"
                    title="Cancel"
                  >
                    <FiX className="w-5 h-5" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={submissionState === "loading"}
                    variant="default"
                    size="icon"
                    title={submissionState === "loading" ? "Submitting..." : "Save"}
                  >
                    {submissionState === "loading" ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiSave className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="phoneNumber"
                className="block text-base font-normal text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <FiPhone className="w-5 h-5 text-blue-600" />
                  Client Phone Number
                </span>
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, phoneNumber: value });
                  validateField("phoneNumber", value, setFieldErrors);
                }}
                placeholder="0612345678"
                className={`h-12 text-base text-gray-900 ${fieldErrors.phoneNumber ? "border-red-500" : ""}`}
                required
              />
              {fieldErrors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-normal text-gray-700 flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5 text-blue-600" />
                  Transaction Items
                </h2>
              </div>

              <ProductSearch
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                showProductResults={showProductResults}
                setShowProductResults={setShowProductResults}
                filteredProducts={filteredProducts}
                onProductSelect={addProductFromSearch}
                onEnterPress={handleSearchEnter}
              />

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <ProductItem
                    key={item.id}
                    item={item}
                    index={index}
                    canRemove={formData.items.length > 1}
                    errors={itemErrors[item.id] || {}}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                    onValidate={(id, field, value) => validateItemField(id, field, value, formData.items, setItemErrors)}
                  />
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={addItem}
                  variant="default"
                >
                  Add Another Product
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-medium text-blue-600">
                  {total.toFixed(2)} Dh
                </span>
              </div>
            </div>
          </div>

          {submissionState === "error" && errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 font-normal">{errorMessage}</p>
              </div>
            </div>
          )}
        </form>

        <ConfirmModal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          formData={formData}
          total={total}
          onConfirm={confirmAndSubmit}
        />
      </div>
    </div>
  );
}
