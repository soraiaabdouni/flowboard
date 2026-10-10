import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'

const statusColors = ['#7C3AED', '#8B5CF6', '#C4B5FD']

export function StatusChart({ data, completedPercentage }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center text-sm font-medium text-slate-400">
        No status data available yet.
      </div>
    )
  }

  return (
    <div className="relative h-56 w-full min-w-0 sm:h-64" role="img" aria-label={`Task status: ${data.map((item) => `${item.name} ${item.value}`).join(', ')}. ${completedPercentage}% completed.`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="82%"
            paddingAngle={3}
            stroke="#ffffff"
            strokeWidth={3}
            isAnimationActive={!prefersReducedMotion}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={statusColors[index % statusColors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} tasks`, name]}
            contentStyle={{
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.1)',
              fontSize: '12px',
              fontWeight: 600,
            }}
            itemStyle={{ color: '#475569' }}
            labelStyle={{ color: '#0f172a', fontWeight: 700 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{completedPercentage}%</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">completed</span>
      </div>
    </div>
  )
}
