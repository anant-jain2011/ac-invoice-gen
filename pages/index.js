import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {

  const router = useRouter();
  const quickStats = [
    {
      title: "Invoices Created",
      value: "1,248",
      sub: "+12 this week",
    },
    {
      title: "Pending Payments",
      value: "₹48,320",
      sub: "7 unpaid invoices",
    },
    {
      title: "Saved Clients",
      value: "86",
      sub: "Frequently used addresses",
    },
    {
      title: "Templates",
      value: "3",
      sub: "Custom invoice formats",
    },
  ];

  const actions = [
    {
      title: "Create New Invoice",
      desc: "Generate GST invoices instantly with templates.",
      icon: "🧾",
      href: "select",
    },
    {
      title: "View Old Invoices",
      desc: "Access, edit, or download previous invoices.",
      icon: "📂",
      href: "/invoices",
    },
    {
      title: "Saved Addresses",
      desc: "Manage client addresses and GST details.",
      icon: "📍",
      href: "/addresses",
    },
    {
      title: "Invoice Templates",
      desc: "Choose between different invoice layouts.",
      icon: "📄",
      href: "/templates",
    },
    {
      title: "Reports & Analytics",
      desc: "Track revenue and invoice activity.",
      icon: "📊",
      href: "/reports",
    },
    {
      title: "Export PDFs",
      desc: "Download high quality printable invoices.",
      icon: "⬇️",
      href: "/exports",
    },
  ];

  const recentInvoices = [
    {
      id: "INV-1024",
      client: "ITC Limited",
      amount: "₹12,400",
      status: "Paid",
    },
    {
      id: "INV-1025",
      client: "ABC Logistics",
      amount: "₹7,850",
      status: "Pending",
    },
    {
      id: "INV-1026",
      client: "Sharma Traders",
      amount: "₹4,320",
      status: "Paid",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              AC Invoice Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Smart GST invoice management system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              Settings
            </button>

            <button className="rounded-2xl bg-black px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl" onClick={() => router.push("/select")}>
              + New Invoice
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
                Invoice Automation Platform
              </p>

              <h2 className="text-4xl font-black leading-tight md:text-5xl">
                Create GST Invoices in Seconds.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-300 md:text-lg">
                Generate professional invoices, save client data,
                manage templates, and export PDFs effortlessly.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-2xl bg-white px-6 py-3 font-bold text-black shadow-xl transition hover:-translate-y-1">
                  Create Invoice
                </button>

                <button className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20">
                  View Reports
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
                >
                  <p className="text-sm text-slate-300">{stat.title}</p>
                  <h3 className="mt-2 text-3xl font-black">{stat.value}</h3>
                  <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black">Quick Actions</h2>
              <p className="mt-1 text-slate-500">
                Everything you need for invoice management.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition group-hover:scale-110 group-hover:bg-black group-hover:text-white">
                    {action.icon}
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    Open
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-tight">
                  {action.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Invoices */}
        <section className="mt-14 grid gap-8 lg:grid-cols-[1.5fr,1fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Recent Invoices</h2>
                <p className="text-sm text-slate-500">
                  Recently generated invoice records.
                </p>
              </div>

              <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold transition hover:bg-slate-200">
                View All
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Invoice</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentInvoices.map((invoice, index) => (
                    <tr
                      key={index}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-semibold">
                        {invoice.id}
                      </td>

                      <td className="px-6 py-5">{invoice.client}</td>

                      <td className="px-6 py-5 font-semibold">
                        {invoice.amount}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${invoice.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black">Saved Clients</h2>

              <div className="mt-6 space-y-4">
                {[
                  "ITC Limited",
                  "ABC Logistics",
                  "Sharma Traders",
                  "Metro Transport",
                ].map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <h3 className="font-bold">{client}</h3>
                      <p className="text-sm text-slate-500">
                        GST & address saved
                      </p>
                    </div>

                    <button className="rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:shadow-md">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-black p-8 text-white shadow-2xl">
              <h2 className="text-2xl font-black">Need Quick Export?</h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Download invoices instantly as high quality PDFs for printing
                and sharing.
              </p>

              <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-bold text-black transition hover:-translate-y-1">
                Export PDF
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
