import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const statusColors = ['#7C3AED', '#A78BFA', '#C4B5FD']

export function StatusChart({ data, completedPercentage }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        No status data available yet.
      </div>
    )
  }

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={98}
            paddingAngle={4}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={statusColors[index % statusColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{completedPercentage}%</span>
        <span className="mt-1 text-xs font-medium text-slate-400">completed</span>
      </div>
    </div>
  )
}
