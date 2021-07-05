export const formatCurrency = (amount = 0, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    amount / 100
  );
