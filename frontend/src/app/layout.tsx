import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

export const metadata: Metadata = {
    title: 'FinBuddy - AI Financial Assistant',
    description: 'Your intelligent financial coach powered by AI',
    keywords: ['finance', 'ai', 'assistant', 'budgeting', 'investments'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="min-h-screen bg-dark-400">
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1e293b',
                                color: '#f1f5f9',
                                border: '1px solid #334155',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#f1f5f9',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#f1f5f9',
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    )
}
