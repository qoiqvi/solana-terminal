export function toAtomicAmount(amount: number, decimals: number): number {
  return Math.round(amount * 10 ** decimals);
}

export function fromAtomicAmount(amount: number, decimals: number): number {
  return amount / 10 ** decimals;
}

export function truncateAddress(address: string): string {
  return address.slice(0, 4) + '...' + address.slice(-4);
}
