import { DraftStatus, InvoiceType, Prisma, PrismaClient } from "@prisma/client";

import { getSelectedDraft } from "@/lib/ai-memory";

const prisma = new PrismaClient();

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
