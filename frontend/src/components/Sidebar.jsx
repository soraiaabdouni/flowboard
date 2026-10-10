import { LayoutDashboard, ListTodo } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
]

export function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center px-5 py-5 lg:block lg:px-7 lg:py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white shadow-lg shadow-violet-200">F</div>
          <div><p className="text-lg font-bold tracking-tight text-slate-900">FlowBoard</p><p className="text-xs font-medium text-slate-400">Workspace</p></div>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2 lg:px-4">
        <p className="hidden px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:block">Menu</p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Icon size={18} strokeWidth={2} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto hidden p-6 lg:block">
        <div className="rounded-2xl bg-violet-600 p-5 text-white shadow-lg shadow-violet-100"><p className="text-sm font-bold">Stay on track</p><p className="mt-1 text-xs leading-5 text-violet-100">Organize your work and keep your team moving forward.</p></div>
      </div>
    </aside>
  )
}
