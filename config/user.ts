// It takes approximately 20K tokens to finalize one invoice
export const guestUserLimit = {
  invoices: 1,
  tokens: 20000,
};

export const basicUsageLimit = {
  invoices: 1,
  tokens: 200000,
  // gpt-4o: 0.544 $ / 200K tokens
  // gpt-4o-mini: 0.0318 $ / 200K tokens
};

export const proUsageLimit = {
  invoices: 50,
  tokens: 1000000,
  // gpt-4o 1M tokens cost 2.72 $
  // gpt-4o-mini 1M tokens cost 0.159 $
};

export const businessUsageLimit = {
  invoices: 200,
  tokens: 4000000,
  // gpt-4o: 10.91$ / 4M tokens
  // gpt-4o-mini: 0.636 $ / 4M tokens
};
