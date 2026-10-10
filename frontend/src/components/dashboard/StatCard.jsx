export function StatCard({ label, value, icon: Icon, iconClassName, helper }) {
  return (
    <article className="group flex min-h-[156px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/50 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md hover:shadow-slate-200/60 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`rounded-2xl p-3.5 ring-1 ring-inset ring-black/5 transition-transform duration-200 group-hover:scale-105 ${iconClassName}`}>
          <Icon size={21} strokeWidth={2.1} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-5 border-t border-slate-100 pt-3 text-xs font-medium text-slate-400">{helper}</p>
    </article>
  )
}
