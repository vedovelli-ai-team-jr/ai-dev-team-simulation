import React from 'react'

export interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  subtitle?: string
}

export function StatsCard({ icon, label, value, subtitle }: StatsCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="text-slate-400 text-xl">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-slate-400 mb-2">{label}</h3>
      <div className="text-3xl font-bold text-slate-100 mb-1">{value}</div>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}
