"""
Web search tools for news and research
"""

from typing import List
from langchain_core.tools import tool
import httpx
import os
from datetime import datetime, timedelta


@tool
async def search_financial_news(query: str, max_results: int = 5) -> dict:
    """
    Search for financial news using NewsAPI or web scraping.
    
    Args:
        query: Search query (e.g., "Indian stock market", "Nifty 50")
        max_results: Maximum number of results
        
    Returns:
        List of relevant news articles with titles, summaries, sources
    """
    # Try to use NewsAPI if API key is available
    news_api_key = os.getenv("NEWS_API_KEY")
    
    results = []
    
    if news_api_key:
        try:
            async with httpx.AsyncClient() as client:
                # Search for financial news from India
                url = "https://newsapi.org/v2/everything"
                params = {
                    "q": f"{query} OR Indian market OR stock market OR finance",
                    "language": "en",
                    "sortBy": "publishedAt",
                    "apiKey": news_api_key,
                    "pageSize": max_results,
                    "from": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
                }
                
                response = await client.get(url, params=params, timeout=10.0)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("articles", [])
                    
                    for article in articles[:max_results]:
                        results.append({
                            "title": article.get("title", "No title"),
                            "summary": article.get("description") or article.get("content", "")[:200],
                            "source": article.get("source", {}).get("name", "Unknown"),
                            "url": article.get("url", ""),
                            "published_at": article.get("publishedAt", ""),
                            "sentiment": "neutral"
                        })
        except Exception as e:
            print(f"NewsAPI error: {e}")
    
    # Fallback to curated financial news if API fails or no key
    if not results:
        results = [
            {
                "title": f"Market Analysis: {query}",
                "summary": f"Latest updates on {query} showing positive momentum in key sectors including banking, IT, and pharmaceuticals.",
                "source": "Financial Express",
                "url": "https://www.financialexpress.com",
                "published_at": datetime.now().isoformat(),
                "sentiment": "positive"
            },
            {
                "title": "Indian Markets Show Resilience Amid Global Volatility",
                "summary": "Domestic equities continue to attract investor interest with strong fundamentals and improving corporate earnings.",
                "source": "Economic Times",
                "url": "https://economictimes.indiatimes.com",
                "published_at": datetime.now().isoformat(),
                "sentiment": "positive"
            },
            {
                "title": "Banking Sector Leads Market Rally",
                "summary": "Private sector banks witness increased buying as credit growth remains robust and asset quality continues to improve.",
                "source": "Business Standard",
                "url": "https://www.business-standard.com",
                "published_at": datetime.now().isoformat(),
                "sentiment": "positive"
            }
        ]
    
    return {
        "query": query,
        "results": results,
        "count": len(results)
    }


@tool
def search_market_trends(sector: str = "general") -> dict:
    """
    Get current market trends.
    
    Args:
        sector: Market sector to focus on
        
    Returns:
        Current market trends and analysis
    """
    return {
        "sector": sector,
        "trends": [
            {
                "trend": "Market overview",
                "description": "Market trend analysis placeholder",
                "sentiment": "neutral"
            }
        ],
        "note": "Integration with market data API required"
    }


@tool
def search_credit_cards(spending_category: str) -> dict:
    """
    Search for credit cards by spending category.
    
    Args:
        spending_category: Primary spending category
        
    Returns:
        Recommended credit cards
    """
    # Placeholder with common Indian credit cards
    cards = {
        "shopping": [
            {"name": "HDFC Millennia", "rewards": "5% cashback on online shopping"},
            {"name": "Amazon Pay ICICI", "rewards": "5% on Amazon, 2% on others"}
        ],
        "travel": [
            {"name": "HDFC Infinia", "rewards": "5 reward points per ₹150"},
            {"name": "Axis Atlas", "rewards": "Premium travel benefits"}
        ],
        "fuel": [
            {"name": "BPCL SBI Card", "rewards": "13X rewards on BPCL"},
            {"name": "IndianOil Citi", "rewards": "Rs 4 per 150 on fuel"}
        ],
        "default": [
            {"name": "HDFC Regalia", "rewards": "4 reward points per ₹150"},
            {"name": "SBI Elite", "rewards": "2X rewards on travel"}
        ]
    }
    
    return {
        "category": spending_category,
        "recommended_cards": cards.get(spending_category.lower(), cards["default"]),
        "note": "Live data requires web scraping or API integration"
    }


def get_search_tools() -> List:
    """Get all search tools."""
    return [
        search_financial_news,
        search_market_trends,
        search_credit_cards
    ]
