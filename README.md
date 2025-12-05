

## **UX Points**

- **Renamed the form:**

  The form was renamed to make the action explicit and aligned with real merchant workflows.

- **Removed unnecessary caissier details**

- **Simplified the form to customer + products only**

- **Made Save/Cancel always visible:**

  Because the product list can become long, **Save** and **Cancel** were moved to the top so they stay visible at all times. Additionally, a new product input is displayed first by default, eliminating the need to scroll to enter a product, and with **Save** positioned at the top, the workflow is optimized for quick product entry and transaction completion.

- **Default product input displayed automatically:**

  The first product form is shown by default instead of requiring a click on "Add product."

- **Added a product search bar connected to the store's product catalog:**

  I added a **search bar** that allows the caissier to search within the **store's product list**.

  **Assumption:**

  - each store (magasin) has its own product catalog
  - the search bar helps autofill product information (name, price, tax…)
  - the caissier only needs to provide
    - the **reference**
    - the **quantity**

  **Benefits:**

  - faster product selection
  - reduced typing
  - fewer errors
  - similar to traditional POS systems

- **Auto-prefilling of product data**

- **Only reference + quantity required**

- **Replaced Remove with a minus icon:**

  Instead of showing a destructive "Remove" button, I used a **minus (–)** icon to reduce stress and make the appearance lighter.

- **Added line subtotals**

- **Added confirmation dialogs:**

  because transaction action is sensitive

- **Temporary use of localStorage due to token issue**
