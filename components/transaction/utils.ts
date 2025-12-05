import { TransactionItem } from "./types";
import productsData from "@/data/products.json";

export const getProducts = (): typeof productsData => {
  if (typeof window === "undefined") return productsData;
  try {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : productsData;
  } catch {
    return productsData;
  }
};

export const createEmptyItem = (): TransactionItem => ({
  id: crypto.randomUUID(),
  productName: "",
  reference: "",
  quantity: 1,
  price: "",
  categoryId: 0,
});

export const calculateTotal = (items: TransactionItem[]): number => {
  return items.reduce(
    (sum, item) => sum + (typeof item.price === "number" ? item.price : 0) * item.quantity,
    0
  );
};

export const saveToLocalStorage = (transactionData: any): boolean => {
  try {
    const savedTransactions = JSON.parse(
      localStorage.getItem("savedTransactions") || "[]"
    );
    const newTransaction = {
      id: crypto.randomUUID(),
      ...transactionData,
      savedAt: new Date().toISOString(),
    };
    savedTransactions.push(newTransaction);
    localStorage.setItem("savedTransactions", JSON.stringify(savedTransactions));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

