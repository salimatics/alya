"use client";

import { useState } from "react";
import { z } from "zod";
import { 
  FiCheckCircle, 
  FiPhone, 
  FiShoppingCart, 
  FiPlus, 
  FiTrash2, 
  FiX, 
  FiSave,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionItem {
  id: string;
  productName: string;
  reference: string;
  quantity: number;
  price: number | "";
}

interface TransactionFormData {
  phoneNumber: string;
  items: TransactionItem[];
}

type SubmissionState = "idle" | "loading" | "success" | "error";

const transactionItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  reference: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
});

const transactionSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  items: z.array(transactionItemSchema).min(1, "At least one product is required"),
});

export default function CreateTransaction() {
  const [formData, setFormData] = useState<TransactionFormData>({
    phoneNumber: "",
    items: [
      {
        id: crypto.randomUUID(),
        productName: "",
        reference: "",
        quantity: 1,
        price: "",
      },
    ],
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, Record<string, string>>>({});

  const total = formData.items.reduce(
    (sum, item) => sum + (typeof item.price === "number" ? item.price : 0) * item.quantity,
    0
  );

  const addItem = () => {
    const newItem: TransactionItem = {
      id: crypto.randomUUID(),
      productName: "",
      reference: "",
      quantity: 1,
      price: "" as "",
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
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

  const validateField = (fieldName: string, value: any) => {
    try {
      if (fieldName === "phoneNumber") {
        if (value && !/^\d+$/.test(value)) {
          setFieldErrors({ ...fieldErrors, phoneNumber: "Phone number should contain only numbers" });
          return;
        }
        z.string().min(1, "Phone number is required").parse(value);
        setFieldErrors({ ...fieldErrors, phoneNumber: "" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors({ ...fieldErrors, [fieldName]: error.issues[0].message });
      }
    }
  };

  const validateItemField = (itemId: string, fieldName: string, value: any) => {
    try {
      const item = formData.items.find((i) => i.id === itemId);
      if (!item) return;

      if (fieldName === "productName") {
        z.string().min(1, "Product name is required").parse(value);
        setItemErrors({
          ...itemErrors,
          [itemId]: { ...itemErrors[itemId], productName: "" },
        });
      } else if (fieldName === "quantity") {
        z.number().min(1, "Quantity must be at least 1").parse(value);
        setItemErrors({
          ...itemErrors,
          [itemId]: { ...itemErrors[itemId], quantity: "" },
        });
      } else if (fieldName === "price") {
        if (value === "" || value === null || value === undefined) {
          setItemErrors({
            ...itemErrors,
            [itemId]: { ...itemErrors[itemId], price: "Price is required" },
          });
          return;
        }
        if (typeof value === "string" && value !== "" && !/^\d*\.?\d*$/.test(value)) {
          setItemErrors({
            ...itemErrors,
            [itemId]: { ...itemErrors[itemId], price: "Price should contain only numbers" },
          });
          return;
        }
        z.number().min(0, "Price must be greater than or equal to 0").parse(value);
        setItemErrors({
          ...itemErrors,
          [itemId]: { ...itemErrors[itemId], price: "" },
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setItemErrors({
          ...itemErrors,
          [itemId]: { ...itemErrors[itemId], [fieldName]: error.issues[0].message },
        });
      }
    }
  };

  const updateItem = (id: string, field: keyof TransactionItem, value: string | number | "") => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
    validateItemField(id, field, value);
  };

  const validateForm = (): boolean => {
    setFieldErrors({});
    setItemErrors({});
    setErrorMessage("");

    try {
      const validationData = {
        phoneNumber: formData.phoneNumber,
        items: formData.items.map((item) => ({
          productName: item.productName,
          reference: item.reference,
          quantity: item.quantity,
          price: typeof item.price === "number" ? item.price : 0,
        })),
      };

      transactionSchema.parse(validationData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newFieldErrors: Record<string, string> = {};
        const newItemErrors: Record<string, Record<string, string>> = {};

        error.issues.forEach((err) => {
          const path = err.path;
          
          if (path[0] === "phoneNumber") {
            newFieldErrors.phoneNumber = err.message;
          } else if (path[0] === "items") {
            const itemIndex = path[1] as number;
            const fieldName = path[2] as string;
            const itemId = formData.items[itemIndex]?.id;

            if (itemId && fieldName) {
              if (!newItemErrors[itemId]) {
                newItemErrors[itemId] = {};
              }
              newItemErrors[itemId][fieldName] = err.message;
            } else if (path.length === 1 && path[0] === "items") {
              setErrorMessage(err.message);
            }
          }
        });

        setFieldErrors(newFieldErrors);
        setItemErrors(newItemErrors);

        if (Object.keys(newFieldErrors).length === 0 && Object.keys(newItemErrors).length === 0 && !errorMessage) {
          setErrorMessage("Please fix the errors in the form");
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});
    setItemErrors({});

    if (!validateForm()) {
      setSubmissionState("error");
      return;
    }

    setSubmissionState("loading");

    try {
      const token = process.env.NEXT_PUBLIC_API_TOKEN || "";

      if (!token) {
        throw new Error("API token not configured");
      }

      const products = formData.items.map((item) => ({
        productName: item.productName,
        productReference: item.reference,
        quantity: item.quantity,
        unitPrice: typeof item.price === "number" ? item.price : 0,
        productCategoryId: 0,
      }));

      const payload = {
        customerPhone: formData.phoneNumber,
        totalPrice: total,
        products: products,
      };

      const response = await fetch("https://dev-api-3ug2clvfq0vjtzzofva0.alyapay.com/api/v1/merchantapp/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error: ${response.status} ${response.statusText}`
        );
      }

      await response.json();
      setSubmissionState("success");

      setTimeout(() => {
        setFormData({
          phoneNumber: "",
          items: [
            {
              id: crypto.randomUUID(),
              productName: "",
              reference: "",
              quantity: 1,
              price: "",
            },
          ],
        });
        setSubmissionState("idle");
      }, 2000);
    } catch (error) {
      setSubmissionState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      phoneNumber: "",
      items: [
        {
          id: crypto.randomUUID(),
          productName: "",
          reference: "",
          quantity: 1,
          price: "",
        },
      ],
    });
    setSubmissionState("idle");
    setErrorMessage("");
    setFieldErrors({});
    setItemErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900">
              Create Transaction
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6 transition-all duration-300">
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
                  validateField("phoneNumber", value);
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
              <h2 className="text-lg font-normal text-gray-900 flex items-center gap-2">
                <FiShoppingCart className="w-5 h-5 text-blue-600" />
                Products
              </h2>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-5 bg-gray-50 hover:border-blue-400 transition-all duration-300 fade-in slide-in-from-bottom-2"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-normal text-gray-700">
                        Product {index + 1}
                      </h3>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200 p-1 rounded border border-red-300 hover:border-red-600 hover:bg-red-50"
                          aria-label="Remove product"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-normal text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <Input
                          type="text"
                          value={item.productName}
                          onChange={(e) => {
                            const value = e.target.value;
                            updateItem(item.id, "productName", value);
                            validateItemField(item.id, "productName", value);
                          }}
                          placeholder="Product name"
                          className={itemErrors[item.id]?.productName ? "border-red-500" : ""}
                          required
                        />
                        {itemErrors[item.id]?.productName && (
                          <p className="text-sm text-red-600 mt-1">{itemErrors[item.id].productName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-normal text-gray-700 mb-2">
                          Reference
                        </label>
                        <Input
                          type="text"
                          value={item.reference}
                          onChange={(e) =>
                            updateItem(item.id, "reference", e.target.value)
                          }
                          placeholder="# Reference"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-normal text-gray-700 mb-2">
                          Quantity *
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            updateItem(item.id, "quantity", value);
                            validateItemField(item.id, "quantity", value);
                          }}
                          className={itemErrors[item.id]?.quantity ? "border-red-500" : ""}
                          required
                        />
                        {itemErrors[item.id]?.quantity && (
                          <p className="text-sm text-red-600 mt-1">{itemErrors[item.id].quantity}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-normal text-gray-700 mb-2">
                          Unit Price (Dh) *
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price === "" ? "" : item.price}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (inputValue === "") {
                              updateItem(item.id, "price", "");
                              validateItemField(item.id, "price", "");
                              return;
                            }
                            if (!/^\d*\.?\d*$/.test(inputValue)) {
                              validateItemField(item.id, "price", inputValue);
                              return;
                            }
                            const value = parseFloat(inputValue) || "";
                            updateItem(item.id, "price", value);
                            validateItemField(item.id, "price", value);
                          }}
                          placeholder="0.00"
                          className={itemErrors[item.id]?.price ? "border-red-500" : ""}
                          required
                        />
                        {itemErrors[item.id]?.price && (
                          <p className="text-sm text-red-600 mt-1">{itemErrors[item.id].price}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-end">
                        <span className="text-sm text-gray-600">Subtotal: </span>
                        <span className="ml-2 font-medium text-base text-blue-600">
                          {((typeof item.price === "number" ? item.price : 0) * item.quantity).toFixed(2)} Dh
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
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

          {submissionState === "success" && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 font-normal">
                  Transaction created successfully!
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              onClick={resetForm}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submissionState === "loading"}
              variant="default"
              size="lg"
            >
              {submissionState === "loading" ? "Submitting..." : "Save"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
