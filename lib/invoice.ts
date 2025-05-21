import { DraftStatus, InvoiceType, Prisma, PrismaClient } from "@prisma/client";

import { getSelectedDraft } from "@/lib/ai-memory";

const prisma = new PrismaClient();

export async function findInvoiceDraft(
  userId: string | undefined,
  //   clientName: string | undefined,
  invoiceNumber: string | undefined,
) {
  const conditions: Prisma.InvoiceDraftWhereInput[] = [];

  //   if (clientName) {
  //     conditions.push({
  //       clientInfo: {
  //         path: ["name"],
  //         equals: clientName,
  //       },
  //     });
  //   }

  //   if (invoiceNumber) {
  //     conditions.push({
  //       invoiceDetails: {
  //         path: ["number"],
  //         equals: invoiceNumber,
  //       },
  //     });
  //   }

  const draft = await prisma.invoiceDraft.findFirst({
    where: {
      userId,
      invoiceDetails: {
        path: ["invoiceNumber"],
        equals: invoiceNumber,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return draft;
}

export async function createInvoiceDraft(
  userId: string,
  type: InvoiceType = "INVOICE",
) {
  const draft = await prisma.invoiceDraft.create({
    data: {
      userId,
      type,
      status: DraftStatus.IN_PROGRESS,
    },
  });

  return draft;
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
  let newData = data;

  try {
    if (section === "invoiceDetails") {
      const draft = await prisma.invoiceDraft.findUnique({
        where: { id: draftId },
      });
      console.log("invoiceDetails", draft);
      // check if the draft has an invoice number
      let invoiceNumber =
        draft?.invoiceDetails &&
        typeof draft?.invoiceDetails === "object" &&
        !Array.isArray(draft.invoiceDetails)
          ? (draft.invoiceDetails as Record<string, any>).invoiceNumber
          : undefined;

      if (!invoiceNumber) {
        const invoiceCount = await prisma.invoiceDraft.count({
          where: { userId: draft?.userId },
        });

        console.log("invoiceNumber", invoiceNumber);

        invoiceNumber = generateInvoiceNumber("INV", invoiceCount); // TODO: Update this to use freelancer name
      }
      newData = { ...data, invoiceNumber };
    }

    const updatedDraft = await prisma.invoiceDraft.update({
      where: { id: draftId },
      data: {
        [section]: newData,
        updatedAt: new Date(),
      },
    });

    return updatedDraft;
  } catch (error) {
    console.error("error", error);
  }

  return;
}

export async function finalizeInvoiceDraft(draftId: string) {
  return prisma.invoiceDraft.update({
    where: { id: draftId },
    data: {
      status: DraftStatus.COMPLETE,
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

  if (isComplete && draft.status !== "COMPLETE") {
    await prisma.invoiceDraft.update({
      where: { id: draftId },
      data: { status: "COMPLETE" },
    });

    return { isComplete: false, draft };
  }

  if (draft?.status === "COMPLETE") {
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
  return `${prefix}${paddedNumber}`;
}
