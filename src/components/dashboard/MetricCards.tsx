export function MetricCards() {
  const metrics = [
    { label: 'Active Projects', value: '0' },
    { label: 'Content Created', value: '0' },
    { label: 'Pending Reviews', value: '0' },
    { label: 'Current Spend', value: '₹0' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white border border-nexus-border rounded-xl p-5 flex flex-col shadow-sm">
          <span className="text-xs font-medium text-nexus-secondary-text mb-2 uppercase tracking-wide">{m.label}</span>
          <span className="text-2xl font-semibold text-nexus-primary font-mono">{m.value}</span>
        </div>
      ))}
    </div>
  )
}
