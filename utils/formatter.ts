import { format } from "date-fns";

export function formatDate(date: Date) {
  return format(date, "LLL dd, yyyy");
}

export function formatDateTime(date: Date) {
  return format(date, "LLL dd, yyyy - h:mm aaa");
}

export const formatNumber = (number: number) => {
  if (typeof number !== "number") return "0";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
};

export function getCleanData(data: object) {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([_, v]) => v !== undefined && v !== null && !Number.isNaN(v),
    ),
  );
}

export const getTitleCase = (word: string): string => {
  if (!word) return "-";

  const words = word.split("-");

  if (words.length > 1) {
    const data: string[] = words.map((i) => getTitleCase(i));
    return data.join(" ");
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
};

export function generateSlug(text: string) {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // Replace spaces with -
      .replace(/\s+/g, "-")
      // Remove all non-word chars (except -)
      .replace(/[^\w-]+/g, "")
      // Replace multiple - with single -
      .replace(/--+/g, "-")
      // Remove - from start and end
      .replace(/^-+|-+$/g, "")
  );
}



export const numberToWords = (num: number): string => {
  if (num === 0) return "Zero";

  const belowTwenty = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const thousands = ["", "Thousand", "Million", "Billion"];

  const helper = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return belowTwenty[n] + " ";
    if (n < 100)
      return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    return (
      belowTwenty[Math.floor(n / 100)] +
      " Hundred " +
      helper(n % 100)
    );
  };

  let word = "";
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      word = helper(num % 1000) + thousands[i] + " " + word;
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return word.trim();
};