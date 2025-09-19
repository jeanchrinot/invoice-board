import { DraftStatus, InvoiceType, Prisma, PrismaClient } from "@prisma/client";

import { getSelectedDraft } from "@/lib/ai-memory";

const prisma = new PrismaClient();

export async function findInvoice(
  userId: string | undefined,
  //   clientName: string | undefined,
  number: string | undefined,
) {
  const draft = await prisma.invoice.findFirst({
    where: {
      userId,
      number,
    },
    orderBy: { updatedAt: "desc" },
  });

  return draft;
}

export async function findInvoiceDraft(
  userId: string | undefined,
  //   clientName: string | undefined,
  invoiceNumber: string | undefined,
) {
  const draft = await prisma.invoiceDraft.findFirst({
    where: {
      userId,
      invoiceNumber,
    },
    orderBy: { updatedAt: "desc" },
  });

  return draft;
}

export async function findInvoiceDraftById(
  userId: string | undefined,
  draftId: string | undefined,
) {
  const draft = await prisma.invoiceDraft.findUnique({
    where: {
      userId,
      id: draftId,
    },
  });

  return draft;
}

export async function createInvoiceDraft(
  userId: string,
  type: InvoiceType = "INVOICE",
) {
  const invoiceCount = await prisma.invoiceDraft.count({
    where: { userId },
  });

  const invoiceNumber = generateInvoiceNumber("INV", invoiceCount); // TODO: Update this to use freelancer name
  const draft = await prisma.invoiceDraft.create({
    data: {
      userId,
      type,
      status: DraftStatus.IN_PROGRESS,
      invoiceNumber,
    },
  });

  return draft;
}

// NEW: Create invoice draft with prefilled data from previous invoices
export async function createInvoiceDraftWithPrefill(
  userId: string,
  type: InvoiceType = "INVOICE",
) {
  const invoiceCount = await prisma.invoiceDraft.count({
    where: { userId },
  });

  const invoiceNumber = generateInvoiceNumber("INV", invoiceCount);

  // Get the most recent complete invoice to use as template
  const templateInvoice = await getLatestCompleteInvoice(userId);

  const prefillData: any = {};

  if (templateInvoice) {
    // Prefill freelancer info (always the same)
    if (templateInvoice.freelancerInfo) {
      prefillData.freelancerInfo = templateInvoice.freelancerInfo;
    }

    // Prefill payment terms (usually the same)
    if (templateInvoice.paymentTerms) {
      prefillData.paymentTerms = templateInvoice.paymentTerms;
    }

    // Prefill currency, tax, and issue date from invoice details
    if (templateInvoice.invoiceDetails) {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      prefillData.invoiceDetails = {
        currency: templateInvoice.invoiceDetails["currency"],
        tax: templateInvoice.invoiceDetails["tax"],
        issueDate: today, // Always set to today
        // Don't prefill dueDate - user should specify based on their agreement
      };
    }
  }

  const draft = await prisma.invoiceDraft.create({
    data: {
      userId,
      type,
      status: DraftStatus.IN_PROGRESS,
      invoiceNumber,
      ...prefillData,
    },
  });

  return draft;
}

