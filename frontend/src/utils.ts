export const formatSui = (amount: string) => {
  return +(+amount / 10 ** 9).toFixed(9);
};
