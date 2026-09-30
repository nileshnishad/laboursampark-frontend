"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { createCashfreePayout, createCashfreeRefund, getCashfreePayout, getCashfreePayouts, getCashfreeRefund, retryCashfreePayout, type CashfreePayoutRequest } from "@/lib/cashfree-service";

const isAdmin = (user: Record<string, unknown> | null) => [user?.role, user?.userType, user?.accountType].some(value => String(value || "").toLowerCase() === "admin");

export default function CashfreeAdminPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user) as Record<string, unknown> | null;
  const [payouts, setPayouts] = useState<unknown>(null);
  const [payout, setPayout] = useState<CashfreePayoutRequest>({ beneficiaryId: "", amount: 0, transferMode: "imps" });
  const [refund, setRefund] = useState({ paymentId: "", amount: 0, note: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPayouts = async () => {
    setLoading(true);
    const response = await getCashfreePayouts();
    setLoading(false);
    if (!response.success) setMessage(response.error || response.message || "Could not load payouts.");
    else setPayouts(response.data);
  };

  useEffect(() => { if (isAdmin(user)) void loadPayouts(); }, [user]);

  if (!user) return <main className="p-10">Loading...</main>;
  if (!isAdmin(user)) return <main className="mx-auto max-w-lg p-10 text-center"><h1 className="text-2xl font-bold">Admin access required</h1><button onClick={() => router.push("/")} className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white">Return home</button></main>;

  const submitPayout = async (event: FormEvent) => {
    event.preventDefault(); if (!payout.beneficiaryId || payout.amount <= 0 || !window.confirm("Create this payout?")) return;
    setLoading(true); setMessage(""); const response = await createCashfreePayout(payout); setLoading(false);
    if (!response.success) setMessage(response.error || response.message || "Could not create payout."); else { setMessage("Payout created."); void loadPayouts(); }
  };
  const submitRefund = async (event: FormEvent) => {
    event.preventDefault(); if (!refund.paymentId || refund.amount <= 0 || !window.confirm("Submit this refund?")) return;
    setLoading(true); setMessage(""); const response = await createCashfreeRefund(refund.paymentId, { amount: refund.amount, note: refund.note }); setLoading(false);
    setMessage(response.success ? "Refund submitted." : response.error || response.message || "Could not submit refund.");
  };
  const retry = async (payoutId: string) => {
    if (!window.confirm("Retry this payout?")) return;
    setLoading(true); const response = await retryCashfreePayout(payoutId); setLoading(false);
    setMessage(response.success ? "Payout retry submitted." : response.error || response.message || "Could not retry payout.");
  };
  const checkPayout = async (payoutId: string) => {
    setLoading(true); const response = await getCashfreePayout(payoutId); setLoading(false);
    setMessage(response.success ? JSON.stringify(response.data) : response.error || response.message || "Could not load payout.");
  };
  const checkRefund = async () => {
    if (!refund.paymentId) return;
    setLoading(true); const response = await getCashfreeRefund(refund.paymentId); setLoading(false);
    setMessage(response.success ? JSON.stringify(response.data) : response.error || response.message || "Could not load refund status.");
  };

  return <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950"><section className="mx-auto max-w-5xl space-y-6"><header><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cashfree operations</h1><p className="mt-2 text-gray-600 dark:text-gray-300">Admin-only payouts and refunds.</p></header>
    <div className="grid gap-6 lg:grid-cols-2"><form onSubmit={submitPayout} className="space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-gray-900"><h2 className="font-bold">Create payout</h2><input required placeholder="Beneficiary ID" value={payout.beneficiaryId} onChange={e => setPayout({ ...payout, beneficiaryId: e.target.value })} className="w-full rounded-lg border p-3 dark:bg-gray-800" /><input required min="1" type="number" placeholder="Amount" value={payout.amount || ""} onChange={e => setPayout({ ...payout, amount: Number(e.target.value) })} className="w-full rounded-lg border p-3 dark:bg-gray-800" /><select value={payout.transferMode} onChange={e => setPayout({ ...payout, transferMode: e.target.value as CashfreePayoutRequest['transferMode'] })} className="w-full rounded-lg border p-3 dark:bg-gray-800"><option value="imps">IMPS</option><option value="neft">NEFT</option><option value="rtgs">RTGS</option><option value="upi">UPI</option></select><button disabled={loading} className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white">Create payout</button></form>
    <form onSubmit={submitRefund} className="space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-gray-900"><h2 className="font-bold">Refund payment</h2><input required placeholder="Payment ID" value={refund.paymentId} onChange={e => setRefund({ ...refund, paymentId: e.target.value })} className="w-full rounded-lg border p-3 dark:bg-gray-800" /><input required min="1" type="number" placeholder="Amount" value={refund.amount || ""} onChange={e => setRefund({ ...refund, amount: Number(e.target.value) })} className="w-full rounded-lg border p-3 dark:bg-gray-800" /><input placeholder="Note" value={refund.note} onChange={e => setRefund({ ...refund, note: e.target.value })} className="w-full rounded-lg border p-3 dark:bg-gray-800" /><div className="flex gap-2"><button disabled={loading} className="rounded-lg bg-red-600 px-4 py-3 font-semibold text-white">Submit refund</button><button type="button" onClick={() => void checkRefund()} disabled={loading} className="rounded-lg bg-gray-700 px-4 py-3 font-semibold text-white">Check status</button></div></form></div>
    <section className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900"><div className="flex items-center justify-between"><h2 className="font-bold">Payouts</h2><button onClick={() => void loadPayouts()} className="rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold text-white">Refresh</button></div>{Array.isArray((payouts as { payouts?: unknown[] } | null)?.payouts) ? <div className="mt-4 space-y-3">{((payouts as { payouts: Array<Record<string, unknown>> }).payouts).map(item => <div key={String(item.payoutId || item.id)} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div><p className="font-semibold">{String(item.payoutId || item.id || "Payout")}</p><p className="text-sm text-gray-500">{String(item.status || "Unknown")} | INR {String(item.amount || "0")}</p></div><div className="flex gap-2"><button onClick={() => void checkPayout(String(item.payoutId || item.id))} className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-semibold text-white">Details</button>{["FAILED", "REJECTED", "REVERSED"].includes(String(item.status || "").toUpperCase()) && <button onClick={() => void retry(String(item.payoutId || item.id))} className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white">Retry</button>}</div></div>)}</div> : payouts && <pre className="mt-4 overflow-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-800">{JSON.stringify(payouts, null, 2)}</pre>}</section>
    {message && <p className="rounded-lg bg-white p-4 text-sm shadow dark:bg-gray-900">{message}</p>}
  </section></main>;
}
