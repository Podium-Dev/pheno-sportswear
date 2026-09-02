export function formatCurrency(value: number, currencyCode = "GBP") {
  const normalizedCurrencyCode = /^[A-Z]{3}$/i.test(currencyCode) ? currencyCode.toUpperCase() : "GBP";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: normalizedCurrencyCode,
  }).format(value);
}
