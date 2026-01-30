"""
Stock Agent for equity research
"""

from typing import List
from agents.base_agent import BaseAgent
from agents.prompts.system_prompts import STOCK_AGENT_PROMPT
from agents.tools.market_data_tool import get_market_data_tools


class StockAgent(BaseAgent):
    """Agent for stock and equity research."""
    
    def __init__(self, **kwargs):
        tools = kwargs.pop("tools", None) or get_market_data_tools()
        super().__init__(
            name="stock_agent",
            description="Researches stocks, mutual funds, and ETFs",
            system_prompt=STOCK_AGENT_PROMPT,
            tools=tools,
            **kwargs
        )
    
    def get_capabilities(self) -> List[str]:
        return [
            "stock_research",
            "mutual_fund_analysis",
            "etf_comparison",
            "technical_analysis",
            "fundamental_analysis"
        ]
