// Pure payment-schedule helpers — no server-only imports, so they can be used
// by server code, server components AND client components (admin panels).
//
// Policy: every standard order starts with a 30% deposit, paid BEFORE the
// build begins. The remaining 70% is either one balance payment on approval
// ("once-off" plans) or split equally across the remaining instalments.
//
// An order is a "deposit order" when orders.deposit_cents is not null. Older
// orders (and maintenance charges) have deposit_cents = null and keep the
// original behaviour: equal instalments, payable once the preview is ready.

export const DEPOSIT_PERCENT = 30;

export const WHATSAPP_NUMBER = "27798518109";

export function depositCentsFor(amountCents) {
  return Math.round((amountCents * DEPOSIT_PERCENT) / 100);
}

// Every standard plan has at least 2 payments: the deposit + the balance.
// A "once-off" plan (1 instalment on the pricing card) is stored as 2.
export function totalInstalmentsFor(planInstalments) {
  return planInstalments <= 1 ? 2 : planInstalments;
}

// Cents for every payment, in order. The last payment absorbs any rounding
// remainder so the schedule always sums exactly to amountCents.
export function scheduleInstalments(amountCents, totalInstalments) {
  const deposit = depositCentsFor(amountCents);
  const rest = amountCents - deposit;
  const laterCount = totalInstalments - 1;
  const per = Math.floor(rest / laterCount);
  const schedule = [deposit, ...Array(laterCount).fill(per)];
  schedule[schedule.length - 1] += rest - per * laterCount;
  return schedule;
}

export function isDepositOrder(order) {
  return order.deposit_cents != null;
}

// Amount (cents) of instalment number `number` (1-based) for this order.
export function instalmentAmountCents(order, number) {
  if (!isDepositOrder(order)) {
    return order.installment_amount_cents ?? order.amount_cents;
  }
  const schedule = scheduleInstalments(order.amount_cents, order.total_installments);
  return schedule[number - 1] ?? schedule[schedule.length - 1];
}

export function instalmentLabel(order, number) {
  if (!isDepositOrder(order)) {
    return order.total_installments > 1
      ? `Instalment ${number} of ${order.total_installments}`
      : "Payment";
  }
  if (number === 1) return `Deposit (${DEPOSIT_PERCENT}%)`;
  if (order.total_installments === 2) return `Balance (${100 - DEPOSIT_PERCENT}%)`;
  return `Instalment ${number} of ${order.total_installments}`;
}

// What the client can pay RIGHT NOW through their order link (card or EFT
// details), or null. Later monthly instalments are charged/confirmed by the
// admin, not started by the client.
export function getPayableInstalment(order) {
  if (order.status === "cancelled") return null;
  const number = order.installments_paid + 1;
  if (number > order.total_installments) return null;
  const amountCents = instalmentAmountCents(order, number);

  if (!isDepositOrder(order)) {
    return order.status === "preview_ready" ? { number, amountCents } : null;
  }

  if (number === 1) {
    return ["pending", "in_progress", "preview_ready"].includes(order.status)
      ? { number, amountCents }
      : null;
  }
  // The balance of a once-off plan is due when the client approves the preview.
  if (number === 2 && order.total_installments === 2) {
    return order.status === "preview_ready" ? { number, amountCents } : null;
  }
  return null;
}

// Short, unique, bank-statement-friendly reference the client quotes on EFT.
export function eftReference(order) {
  return `TKY-${String(order.id).replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
