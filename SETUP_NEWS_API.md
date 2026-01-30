# Setting Up News API for Real-Time Financial News

## Overview
The News Agent now supports real-time web search using NewsAPI to fetch actual financial news articles. If no API key is provided, it falls back to curated news content.

## Getting NewsAPI Key (Free)

### Option 1: NewsAPI.org (Recommended)
1. Visit [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key" or "Sign Up"
3. Create a free account (requires email verification)
4. Copy your API key from the dashboard
5. Free tier includes:
   - 100 requests per day
   - Articles from 150,000+ sources
   - Search by keyword, category, or source

### Option 2: Alternative News APIs
- **Finnhub**: [https://finnhub.io/](https://finnhub.io/) - Financial news API
- **Alpha Vantage**: [https://www.alphavantage.co/](https://www.alphavantage.co/) - Market data with news
- **Marketaux**: [https://www.marketaux.com/](https://www.marketaux.com/) - Financial news API

## Configuration

### Backend Setup
1. Open `.env` file in the root directory
2. Find the line: `NEWS_API_KEY=your-news-api-key`
3. Replace with your actual API key:
   ```env
   NEWS_API_KEY=your_actual_api_key_here
   ```

### Restart Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## How It Works

### With API Key
- News Agent makes real-time API calls to fetch latest news
- Articles are filtered for Indian market and financial topics
- Returns: title, summary, source, URL, published date, sentiment

### Without API Key (Fallback)
- Uses curated financial news templates
- Provides relevant market updates
- Still functional but not real-time

## Testing the News Feature

### 1. Backend Test
```bash
# Test the endpoint directly
curl http://localhost:8000/api/v1/insights/market-news
```

### 2. Frontend Test
1. Navigate to Dashboard → News section
2. Click refresh to fetch latest news
3. Check browser console for any errors

### 3. Verify News Source
- With API: Should show actual news sources (ET, Bloomberg, etc.)
- Without API: Shows "FinBuddy AI" as fallback source

## Troubleshooting

### Issue: "No news available"
**Solution**: 
- Check if NEWS_API_KEY is set in .env
- Verify API key is valid at newsapi.org
- Check rate limits (100 requests/day on free tier)

### Issue: "Failed to fetch news"
**Solution**:
- Check internet connection
- Verify backend is running
- Check backend logs for detailed error messages

### Issue: Same news every time
**Solution**:
- This is expected behavior without API key (fallback mode)
- Add NEWS_API_KEY to enable real-time updates

## Features

✅ **Real-time News Fetching** - Live articles from 150,000+ sources  
✅ **Sentiment Analysis** - Positive/Negative/Neutral classification  
✅ **Source Attribution** - Proper credit to news sources  
✅ **Graceful Fallback** - Works even without API key  
✅ **Rate Limit Handling** - Automatic fallback on API errors  
✅ **Indian Market Focus** - Prioritizes Indian financial news  

## API Request Example

The news agent searches for:
- "Indian stock market"
- "Nifty 50"
- "Sensex"
- "Financial news India"
- Banking, IT, and other sector updates

Query parameters:
- Language: English
- Sort by: Published date (most recent first)
- Time range: Last 7 days
- Results: Configurable (default 10)

## Future Enhancements

- [ ] Multiple news source aggregation
- [ ] Advanced sentiment analysis using AI
- [ ] News category classification
- [ ] Impact score calculation
- [ ] Personalized news based on user portfolio
- [ ] Real-time news alerts via WebSocket

## Support

For issues or questions:
- Check backend logs: `backend/logs/`
- Review API documentation: [NewsAPI Docs](https://newsapi.org/docs)
- Ensure environment variables are properly set
