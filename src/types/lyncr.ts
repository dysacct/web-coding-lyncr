export type RedeemState = 'idle' | 'loading' | 'success' | 'error'

export interface Member {
  id: number
  name: string
  email: string
  role: string
  status: string
  stones: number
  avatar: string
  color: string
  joined: string
}

export interface ModelInfo {
  id: number
  name: string
  subtitle: string
  tier: string
  tierClass: string
  cost: number
  context: string
  status: string
  desc: string
  icon: string
  iconColor: string
}

export interface ConsumptionPoint {
  date: string
  stones: number
}

export interface ActivityItem {
  id: number
  user: string
  action: string
  delta: number
  time: string
  type: 'api' | 'redeem' | 'topup'
}

export interface ModelUsage {
  name: string
  calls: number
  pct: number
  color: string
}

export interface StatCard {
  label: string
  value: string
  unit: string
  icon: string
  iconColor: string
  iconBg: string
  border: string
  change: string | null
  positive?: boolean
  sub: string
}
