export function parseSymbol(symbol: string): {
  base: string;
  quote: string;
  settlement: string | undefined;
} {
  const [base, rawQuote] = symbol.split("/");
  if (!rawQuote || !base) {
    throw new Error(`Invalid symbol format: ${symbol}`);
  }
  const [quote, settlement] = rawQuote.split(":");
  if (!quote) {
    throw new Error(`Invalid symbol format: ${symbol}`);
  }
  return { base, quote, settlement };
}