// NEW: Get the latest complete invoice for prefilling
export async function getLatestCompleteInvoice(userId: string) {
  return prisma.invoiceDraft.findFirst({
    where: {
      userId,
      status: {
        in: [DraftStatus.COMPLETE, DraftStatus.SENT, DraftStatus.PAID],
      },
      // Ensure it has the basic required fields
      freelancerInfo: { not: Prisma.JsonNull },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// NEW: Get unique clients list for reuse
export async function getUniqueClientsList(userId: string) {
  const drafts = await prisma.invoiceDraft.findMany({
    where: {
      userId,
      clientInfo: { not: Prisma.JsonNull },
      status: {
        in: [DraftStatus.COMPLETE, DraftStatus.SENT, DraftStatus.PAID],
      },
    },
    select: {
      clientInfo: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Extract unique clients based on email (assuming email is unique identifier)
  const uniqueClients = new Map();

  drafts.forEach((draft) => {
    if (draft.clientInfo && typeof draft.clientInfo === "object") {
      const clientInfo = draft.clientInfo as any;
      if (
        clientInfo.clientEmail &&
        !uniqueClients.has(clientInfo.clientEmail)
      ) {
        uniqueClients.set(clientInfo.clientEmail, {
          clientName: clientInfo.clientName,
          clientEmail: clientInfo.clientEmail,
          clientPhone: clientInfo.clientPhone,
          clientAddress: clientInfo.clientAddress,
        });
      }
    }
  });

  return Array.from(uniqueClients.values());
}

export async function updateInvoiceDraftSection(
  draftId: string | undefined,
  section:
    | "freelancerInfo"
    | "clientInfo"
    | "invoiceDetails"
    | "lineItems"
    | "paymentTerms",
  data: any,
) {
  try {
    const updatedDraft = await prisma.invoiceDraft.update({
      where: { id: draftId },
      data: {
        [section]: data,
        updatedAt: new Date(),
      },
    });

    return updatedDraft;
  } catch (error) {
    console.error("error", error);
  }

  return;
}

export async function updateInvoiceCustomNote(
  draftId: string | undefined,
  customNote: string | undefined,
) {
  try {
    const updatedDraft = await prisma.invoiceDraft.update({
      where: { id: draftId },
      data: {
        customNote,
        updatedAt: new Date(),
      },
    });
    return updatedDraft;
  } catch (error) {
    console.error("error", error);
  }

  return;
}

export async function updateInvoiceDraftStatus(
  draftId: string | undefined,
  status: DraftStatus,
) {
  try {
    const updatedDraft = await prisma.invoiceDraft.update({
      where: { id: draftId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
    console.log("updatedDraft", updatedDraft);
    return updatedDraft;
  } catch (error) {
    console.error("error", error);
  }

  return;
}

export async function deleteInvoiceDraft(
  userId: string | undefined,
  draftId: string | undefined,
) {
  return prisma.invoiceDraft.delete({
    where: { userId, id: draftId },
  });
}

export async function countUserInvoiceDrafts(
  userId: string | undefined,
  status: DraftStatus | undefined,
) {
  if (status) {
    return prisma.invoiceDraft.count({
      where: { userId, status: status },
    });
  }
  return prisma.invoiceDraft.count({
    where: { userId },
  });
}

export async function finalizeInvoiceDraft(draftId: string) {
  return prisma.invoiceDraft.update({
    where: { id: draftId },
    data: {
      status: DraftStatus.COMPLETE,
    },
  });
}

// export async function updateInvoice(
//   invoiceId: string,
//   invoiceDraft: Prisma.InvoiceUpdateInput,
// ) {
//   const invoice = await prisma.invoice.findUnique({
//     where: { id: invoiceId },
//   });

//   if (!invoice) {
//     throw new Error("Invoice not found");
//   }

//   // fields you want to allow updating
//   const updatableFields: (keyof typeof invoice)[] = [
//     "number",
//     "status",
//     "date",
//     "dueDate",
//     "currency",
//     "paymentDetails",
//     "customNotes",
//     "billTo",
//     "from",
//     "items",
//     "subtotal",
//     "taxRate",
//     "tax",
//     "total",
//   ];

//   // Build update data: prefer invoiceDraft value if defined, else keep old value
//   const data: Partial<typeof invoice> = {};
//   for (const field of updatableFields) {
//     const draftValue = invoiceDraft[field as keyof typeof invoiceDraft];
//     if (draftValue !== undefined) {
//       // @ts-ignore (because json types cause mismatch)
//       data[field] = draftValue;
//     } else {
//       // @ts-ignore
//       data[field] = invoice[field];
//     }
//   }

//   return prisma.invoice.update({
//     where: { id: invoiceId },
//     data,
//   });
// }

// import { Prisma } from "@prisma/client";
// import { prisma } from "@/lib/prisma"; // adjust path

export async function updateInvoice(
  invoiceId: string,
  invoiceDraft: Partial<Prisma.InvoiceUpdateInput>,
) {
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: invoiceDraft,
  });
}

export async function createOrUpdateInvoice(
  invoiceId: string | null,
  userId: string,
  data: Omit<
    Prisma.InvoiceUncheckedCreateInput,
    "id" | "userId" | "type" | "createdAt" | "updatedAt"
  > & {
    status?: string;
    date?: string;
    dueDate?: string;
  },
) {
  // Normalize date fields
  const normalizedData = {
    ...data,
    ...(data.date ? { date: new Date(data.date) } : {}),
    ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
  };

  if (invoiceId) {
    // check if invoice exists
    const existing = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (existing) {
      // update only the allowed fields
      return prisma.invoice.update({
        where: { id: invoiceId },
        data: normalizedData,
      });
    }
  }

  // create new invoice
  return prisma.invoice.create({
    data: {
      ...normalizedData,
      userId, // always required
    },
  });
}

export async function cancelInvoiceDraft(draftId: string) {
  return prisma.invoiceDraft.update({
    where: { id: draftId },
    data: {
      status: DraftStatus.CANCELLED,
    },
  });
}

export async function getActiveDraftForUser(userId: string) {
  return prisma.invoiceDraft.findFirst({
    where: {
      userId,
      status: DraftStatus.IN_PROGRESS,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function checkIfDraftIsComplete(draftId: string | undefined) {
  const draft = await prisma.invoiceDraft.findUnique({
    where: { id: draftId },
  });

  const isComplete =
    draft?.freelancerInfo &&
    draft?.clientInfo &&
    draft?.invoiceDetails &&
    draft?.lineItems &&
    draft?.paymentTerms;

  if (isComplete && draft.status == "IN_PROGRESS") {
    await prisma.invoiceDraft.update({
      where: { id: draftId },
      data: { status: "COMPLETE" },
    });

    return { isComplete: false, draft };
  }

  if (draft?.status !== "IN_PROGRESS") {
    return { isComplete: true, draft };
  }

  return { isComplete: false, draft };
}

export async function withDraftCheck<T extends object>(
  draftId: string | undefined,
  data: T,
): Promise<T & { isDraftComplete: boolean }> {
  const { isComplete, draft } = await checkIfDraftIsComplete(draftId);
  return {
    ...data,
    isDraftComplete: isComplete,
    invoiceId: draftId,
    lastUpdated: draft?.updatedAt,
  };
}

export function generateInvoiceNumber(
  freelancerName: string,
  invoiceCount: number,
): string {
  const prefix = freelancerName.trim().slice(0, 3).toUpperCase().padEnd(3, "X");
  const paddedNumber = String(invoiceCount + 1).padStart(3, "0");
  return `${prefix}-${paddedNumber}`;
}

export function calculateAmount(draft: any) {
  const subtotal = draft?.lineItems?.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.rate,
    0,
  );
  const tax = parseInt(draft?.invoiceDetails?.tax || "0");
  //   const credit = parseInt(draft?.invoiceDetails?.credit || "0");
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  return total;
}

export async function createInvoiceNumber(userId: string) {
  const invoiceCount = await prisma.invoice.count({
    where: { userId },
  });

  // increment count so new invoice starts at 1 not 0
  const nextCount = invoiceCount + 1;
  const paddedCount = String(nextCount).padStart(3, "0"); // 001, 002, 003...

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 0-based
  const year = now.getFullYear();

  return `INV-${day}-${month}-${year}-${paddedCount}`;
}

export function getStatusClass(status: string) {
  let className = "";
  switch (status) {
    case "PAID":
      className = "text-green-600";
      break;
    case "COMPLETE":
      className = "text-blue-600";
      break;
    case "CANCELLED":
      className = "text-yellow-600";
      break;
    default:
      className = "text-muted-foreground";
      break;
  }
  return className;
}

export function createInvoicePreviewLink(draftId: string | undefined) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${draftId}`;
}
