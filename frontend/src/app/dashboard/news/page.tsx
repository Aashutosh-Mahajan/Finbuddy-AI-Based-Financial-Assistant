'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Newspaper,
    TrendingUp,
    TrendingDown,
    Globe,
    Share2,
    Bookmark,
    ExternalLink,
    MessageCircle,
    Loader2,
    RefreshCw,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { formatDate } from '@/lib/utils'
import { api } from '@/lib/api'

interface NewsItem {
    id: number
    title: string
    summary: string
    source: string
    sentiment: string
    impact: string
    date: string
    category: string
    imageUrl: string
}

export default function NewsPage() {
    const [filter, setFilter] = useState<'all' | 'market' | 'economy' | 'tech'>('all')
    const [newsItems, setNewsItems] = useState<NewsItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchNews = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/insights/market-news')
            if (response.data?.news && Array.isArray(response.data.news)) {
                const apiNews = response.data.news.map((item: any, idx: number) => ({
                    id: idx + 1,
                    title: item.title || 'Market Update',
                    summary: item.summary || item.description || '',
                    source: item.source || 'FinBuddy AI',
                    sentiment: item.sentiment || 'Neutral',
                    impact: item.impact || 'Review your portfolio.',
                    date: item.date || new Date().toISOString(),
                    category: item.category?.toLowerCase() || 'market',
                    imageUrl: item.imageUrl || `https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`,
                }))
                setNewsItems(apiNews)
            } else {
                // If no news from API, show empty state
                setNewsItems([])
            }
        } catch (error) {
            console.error('Failed to fetch news:', error)
            setNewsItems([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNews()
    }, [])

    const filteredNews = filter === 'all' ? newsItems : newsItems.filter((n: NewsItem) => n.category === filter)

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
                        <p className="text-slate-400">Curated financial news and sentiment analysis</p>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                        {['all', 'market', 'economy', 'tech'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === cat
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Story */}
                {newsItems.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute inset-0">
                            <img
                                src={newsItems[1].imageUrl}
                                alt="Featured"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full mb-3">
                                FEATURED
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                                {newsItems[1].title}
                            </h2>
                            <p className="text-slate-300 max-w-2xl text-lg mb-4 line-clamp-2">
                                {newsItems[1].summary}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                                <span className="flex items-center">
                                    <Globe className="w-4 h-4 mr-1" />
                                    {newsItems[1].source}
                                </span>
                                <span>•</span>
                                <span>{formatDate(newsItems[1].date)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((news: NewsItem, idx: number) => (
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card overflow-hidden hover:border-primary-500/50 transition-all group flex flex-col h-full"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={news.imageUrl}
                                    alt={news.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${news.sentiment === 'Positive' ? 'bg-green-500/90 text-white' :
                                        news.sentiment === 'Negative' ? 'bg-red-500/90 text-white' :
                                            'bg-slate-500/90 text-white'
                                        }`}>
                                        {news.sentiment}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center space-x-2 mb-3 text-xs text-slate-400">
                                    <span className="text-primary-400 font-medium uppercase">{news.source}</span>
                                    <span>•</span>
                                    <span>{formatDate(news.date)}</span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                                    {news.title}
                                </h3>

                                <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-1">
                                    {news.summary}
                                </p>

                                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4">
                                    <p className="text-xs text-slate-300">
                                        <span className="text-primary-400 font-bold">AI Insight:</span> {news.impact}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                    <button className="text-slate-400 hover:text-white transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button className="flex items-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                        Read Full Story <ExternalLink className="w-4 h-4 ml-1" />
                                    </button>
                                    <button className="text-slate-400 hover:text-white transition-colors">
                                        <Bookmark className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                )}
            </div>
        </DashboardLayout>
    )
}
