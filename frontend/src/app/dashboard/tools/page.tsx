'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Calculator,
    CreditCard,
    FileText,
    Home,
    GraduationCap,
    Car,
    PieChart,
    DollarSign,
    Briefcase,
    TrendingUp,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export default function ToolsPage() {
    const [activeCategory, setActiveCategory] = useState<'all' | 'tax' | 'loans' | 'planning'>('all')

    const tools = [
        {
            id: 'tax-calc',
            name: 'Tax Regime Optimizer',
            desc: 'Compare Old vs New Tax Regime to find maximum savings.',
            icon: FileText,
            color: 'blue',
            category: 'tax',
        },
        {
            id: 'cc-finder',
            name: 'Credit Card Matcher',
            desc: 'Find the perfect card based on your spending habits.',
            icon: CreditCard,
            color: 'purple',
            category: 'planning',
        },
        {
            id: 'emi-calc',
            name: 'Smart EMI Planner',
            desc: 'Calculate loan EMIs with prepayment strategies.',
            icon: Calculator,
            color: 'green',
            category: 'loans',
        },
        {
            id: 'home-loan',
            name: 'Home Loan Eligibility',
            desc: 'Check how much loan you can get based on income.',
            icon: Home,
            color: 'orange',
            category: 'loans',
        },
        {
            id: 'sip-calc',
            name: 'SIP Goal Planner',
            desc: 'Plan your investments to reach financial goals.',
            icon: TrendingUp,
            color: 'emerald',
            category: 'planning',
        },
        {
            id: 'education',
            name: 'Education Loan Assistant',
            desc: 'Find best interest rates for higher studies.',
            icon: GraduationCap,
            color: 'indigo',
            category: 'loans',
        },
    ]

    const filteredTools = activeCategory === 'all'
        ? tools
        : tools.filter(t => t.category === activeCategory)

    return (
        <DashboardLayout>
            <div className="space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Financial Toolkit</h1>
                        <p className="text-slate-400">Calculators and utilities to optimize your finances</p>
                    </div>

                    <div className="flex space-x-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        {['all', 'tax', 'loans', 'planning'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat as any)}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${activeCategory === cat
                                        ? 'bg-slate-700 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool, idx) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 hover:border-primary-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden"
                            onClick={() => alert(`Launching ${tool.name}... (This would open a modal)`)}
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <tool.icon className={`w-24 h-24 text-${tool.color}-500`} />
                            </div>

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${tool.color}-500/20 text-${tool.color}-400 group-hover:scale-110 transition-transform`}>
                                    <tool.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                    {tool.name}
                                </h3>

                                <p className="text-sm text-slate-400 mb-4 h-10">
                                    {tool.desc}
                                </p>

                                <div className="flex items-center text-xs font-medium text-slate-500 group-hover:text-primary-400 transition-colors">
                                    Launch Tool <TrendingUp className="w-3 h-3 ml-1" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Banner */}
                <div className="glass-card p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Need Personalized Advice?</h3>
                            <p className="text-sm text-slate-300 mb-3">Our AI Financial Coach can guide you through these tools step-by-step based on your specific situation.</p>
                            <button className="text-xs font-bold text-blue-400 hover:text-blue-300">Start a chat &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
