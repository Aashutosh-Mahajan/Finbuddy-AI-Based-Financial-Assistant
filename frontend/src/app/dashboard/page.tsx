'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard,
    PieChart,
    Bell,
    Loader2,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchDashboardSummary, fetchSpendingTrends, fetchAlerts } from '@/store/slices/dashboardSlice'
import { fetchTransactions } from '@/store/slices/transactionsSlice'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

export default function DashboardPage() {
    const dispatch = useAppDispatch()
    const { summary, spendingTrends, alerts, isLoading: dashboardLoading } = useAppSelector((state: any) => state.dashboard)
    const { transactions, isLoading: transactionsLoading } = useAppSelector((state: any) => state.transactions)
    const { user } = useAppSelector((state: any) => state.auth)

    useEffect(() => {
        dispatch(fetchDashboardSummary())
        dispatch(fetchSpendingTrends('month'))
        dispatch(fetchAlerts())
        dispatch(fetchTransactions({ limit: 5 }))
    }, [dispatch])

    const isLoading = dashboardLoading || transactionsLoading

    // Calculate health score dynamically based on savings rate
    const savingsRate = summary?.savings_rate || 0
    const healthScore = Math.min(100, Math.max(0, Math.round(savingsRate * 2 + 40))) // Scale from 40-100

    const getHealthLabel = (score: number) => {
        if (score >= 80) return { label: 'Excellent', color: 'text-green-400' }
        if (score >= 60) return { label: 'Good', color: 'text-green-400' }
        if (score >= 40) return { label: 'Fair', color: 'text-yellow-400' }
        return { label: 'Needs Work', color: 'text-red-400' }
    }

    const healthInfo = getHealthLabel(healthScore)

    // Build chart data from spending trends - ensure it's always an array
    const trendsArray = Array.isArray(spendingTrends) ? spendingTrends : []
    const chartLabels = trendsArray.length > 0 
        ? trendsArray.map((t: any) => t.category || t.month || t.label)
        : (summary ? ['This Month'] : [])
    
    const spendingData = {
        labels: chartLabels.length > 0 ? chartLabels : ['No Data'],
        datasets: [
            {
                label: 'Income',
                data: trendsArray.length > 0 
                    ? trendsArray.map((t: any) => t.income || 0)
                    : (summary ? [summary.monthly_income] : [0]),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Expense',
                data: trendsArray.length > 0
                    ? trendsArray.map((t: any) => t.expenses || 0)
                    : (summary ? [summary.monthly_expenses] : [0]),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4,
            }
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const, labels: { color: '#94a3b8' } },
        },
        scales: {
            x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
        }
    }

    // Get category icon based on transaction category
    const getCategoryIcon = (category: string) => {
        return <CreditCard className="w-5 h-5 text-slate-400" />
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back, <span className="text-primary-400">{user?.full_name || 'User'}</span> 👋
                        </h1>
                        <p className="text-slate-400">Here's your financial health overview for today.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {isLoading && (
                            <div className="flex items-center text-slate-400 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Loading...
                            </div>
                        )}
                        <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-slate-300">Market Open</span>
                        </div>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* Financial Health Score (Large Square) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 lg:row-span-2 glass-card p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 border-t-4 border-t-primary-500"
                    >
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Financial Score</h3>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                                <circle
                                    cx="80" cy="80" r="70" stroke="#8b5cf6" strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * healthScore) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-white">{healthScore}</span>
                                <span className={`text-xs font-medium pt-1 ${healthInfo.color}`}>{healthInfo.label}</span>
                            </div>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-6 px-4">
                            {summary?.savings_rate
                                ? `Savings rate: ${summary.savings_rate.toFixed(1)}%`
                                : 'Add transactions to calculate your score'}
                        </p>
                    </motion.div>

                    {/* Income vs Expenses Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 lg:col-span-2 glass-card p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Cash Flow</h3>
                            <span className="text-xs text-slate-400">This Month</span>
                        </div>
                        <div className="h-48">
                            {summary ? (
                                <Line data={spendingData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    No data yet - add transactions to see trends
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="md:col-span-3 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-4 flex flex-col justify-between h-full bg-gradient-to-br from-green-900/20 to-slate-900 border-l-4 border-l-green-500"
                        >
                            <div>
                                <p className="text-xs text-slate-400 uppercase">Total Income</p>
                                <h4 className="text-xl font-bold text-white mt-1">
                                    {formatCurrency(summary?.monthly_income || 0)}
                                </h4>
                            </div>
                            <div className="mt-2 text-xs text-green-400 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> This month
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-4 flex flex-col justify-between h-full bg-gradient-to-br from-red-900/20 to-slate-900 border-l-4 border-l-red-500"
                        >
                            <div>
                                <p className="text-xs text-slate-400 uppercase">Total Expenses</p>
                                <h4 className="text-xl font-bold text-white mt-1">
                                    {formatCurrency(summary?.monthly_expenses || 0)}
                                </h4>
                            </div>
                            <div className="mt-2 text-xs text-red-400 flex items-center">
                                <ArrowDownRight className="w-3 h-3 mr-1" /> This month
                            </div>
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-2 lg:col-span-2 glass-card p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            <a href="/dashboard/transactions" className="text-xs text-primary-400 hover:text-primary-300">View All</a>
                        </div>
                        <div className="space-y-4">
                            {transactions && transactions.length > 0 ? (
                                transactions.slice(0, 5).map((tx: any) => (
                                    <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                                {getCategoryIcon(tx.category)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{tx.merchant || tx.description || 'Transaction'}</p>
                                                <p className="text-xs text-slate-500">{tx.category} • {formatDate(tx.date || tx.transaction_date)}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                                            {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No transactions yet</p>
                                    <a href="/dashboard/transactions" className="text-primary-400 text-sm hover:underline">Add your first transaction</a>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Smart Alerts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="md:col-span-1 lg:col-span-2 glass-card p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Bell className="w-32 h-32 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4 relative z-10">Smart Alerts</h3>
                        <div className="space-y-3 relative z-10">
                            {alerts && alerts.length > 0 ? (
                                alerts.slice(0, 3).map((alert: any) => (
                                    <div
                                        key={alert.id}
                                        className={`p-3 rounded-lg flex items-start space-x-3 ${alert.type === 'danger' ? 'bg-red-500/10 border border-red-500/20' :
                                                alert.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/20' :
                                                    'bg-blue-500/10 border border-blue-500/20'
                                            }`}
                                    >
                                        <Activity className={`w-5 h-5 mt-0.5 ${alert.type === 'danger' ? 'text-red-400' :
                                                alert.type === 'warning' ? 'text-orange-400' :
                                                    'text-blue-400'
                                            }`} />
                                        <div>
                                            <p className={`text-sm font-medium ${alert.type === 'danger' ? 'text-red-200' :
                                                    alert.type === 'warning' ? 'text-orange-200' :
                                                        'text-blue-200'
                                                }`}>{alert.title}</p>
                                            <p className={`text-xs ${alert.type === 'danger' ? 'text-red-400/70' :
                                                    alert.type === 'warning' ? 'text-orange-400/70' :
                                                        'text-blue-400/70'
                                                }`}>{alert.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start space-x-3">
                                    <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-200">All Clear!</p>
                                        <p className="text-xs text-green-400/70">No alerts at this time. Your finances look healthy.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </DashboardLayout>
    )
}
