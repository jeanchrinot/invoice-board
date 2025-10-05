// It takes up to 20K tokens to finalize one invoice
export const guestUserLimit = {
  invoices: 1,
  tokens: 20000,
};

export const usageLimits = {
  Free: {
    invoices: 50,
    aiInvoices: 1,
    tokens: 200000,
    // gpt-4o: 0.544 $ / 200K tokens
    // gpt-4o-mini: 0.0318 $ / 200K tokens
  },
  Pro: {
    invoices: Infinity,
    aiInvoices: 50,
    tokens: 1000000,
    // gpt-4o 1M tokens cost 2.72 $
    // gpt-4o-mini 1M tokens cost 0.159 $
  },
  Business: {
    invoices: Infinity,
    aiInvoices: 200,
    tokens: 4000000,
    // gpt-4o: 10.91$ / 4M tokens
    // gpt-4o-mini: 0.636 $ / 4M tokens
  },
};

export const basicUsageLimit = {
  invoices: 50,
  aiInvoices: 1,
  tokens: 200000,
  // gpt-4o: 0.544 $ / 200K tokens
  // gpt-4o-mini: 0.0318 $ / 200K tokens
};

export const proUsageLimit = {
  invoices: Infinity,
  aiInvoices: 50,
  tokens: 1000000,
  // gpt-4o 1M tokens cost 2.72 $
  // gpt-4o-mini 1M tokens cost 0.159 $
};

export const businessUsageLimit = {
  invoices: Infinity,
  aiInvoices: 200,
  tokens: 4000000,
  // gpt-4o: 10.91$ / 4M tokens
  // gpt-4o-mini: 0.636 $ / 4M tokens
};
