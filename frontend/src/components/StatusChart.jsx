import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const colors = ['#7C3AED', '#A78BFA', '#C4B5FD']

export function StatusChart({ summary }) {
  const data = [{ name: 'To do', value: summary.todo }, { name: 'In progress', value: summary.in_progress }, { name: 'Done', value: summary.done }].filter((item) => item.value > 0)
  if (data.length === 0) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">No tasks to display yet.</div>
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={94} paddingAngle={4} stroke="none">
            {data.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
