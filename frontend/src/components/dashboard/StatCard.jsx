export function StatCard({ label, value, icon: Icon, iconClassName, helper }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconClassName}`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400">{helper}</p>
    </article>
  )
}
