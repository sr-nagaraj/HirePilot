export function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(value?: number) {
  if (!value) {
    return "Salary not disclosed";
  }

  const lpa = value >= 1000 ? value / 100000 : value;
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: lpa % 1 === 0 ? 0 : 1,
  }).format(lpa);

  return `${formatted} LPA`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
