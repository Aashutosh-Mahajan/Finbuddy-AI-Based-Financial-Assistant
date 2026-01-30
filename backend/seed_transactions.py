"""
Seed script to create sample transactions in the database
Run this after a user has registered to populate their account with demo data
"""

import asyncio
import sys
from pathlib import Path

# Add the backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from datetime import datetime, timedelta
from decimal import Decimal
import random

from sqlalchemy import select
from app.core.database import async_session_maker
from app.models.user import User
from app.models.transaction import Transaction, TransactionType, TransactionCategory


async def seed_transactions():
    """Seed sample transactions for the first user in the database."""
    
    async with async_session_maker() as session:
        # Get the first user
        result = await session.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        
        if not user:
            print("❌ No users found. Please register a user first.")
            return
        
        print(f"✅ Found user: {user.email}")
        
        # Check if user already has transactions
        tx_result = await session.execute(
            select(Transaction).where(Transaction.user_id == user.id).limit(1)
        )
        if tx_result.scalar_one_or_none():
            print("ℹ️  User already has transactions. Skipping seed.")
            return
        
        # Sample transactions data
        sample_transactions = [
            # Income - Current Month
            {"amount": 75000, "type": TransactionType.CREDIT, "category": TransactionCategory.SALARY, 
             "merchant": "TechCorp India", "description": "Monthly Salary", "days_ago": 2},
            {"amount": 15000, "type": TransactionType.CREDIT, "category": TransactionCategory.FREELANCE, 
             "merchant": "Freelance Client", "description": "Web Development Project", "days_ago": 10},
            {"amount": 5000, "type": TransactionType.CREDIT, "category": TransactionCategory.BONUS, 
             "merchant": "TechCorp India", "description": "Performance Bonus", "days_ago": 15},
            
            # Housing & Utilities
            {"amount": 25000, "type": TransactionType.DEBIT, "category": TransactionCategory.RENT, 
             "merchant": "Property Owner", "description": "Monthly Rent", "days_ago": 1},
            {"amount": 4500, "type": TransactionType.DEBIT, "category": TransactionCategory.UTILITIES, 
             "merchant": "Electricity Board", "description": "Electricity Bill", "days_ago": 5},
            {"amount": 1500, "type": TransactionType.DEBIT, "category": TransactionCategory.UTILITIES, 
             "merchant": "Jio Fiber", "description": "Internet Bill", "days_ago": 5, "is_recurring": True},
            {"amount": 1200, "type": TransactionType.DEBIT, "category": TransactionCategory.UTILITIES, 
             "merchant": "Municipal Corporation", "description": "Water Bill", "days_ago": 8},
            {"amount": 800, "type": TransactionType.DEBIT, "category": TransactionCategory.UTILITIES, 
             "merchant": "Piped Natural Gas", "description": "Gas Bill", "days_ago": 12},
            
            # Food & Groceries
            {"amount": 8000, "type": TransactionType.DEBIT, "category": TransactionCategory.GROCERIES, 
             "merchant": "BigBasket", "description": "Monthly Groceries", "days_ago": 3},
            {"amount": 4200, "type": TransactionType.DEBIT, "category": TransactionCategory.GROCERIES, 
             "merchant": "DMart", "description": "Household Items", "days_ago": 14},
            {"amount": 2500, "type": TransactionType.DEBIT, "category": TransactionCategory.DINING, 
             "merchant": "Swiggy", "description": "Food Delivery", "days_ago": 1},
            {"amount": 1800, "type": TransactionType.DEBIT, "category": TransactionCategory.DINING, 
             "merchant": "Zomato", "description": "Restaurant Order", "days_ago": 4},
            {"amount": 1200, "type": TransactionType.DEBIT, "category": TransactionCategory.DINING, 
             "merchant": "Starbucks", "description": "Coffee & Snacks", "days_ago": 0},
            {"amount": 3500, "type": TransactionType.DEBIT, "category": TransactionCategory.DINING, 
             "merchant": "Barbeque Nation", "description": "Family Dinner", "days_ago": 9},
            
            # Transportation
            {"amount": 3500, "type": TransactionType.DEBIT, "category": TransactionCategory.TRANSPORT, 
             "merchant": "Uber", "description": "Office Commute", "days_ago": 1},
            {"amount": 2000, "type": TransactionType.DEBIT, "category": TransactionCategory.TRANSPORT, 
             "merchant": "Indian Oil", "description": "Fuel", "days_ago": 4},
            {"amount": 1500, "type": TransactionType.DEBIT, "category": TransactionCategory.TRANSPORT, 
             "merchant": "Ola", "description": "Weekend Rides", "days_ago": 7},
            {"amount": 500, "type": TransactionType.DEBIT, "category": TransactionCategory.TRANSPORT, 
             "merchant": "Rapido", "description": "Quick Commute", "days_ago": 11},
            
            # Shopping & Lifestyle
            {"amount": 5999, "type": TransactionType.DEBIT, "category": TransactionCategory.SHOPPING, 
             "merchant": "Amazon", "description": "Electronics Purchase", "days_ago": 7},
            {"amount": 3200, "type": TransactionType.DEBIT, "category": TransactionCategory.SHOPPING, 
             "merchant": "Myntra", "description": "Clothing", "days_ago": 13},
            {"amount": 1500, "type": TransactionType.DEBIT, "category": TransactionCategory.SHOPPING, 
             "merchant": "Flipkart", "description": "Home Appliances", "days_ago": 18},
            {"amount": 2800, "type": TransactionType.DEBIT, "category": TransactionCategory.PERSONAL_CARE, 
             "merchant": "Nykaa", "description": "Beauty Products", "days_ago": 6},
            
            # Entertainment & Subscriptions
            {"amount": 1299, "type": TransactionType.DEBIT, "category": TransactionCategory.ENTERTAINMENT, 
             "merchant": "Netflix", "description": "Monthly Subscription", "days_ago": 15, "is_recurring": True},
            {"amount": 499, "type": TransactionType.DEBIT, "category": TransactionCategory.ENTERTAINMENT, 
             "merchant": "Spotify", "description": "Music Subscription", "days_ago": 12, "is_recurring": True},
            {"amount": 299, "type": TransactionType.DEBIT, "category": TransactionCategory.ENTERTAINMENT, 
             "merchant": "Amazon Prime", "description": "Prime Membership", "days_ago": 20, "is_recurring": True},
            {"amount": 1500, "type": TransactionType.DEBIT, "category": TransactionCategory.ENTERTAINMENT, 
             "merchant": "PVR Cinemas", "description": "Movie Tickets", "days_ago": 8},
            
            # Health & Fitness
            {"amount": 3000, "type": TransactionType.DEBIT, "category": TransactionCategory.HEALTH, 
             "merchant": "Apollo Pharmacy", "description": "Medicines", "days_ago": 8},
            {"amount": 2000, "type": TransactionType.DEBIT, "category": TransactionCategory.HEALTH, 
             "merchant": "Cult.fit", "description": "Gym Membership", "days_ago": 3, "is_recurring": True},
            {"amount": 1500, "type": TransactionType.DEBIT, "category": TransactionCategory.HEALTH, 
             "merchant": "Dr. Sharma Clinic", "description": "Consultation Fee", "days_ago": 16},
            
            # Investments
            {"amount": 5000, "type": TransactionType.DEBIT, "category": TransactionCategory.INVESTMENT, 
             "merchant": "Zerodha", "description": "Mutual Fund SIP - HDFC Mid Cap", "days_ago": 1, "is_recurring": True},
            {"amount": 10000, "type": TransactionType.DEBIT, "category": TransactionCategory.INVESTMENT, 
             "merchant": "ICICI Direct", "description": "Stock Purchase - Reliance", "days_ago": 6},
            {"amount": 7500, "type": TransactionType.DEBIT, "category": TransactionCategory.INVESTMENT, 
             "merchant": "Groww", "description": "Index Fund - Nifty 50", "days_ago": 11},
            {"amount": 3000, "type": TransactionType.DEBIT, "category": TransactionCategory.INVESTMENT, 
             "merchant": "INDmoney", "description": "US Stocks ETF", "days_ago": 19},
            
            # Insurance & Financial Services
            {"amount": 4500, "type": TransactionType.DEBIT, "category": TransactionCategory.INSURANCE, 
             "merchant": "HDFC Life", "description": "Term Insurance Premium", "days_ago": 10, "is_recurring": True},
            {"amount": 2500, "type": TransactionType.DEBIT, "category": TransactionCategory.INSURANCE, 
             "merchant": "ICICI Lombard", "description": "Health Insurance", "days_ago": 22},
            
            # Education & Learning
            {"amount": 1999, "type": TransactionType.DEBIT, "category": TransactionCategory.EDUCATION, 
             "merchant": "Udemy", "description": "Online Course", "days_ago": 17},
            {"amount": 999, "type": TransactionType.DEBIT, "category": TransactionCategory.EDUCATION, 
             "merchant": "Coursera", "description": "Certification Course", "days_ago": 25},
            
            # Miscellaneous
            {"amount": 2000, "type": TransactionType.DEBIT, "category": TransactionCategory.OTHER, 
             "merchant": "Amazon Pay Gift Card", "description": "Gift Purchase", "days_ago": 13},
            {"amount": 500, "type": TransactionType.DEBIT, "category": TransactionCategory.OTHER, 
             "merchant": "Charity Organization", "description": "Donation", "days_ago": 21},
            
            # Previous Month Transactions for trend analysis
            {"amount": 72000, "type": TransactionType.CREDIT, "category": TransactionCategory.SALARY, 
             "merchant": "TechCorp India", "description": "Monthly Salary", "days_ago": 32},
            {"amount": 25000, "type": TransactionType.DEBIT, "category": TransactionCategory.RENT, 
             "merchant": "Property Owner", "description": "Monthly Rent", "days_ago": 31},
            {"amount": 4200, "type": TransactionType.DEBIT, "category": TransactionCategory.UTILITIES, 
             "merchant": "Electricity Board", "description": "Electricity Bill", "days_ago": 35},
            {"amount": 7500, "type": TransactionType.DEBIT, "category": TransactionCategory.GROCERIES, 
             "merchant": "BigBasket", "description": "Monthly Groceries", "days_ago": 33},
            {"amount": 3000, "type": TransactionType.DEBIT, "category": TransactionCategory.DINING, 
             "merchant": "Swiggy", "description": "Food Delivery", "days_ago": 38},
            {"amount": 5000, "type": TransactionType.DEBIT, "category": TransactionCategory.INVESTMENT, 
             "merchant": "Zerodha", "description": "Mutual Fund SIP", "days_ago": 31, "is_recurring": True},
        ]
        
        # Create transactions
        for tx_data in sample_transactions:
            days_ago = tx_data.pop("days_ago")
            tx_date = datetime.now() - timedelta(days=days_ago)
            
            transaction = Transaction(
                user_id=user.id,
                amount=Decimal(str(tx_data["amount"])),
                transaction_type=tx_data["type"],
                category=tx_data["category"],
                merchant_name=tx_data.get("merchant"),
                description=tx_data.get("description"),
                transaction_date=tx_date,
                is_recurring=tx_data.get("is_recurring", False)
            )
            session.add(transaction)
        
        await session.commit()
        print(f"✅ Created {len(sample_transactions)} sample transactions for {user.email}")


if __name__ == "__main__":
    asyncio.run(seed_transactions())
