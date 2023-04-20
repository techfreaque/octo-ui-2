export function parseSymbol(symbol) {
    const [base, rawQuote]= symbol.split("/")
    const [quote, settlement]= rawQuote.split(":")
    return {base, quote, settlement}
}