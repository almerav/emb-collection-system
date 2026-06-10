"use client";

import { useEffect, useMemo, useState } from "react";

type Transaction = {
  id: string;
  date: string;
  orNumber: string;
  payor: string;
  nature: string;
  feeOption: string;
  amount: number;
  remarks: string;
};

const natureOptions: Record<string, string[]> = {
  "Fees/Fines (Under Regular Fund)": [
    "PCO Accreditation",
    "Certification (PCO)",
  ],

  "RA 6969": [
    "Hazwaste Reg Fee",
    "Permit to Transport",
    "ODS Reg Fee",
    "CCO-ODS Fee",
    "Hazwaste Reg Fee Amendment",
    "PCB Reg Fee",
    "Fines/Penalties (RA 6969)",
    "Request for Miscellaneous",
  ],

  "PD 1586": [
    "ECC Amendment",
    "EPRMP",
    "EIS Processing Fee",
    "Certification on ECC Process",
    "Certified True Copy",
    "LUC Fee",
    "CNC-CAT C",
    "CEMCRR",
  ],

  "PD 1586 / LRF": ["LRF Collection"],

  "Fees/Fines (Under Fund 155)": [
    "Permit to Operate",
    "Filing Fee (RA 8749)",
    "Fines/Penalties (RA 8749)",
    "Certification (PTO)",
    "Other Fees under RA 8749",
  ],

  "Fees/Fines (Under Fund 152)": [
    "Discharge Permit",
    "Filing Fee (RA 9275)",
    "Fines/Penalties (RA 9275)",
    "Certification (RA 9275)",
    "Other Fees under RA 9275",
  ],

  "Fees/Fines (Under Fund 153)": ["Waste Water Charge Fee"],

  "Refund / Excess / Unused / Unutilized Funds": [
    "Refund",
    "Excess Collection",
    "Unused Funds",
    "Unutilized Funds",
  ],

  "Interest Income": ["Interest Income"],
};

const initialForm = {
  date: "",
  orNumber: "",
  payor: "",
  nature: "",
  feeOption: "",
  amount: "",
  remarks: "",
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const saved = localStorage.getItem("emb_transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("emb_transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.date ||
      !form.orNumber ||
      !form.payor ||
      !form.nature ||
      !form.feeOption ||
      !form.amount
    ) {
      alert("Please complete the required fields.");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: form.date,
      orNumber: form.orNumber,
      payor: form.payor,
      nature: form.nature,
      feeOption: form.feeOption,
      amount: Number(form.amount),
      remarks: form.remarks,
    };

    setTransactions([newTransaction, ...transactions]);
    setForm(initialForm);
  }

  function deleteTransaction(id: string) {
    if (confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((item) => item.id !== id));
    }
  }

  const totalCollection = useMemo(() => {
    return transactions.reduce((sum, item) => sum + item.amount, 0);
  }, [transactions]);

  const today = new Date().toISOString().slice(0, 10);

  const todayTotal = useMemo(() => {
    return transactions
      .filter((item) => item.date === today)
      .reduce((sum, item) => sum + item.amount, 0);
  }, [transactions, today]);

  const monthlySummary = useMemo(() => {
    const summary: Record<string, number> = {};

    transactions.forEach((item) => {
      const month = item.date.slice(0, 7);
      const key = `${month} - ${item.nature} - ${item.feeOption}`;
      summary[key] = (summary[key] || 0) + item.amount;
    });

    return Object.entries(summary);
  }, [transactions]);

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold">
            EMB Collection Monitoring System
          </h1>
          <p className="text-gray-600">
            Daily cash collection, fines, penalties, permits, and monthly
            reports
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Collection</p>
            <h2 className="text-2xl font-bold">
              ₱{totalCollection.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Today’s Collection</p>
            <h2 className="text-2xl font-bold">
              ₱{todayTotal.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="text-2xl font-bold">{transactions.length}</h2>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold">Add Collection</h2>

          <form onSubmit={addTransaction} className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Collection Date
              </label>
              <input
                type="date"
                className="w-full rounded border p-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                OR Number
              </label>
              <input
                className="w-full rounded border p-2"
                placeholder="Enter OR Number"
                value={form.orNumber}
                onChange={(e) => setForm({ ...form, orNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Payor / Establishment
              </label>
              <input
                className="w-full rounded border p-2"
                placeholder="Enter Payor"
                value={form.payor}
                onChange={(e) => setForm({ ...form, payor: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Nature of Collection
              </label>
              <select
                className="w-full rounded border p-2"
                value={form.nature}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nature: e.target.value,
                    feeOption: "",
                  })
                }
              >
                <option value="">Select Nature</option>

                {Object.keys(natureOptions).map((nature) => (
                  <option key={nature} value={nature}>
                    {nature}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Fee / Fine Type
              </label>
              <select
                className="w-full rounded border p-2"
                value={form.feeOption}
                onChange={(e) =>
                  setForm({ ...form, feeOption: e.target.value })
                }
                disabled={!form.nature}
              >
                <option value="">Select Fee/Fine</option>

                {form.nature &&
                  natureOptions[form.nature].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Amount
              </label>
              <input
                type="number"
                className="w-full rounded border p-2"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Remarks
              </label>
              <input
                className="w-full rounded border p-2"
                placeholder="Remarks"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </div>
          </form>
        </section>

        <section className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Daily Collection Records
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">OR No.</th>
                  <th className="border p-2">Payor</th>
                  <th className="border p-2">Nature</th>
                  <th className="border p-2">Fine / Fee Option</th>
                  <th className="border p-2">Reference No.</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Deposit Date</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.date}</td>
                    <td className="border p-2">{item.orNumber}</td>
                    <td className="border p-2">{item.payor}</td>
                    <td className="border p-2">{item.nature}</td>
                    <td className="border p-2">{item.feeOption}</td>
                    <td className="border p-2 text-right">
                      ₱{item.amount.toLocaleString()}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => deleteTransaction(item.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="border p-4 text-center text-gray-500"
                    >
                      No collection records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Monthly Report by Nature
          </h2>

          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Month / Nature / Option</th>
                <th className="border p-2">Total Amount</th>
              </tr>
            </thead>

            <tbody>
              {monthlySummary.map(([key, amount]) => (
                <tr key={key}>
                  <td className="border p-2">{key}</td>
                  <td className="border p-2 text-right">
                    ₱{amount.toLocaleString()}
                  </td>
                </tr>
              ))}

              {monthlySummary.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="border p-4 text-center text-gray-500"
                  >
                    No monthly report available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}