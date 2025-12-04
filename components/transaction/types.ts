export interface TransactionItem {
  id: string;
  productName: string;
  reference: string;
  quantity: number;
  price: number | "";
  categoryId: number;
}

export interface TransactionFormData {
  phoneNumber: string;
  items: TransactionItem[];
}

export type SubmissionState = "idle" | "loading" | "success" | "error";

