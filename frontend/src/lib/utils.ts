export function cn(...inputs: Array<string | number | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}