import { Sidebar } from '../components/Sidebar'

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900">
      <Sidebar />
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  )
}
