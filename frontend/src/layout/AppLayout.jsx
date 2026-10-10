import { Sidebar } from '../components/Sidebar'

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8F9FC] text-slate-900">
      <Sidebar />
      <main id="main-content" className="min-w-0 min-h-screen lg:pl-64">
        <div className="mx-auto min-w-0 max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  )
}
