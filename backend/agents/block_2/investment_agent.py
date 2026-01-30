"""
Investment Agent for investment planning
"""

from typing import List
from agents.base_agent import BaseAgent
from agents.prompts.system_prompts import INVESTMENT_AGENT_PROMPT
from agents.tools.calculator_tool import get_calculator_tools


class InvestmentAgent(BaseAgent):
    """Agent for investment planning and recommendations."""
    
    def __init__(self, **kwargs):
        tools = kwargs.pop("tools", None) or get_calculator_tools()
        super().__init__(
            name="investment_agent",
            description="Provides investment recommendations and planning",
            system_prompt=INVESTMENT_AGENT_PROMPT,
            tools=tools,
            **kwargs
        )
    
    def get_capabilities(self) -> List[str]:
        return [
            "investment_recommendations",
            "goal_based_planning",
            "return_projections",
            "tax_efficient_investing"
        ]
