'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    RefreshCcw,
    Download,
    Calendar,
    CreditCard,
    ShoppingBag,
    Coffee,
    Zap,
    Loader2,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '@/lib/utils'
import { useAppDispatch, useAppSelector, RootState } from '@/store/hooks'
import { fetchTransactions, fetchTransactionStats } from '@/store/slices/transactionsSlice'

// Loading skeleton component for fast perceived loading
function TransactionSkeleton() {
    return (
        <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center px-6 py-4 border-b border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 mr-3" />
                    <div className="flex-1">
                        <div className="h-4 bg-slate-700 rounded w-32 mb-2" />
                        <div className="h-3 bg-slate-700/50 rounded w-20" />
                    </div>
                    <div className="h-4 bg-slate-700 rounded w-20" />
                </div>
            ))}
        </div>
    )
}

// Stats skeleton for loading state
function StatsSkeleton() {
    return (
        <div className="glass-card p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-700" />
                <div className="h-4 bg-slate-700 rounded w-16" />
            </div>
            <div className="h-3 bg-slate-700/50 rounded w-24 mb-2" />
            <div className="h-6 bg-slate-700 rounded w-32" />
        </div>
    )
}

export default function TransactionsPage() {
    const dispatch = useAppDispatch()
    const { transactions, stats, isLoading } = useAppSelector((state: any) => state.transactions)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    useEffect(() => {
        // Fetch both in parallel for faster loading
        const loadData = async () => {
            await Promise.all([
                dispatch(fetchTransactions({})),
                dispatch(fetchTransactionStats('month'))
            ])
            setIsInitialLoad(false)
        }
        
        // Only fetch if we don't have data already (prevents re-fetch on tab switch)
        if (transactions.length === 0 || !stats) {
            loadData()
        } else {
            setIsInitialLoad(false)
        }
    }, [dispatch])

    // Memoize filtered results to avoid recalculation on every render
    const recurringPayments = useMemo(() => 
        transactions.filter((t: any) => t.is_recurring), 
        [transactions]
    )

    const filteredTransactions = useMemo(() => 
        transactions.filter((t: any) =>
            (selectedCategory === 'All' || t.category === selectedCategory) &&
            ((t.merchant || t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
        ),
        [transactions, selectedCategory, searchTerm]
    )

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Transactions</h1>
                        <p className="text-slate-400">Manage and track your financial activity</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="btn-secondary flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                        <button className="btn-primary flex items-center space-x-2">
                            <Wallet className="w-4 h-4" />
                            <span>Add New</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isInitialLoad && !stats ? (
                        <>
                            <StatsSkeleton />
                            <StatsSkeleton />
                            <StatsSkeleton />
                        </>
                    ) : (
                        <>
                            <motion.div
                                className="glass-card p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-green-400 text-sm font-medium">This month</span>
                                </div>
                                <p className="text-sm text-slate-400">Total Income</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {formatCurrency(stats?.total_income || 0)}
                                </p>
                            </motion.div>

                            <motion.div
                                className="glass-card p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                <ArrowDownRight className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-red-400 text-sm font-medium">This month</span>
                        </div>
                        <p className="text-sm text-slate-400">Total Expenses</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {formatCurrency(stats?.total_expenses || 0)}
                        </p>
                    </motion.div>

                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-blue-400 text-sm font-medium">{stats?.net >= 0 ? 'Healthy' : 'Review'}</span>
                        </div>
                        <p className="text-sm text-slate-400">Net Savings</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {formatCurrency(stats?.net || 0)}
                        </p>
                    </motion.div>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Transaction List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filters */}
                        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
                                {['All', 'Food', 'Shopping', 'Bills', 'Transport'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="glass-card overflow-hidden">
                            {isLoading && isInitialLoad ? (
                                <TransactionSkeleton />
                            ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-700 bg-slate-800/50">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {filteredTransactions.length > 0 ? (
                                            filteredTransactions.map((t: any) => (
                                                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                                                                {getCategoryIcon(t.category)}
                                                            </div>
                                                            <span className="font-medium text-white">{t.merchant || t.description || 'Transaction'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.transaction_type === 'credit' || t.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'
                                                            }`}>
                                                            {t.category || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                        {formatDate(t.transaction_date || t.date)}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.transaction_type === 'credit' || t.type === 'credit' ? 'text-green-400' : 'text-slate-200'
                                                        }`}>
                                                        {t.transaction_type === 'credit' || t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                                    <p className="text-slate-500">No transactions found</p>
                                                    <p className="text-sm text-slate-600 mt-1">Add your first transaction to get started</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Recurring Payments */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-l-4 border-l-primary-500">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-primary-500/20 rounded-lg">
                                    <RefreshCcw className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Recurring Hub</h2>
                                    <p className="text-xs text-slate-400">Detected subscriptions & bills</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {recurringPayments.length > 0 ? recurringPayments.map((payment: any) => (
                                    <div key={payment.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary-500/50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors text-lg">
                                                    {getCategoryIcon(payment.category)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm">{payment.merchant || payment.description || 'Recurring'}</p>
                                                    <p className="text-xs text-slate-500">{payment.category || 'Monthly'}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-white text-sm">{formatCurrency(payment.amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs w-full mt-2 pt-2 border-t border-slate-700/50">
                                            <span className="text-slate-500">Next Due:</span>
                                            <span className="text-primary-300 bg-primary-500/10 px-2 py-0.5 rounded">{formatDate(payment.transaction_date || payment.date)}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 text-slate-500">
                                        <RefreshCcw className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No recurring payments detected</p>
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-6 btn-secondary text-xs py-2">
                                Scan for more
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-center transition-colors">
                                    <CreditCard className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                                    <span className="text-xs text-slate-300">Pay Bill</span>
                                </button>
                                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-center transition-colors">
                                    <Calendar className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                                    <span className="text-xs text-slate-300">Schedule</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
