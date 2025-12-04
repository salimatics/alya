import { TransactionItem } from "./types";

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

