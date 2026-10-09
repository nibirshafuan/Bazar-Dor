export function formatBengaliNumber(
  value: number | string,
  maximumFractionDigits = 2
): string {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "০";
  }

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(number);
}

export function formatBengaliPrice(
  value: number | string,
  unit?: string
): string {
  const price = `৳ ${formatBengaliNumber(value)}`;

  return unit ? `${price}/${unit}` : price;
}

export function formatBengaliPercentage(
  value: number | string
): string {
  const percentage = Number(value);

  if (!Number.isFinite(percentage)) {
    return "০%";
  }

  const sign = percentage > 0 ? "+" : "";

  return `${sign}${formatBengaliNumber(percentage)}%`;
}
