export function parseSymbol(symbol: string): {
  base: string;
  quote: string;
  settlement: string;
} {
  const [base, rawQuote] = symbol.split("/");
  const [quote, settlement] = rawQuote.split(":");
  return { base, quote, settlement };
}
