import { z } from "zod";
import { TransactionFormData, TransactionItem } from "./types";

export const transactionItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  reference: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  categoryId: z.number().min(1, "Category is required"),
});

export const transactionSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  items: z.array(transactionItemSchema).min(1, "At least one product is required"),
});

export const validateField = (
  fieldName: string,
  value: any,
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  try {
    if (fieldName === "phoneNumber") {
      if (value && !/^\d+$/.test(value)) {
        setFieldErrors((prev) => ({ ...prev, phoneNumber: "Phone number should contain only numbers" }));
        return;
      }
      z.string().min(1, "Phone number is required").parse(value);
      setFieldErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: error.issues[0].message }));
    }
  }
};

export const validateItemField = (
  itemId: string,
  fieldName: string,
  value: any,
  items: TransactionItem[],
  setItemErrors: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>
) => {
  try {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (fieldName === "productName") {
      z.string().min(1, "Product name is required").parse(value);
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], productName: "" },
      }));
    } else if (fieldName === "quantity") {
      z.number().min(1, "Quantity must be at least 1").parse(value);
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], quantity: "" },
      }));
    } else if (fieldName === "price") {
      if (value === "" || value === null || value === undefined) {
        setItemErrors((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], price: "Price is required" },
        }));
        return;
      }
      if (typeof value === "string" && value !== "" && !/^\d*\.?\d*$/.test(value)) {
        setItemErrors((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], price: "Price should contain only numbers" },
        }));
        return;
      }
      z.number().min(0, "Price must be greater than or equal to 0").parse(value);
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], price: "" },
      }));
    } else if (fieldName === "categoryId") {
      z.number().min(1, "Category is required").parse(value);
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], categoryId: "" },
      }));
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [fieldName]: error.issues[0].message },
      }));
    }
  }
};

export const validateForm = (
  formData: TransactionFormData,
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setItemErrors: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
): boolean => {
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
        categoryId: item.categoryId,
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

      if (Object.keys(newFieldErrors).length === 0 && Object.keys(newItemErrors).length === 0) {
        setErrorMessage("Please fix the errors in the form");
      }
    }
    return false;
  }
};

