"use client";

import { FormEvent, useState } from "react";
import { createCashfreeBeneficiary, deleteCashfreeBeneficiary, getCashfreeBeneficiary, type CashfreeBeneficiaryRequest } from "@/lib/cashfree-service";

const initialForm: CashfreeBeneficiaryRequest = { beneficiaryId: "", name: "", email: "", phone: "", bankAccountNumber: "", bankIfsc: "", vpa: "" };

export default function BeneficiariesPage() {
  const [form, setForm] = useState(initialForm);
  const [lookupId, setLookupId] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.beneficiaryId || !form.name || !form.email || !form.phone || (!form.vpa && (!form.bankAccountNumber || !form.bankIfsc))) {
      setMessage("Enter contact details and either a VPA or complete bank details.");
      return;
    }
    setLoading(true); setMessage("");
    try {
      const payload = { ...form };
      if (payload.vpa) { delete payload.bankAccountNumber; delete payload.bankIfsc; } else { delete payload.vpa; }
      const response = await createCashfreeBeneficiary(payload);
      if (!response.success) throw new Error(response.error || response.message || "Could not add beneficiary.");
      setResult(response.data); setForm(initialForm); setMessage("Beneficiary added successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not add beneficiary."); }
    finally { setLoading(false); }
  };

  const lookup = async () => {
    if (!lookupId) return;
    setLoading(true); setMessage("");
    try {
      const response = await getCashfreeBeneficiary(lookupId);
      if (!response.success) throw new Error(response.error || response.message || "Could not load beneficiary.");
      setResult(response.data);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not load beneficiary."); }
    finally { setLoading(false); }
  };

  const remove = async () => {
    if (!lookupId || !window.confirm("Remove this beneficiary?")) return;
    setLoading(true); setMessage("");
    try {
      const response = await deleteCashfreeBeneficiary(lookupId);
      if (!response.success) throw new Error(response.error || response.message || "Could not remove beneficiary.");
      setResult(null); setMessage("Beneficiary removed.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not remove beneficiary."); }
    finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950"><section className="mx-auto max-w-2xl space-y-6">
    <header><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Beneficiary management</h1><p className="mt-2 text-gray-600 dark:text-gray-300">Add or view a payout beneficiary securely.</p></header>
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-6 shadow dark:bg-gray-900 sm:grid-cols-2">
      {([['beneficiaryId','Beneficiary ID'],['name','Name'],['email','Email'],['phone','Phone'],['bankAccountNumber','Bank account number'],['bankIfsc','Bank IFSC'],['vpa','UPI VPA']] as const).map(([key,label]) => <label key={key} className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}<input value={form[key] || ""} onChange={event => setForm({ ...form, [key]: event.target.value })} type={key === 'email' ? 'email' : 'text'} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800" /></label>)}
      <button disabled={loading} className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-50 sm:col-span-2">{loading ? "Working..." : "Add beneficiary"}</button>
    </form>
    <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900"><h2 className="font-bold text-gray-900 dark:text-white">View or remove</h2><div className="mt-3 flex gap-2"><input value={lookupId} onChange={event => setLookupId(event.target.value)} placeholder="Beneficiary ID" className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800" /><button onClick={() => void lookup()} disabled={loading} className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-white">View</button><button onClick={() => void remove()} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">Remove</button></div>{result && <pre className="mt-4 overflow-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-800">{JSON.stringify(result, null, 2)}</pre>}</div>
    {message && <p className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow dark:bg-gray-900 dark:text-gray-200">{message}</p>}
  </section></main>;
}
