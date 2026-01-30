'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    ArrowRight,
    Bot,
    LineChart,
    Shield,
    Wallet,
    TrendingUp,
    PiggyBank,
    CreditCard,
    Sparkles
} from 'lucide-react'

const features = [
    {
        icon: Bot,
        title: 'AI-Powered Insights',
        description: 'Get personalized financial advice from our GPT-5.1 powered agents.',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: LineChart,
        title: 'Investment Tracking',
        description: 'Track stocks, mutual funds, and get real-time market updates.',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: Wallet,
        title: 'Smart Budgeting',
        description: 'Automatic categorization and spending analysis.',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Bank-grade security for your financial data.',
        gradient: 'from-orange-500 to-red-500',
    },
]

const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '₹100Cr+', label: 'Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9★', label: 'Rating' },
]

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold text-white">FinBuddy</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#features" className="text-slate-400 hover:text-white transition-colors">Features</Link>
                            <Link href="#agents" className="text-slate-400 hover:text-white transition-colors">AI Agents</Link>
                            <Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="btn-ghost">Login</Link>
                            <Link href="/register" className="btn-primary">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
                            <Sparkles className="w-4 h-4 text-primary-400" />
                            <span className="text-sm text-primary-400">Powered by GPT-5.1</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                            <span className="text-white">Your AI-Powered</span>
                            <br />
                            <span className="text-gradient">Financial Coach</span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                            FinBuddy helps you track expenses, grow investments, and achieve financial freedom
                            with 13 specialized AI agents working for you 24/7.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                                <span>Start Free Trial</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/demo" className="btn-secondary text-lg px-8 py-4">
                                Watch Demo
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card p-6">
                                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Comprehensive financial management powered by cutting-edge AI technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="glass-card-hover p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Agents Section */}
            <section id="agents" className="py-20 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-white mb-4">
                            13 Specialized AI Agents
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Each agent is trained to excel in specific financial domains.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Block 1 */}
                        <div className="glass-card p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <PiggyBank className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Money Management</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>• OCR Agent - Extract from SMS/receipts</li>
                                <li>• Watchdog Agent - Anomaly detection</li>
                                <li>• Categorize Agent - Smart classification</li>
                                <li>• Investment Detector - Find patterns</li>
                                <li>• Money Growth Agent - Budget advice</li>
                                <li>• News Agent - Personal finance updates</li>
                            </ul>
                        </div>

                        {/* Block 2 */}
                        <div className="glass-card p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Investment</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>• Analysis Agent - Risk profiling</li>
                                <li>• Stock Agent - Equity research</li>
                                <li>• Investment Agent - Portfolio planning</li>
                                <li>• Market News Agent - Real-time updates</li>
                            </ul>
                        </div>

                        {/* Block 3 */}
                        <div className="glass-card p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-orange-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Financial Products</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>• Credit Card Agent - Best card matching</li>
                                <li>• ITR Agent - Tax optimization</li>
                                <li>• Loan Agent - EMI & eligibility</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="glass-card p-12 relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-cyan-600/20" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                                Ready to Transform Your Finances?
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Join thousands of users who are already achieving their financial goals with FinBuddy.
                            </p>
                            <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
                                <span>Get Started Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-display font-bold text-white">FinBuddy</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            © 2024 FinBuddy. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
