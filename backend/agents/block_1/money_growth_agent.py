"""
Money Growth Agent for spending analysis and financial growth
"""

from typing import List
from agents.base_agent import BaseAgent
from agents.prompts.system_prompts import MONEY_GROWTH_PROMPT
from agents.tools.calculator_tool import get_calculator_tools


class MoneyGrowthAgent(BaseAgent):
    """Agent for analyzing spending and providing growth recommendations."""
    
    def __init__(self, **kwargs):
        tools = kwargs.pop("tools", None) or get_calculator_tools()
        super().__init__(
            name="money_growth_agent",
            description="Analyzes spending patterns and provides growth recommendations",
            system_prompt=MONEY_GROWTH_PROMPT,
            tools=tools,
            **kwargs
        )
    
    def get_capabilities(self) -> List[str]:
        return [
            "spending_analysis",
            "budget_creation",
            "savings_recommendations",
            "financial_projections",
            "goal_tracking"
        ]
