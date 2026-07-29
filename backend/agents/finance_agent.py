import os
import pydantic
import random
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class FinancialProjections(pydantic.BaseModel):
    year_1_revenue: int = pydantic.Field(
        ..., 
        description="Projected revenue for year 1 in raw INR (e.g. 15000000 for ₹1.5 Cr)."
    )
    year_2_revenue: int = pydantic.Field(
        ..., 
        description="Projected revenue for year 2 in raw INR (e.g. 45000000 for ₹4.5 Cr)."
    )
    year_3_revenue: int = pydantic.Field(
        ..., 
        description="Projected revenue for year 3 in raw INR (e.g. 120000000 for ₹12 Cr)."
    )

class FinanceModelingOutput(pydantic.BaseModel):
    revenue_streams: list[str] = pydantic.Field(
        ..., 
        description="Detailed list of primary and secondary revenue streams."
    )
    cost_structure: list[str] = pydantic.Field(
        ..., 
        description="Key fixed and variable costs required to operate the business."
    )
    funding_required: str = pydantic.Field(
        ..., 
        description="Estimated initial capital/funding required to reach the MVP and first 12 months of runway."
    )
    break_even_timeline: str = pydantic.Field(
        ..., 
        description="Estimated timeline (in months) to reach profitability or break-even."
    )
    key_metrics: list[str] = pydantic.Field(
        ...,
        description="Top 3-4 financial KPIs to track (e.g., CAC, LTV, Gross Margin, Burn Rate)."
    )
    projections: FinancialProjections = pydantic.Field(
        ..., 
        description="3-year high-level revenue projections."
    )

SYSTEM_PROMPT = """You are a Chartered Financial Analyst (CFA) and Lead Financial Modeler at InnovationHub AI.
Your responsibility is to design a highly accurate, realistic, and detailed financial model for the given startup idea.

Analyze the startup idea and produce a financial model that details:
1. Plausible Revenue Streams (how the business actually makes money).
2. The Cost Structure (major fixed and variable expenses).
3. The Initial Funding Required to build the MVP and survive the first 12 months (in INR).
4. A realistic Break-Even Timeline.
5. Key Financial Metrics (KPIs) to monitor for success.
6. A 3-Year Revenue Projection (Year 1, Year 2, Year 3) as raw integer values representing Indian Rupees (INR).

IMPORTANT RULE: All monetary values MUST be in Indian Rupees (INR / ₹) where applicable. The revenue projections must be pure integers (e.g., 5000000 for ₹50 Lakhs).

Provide conservative, realistic estimates rather than overly optimistic ones.
Strictly adhere to the provided schema and output correct, structured JSON.
"""

def generate_mock_finance(idea_text: str) -> FinanceModelingOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set."""
    idea_lower = idea_text.lower()
    
    # Custom mock for agriculture drones
    if "drone" in idea_lower or "agri" in idea_lower or "farm" in idea_lower:
        return FinanceModelingOutput(
            revenue_streams=[
                "Subscription DaaS (Drone-as-a-Service) for regular crop monitoring (₹1,500/acre/month).",
                "On-demand precision spraying fees (₹3,500/acre/application).",
                "Data analytics upselling for yield prediction models to agricultural insurers."
            ],
            cost_structure=[
                "Hardware CapEx: Commercial-grade drones, batteries, and multispectral cameras.",
                "Variable Costs: Drone maintenance, battery replacements, and pesticide/fertilizer inventory.",
                "Fixed Costs: Pilot/operator salaries, insurance, DGCA compliance, and software cloud hosting."
            ],
            funding_required="₹1.2 Cr Seed Round to cover initial fleet acquisition (15 drones), software development, and 12 months runway.",
            break_even_timeline="24 to 30 months, dependent on reaching 15,000 active subscribed acres.",
            key_metrics=[
                "Hardware Utilization Rate (target >70% during peak season).",
                "Gross Margin per Acre (target 65%).",
                "Customer Acquisition Cost (CAC) vs. Lifetime Value (LTV) ratio (target 1:4)."
            ],
            projections=FinancialProjections(
                year_1_revenue=25000000,
                year_2_revenue=85000000,
                year_3_revenue=310000000
            )
        )
    
    # Generic beautiful mock for other ideas
    return FinanceModelingOutput(
        revenue_streams=[
            "Tiered B2B SaaS subscriptions (Starter, Pro, Enterprise).",
            "Usage-based API overage fees for high-volume customers.",
            "One-time setup and integration fees for Enterprise clients."
        ],
        cost_structure=[
            "Cloud infrastructure and LLM API inference costs (Variable).",
            "R&D and Engineering payroll (Fixed).",
            "Sales & Marketing spend (Variable).",
            "Legal & Compliance auditing (Fixed)."
        ],
        funding_required="₹7.5 Cr Pre-Seed to support a 4-person engineering team, API costs, and GTM budget for 18 months.",
        break_even_timeline="18 to 22 months, post Series A and after crossing ₹1.5 Cr ARR.",
        key_metrics=[
            "Monthly Recurring Revenue (MRR) Growth Rate.",
            "Net Revenue Retention (NRR) > 110%.",
            "LTV:CAC Ratio (Target > 3:1).",
            "Monthly Cash Burn Rate."
        ],
        projections=FinancialProjections(
            year_1_revenue=15000000,
            year_2_revenue=75000000,
            year_3_revenue=210000000
        )
    )

async def generate_finance_model(idea_text: str) -> FinanceModelingOutput:
    """Formulates a detailed financial model for a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_FINANCE_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.

    Returns:
        An instance of FinanceModelingOutput with structured financial results.
    """
    api_key = os.getenv("GROQ_FINANCE_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_FINANCE_API_KEY not configured. Running in local Mock Demo Mode for finance.")
        return generate_mock_finance(idea_text)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(FinanceModelingOutput.model_json_schema())
        prompt = f"Please formulate a comprehensive financial model for the following startup idea:\n\n{idea_text}"
        
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"{SYSTEM_PROMPT}\n\nYou must respond ONLY with a JSON object matching this schema:\n{schema_json}"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        
        response_content = chat_completion.choices[0].message.content
        if not response_content:
            raise ValueError("Empty response received from Groq API.")
            
        structured_data = json.loads(response_content)
        return FinanceModelingOutput(**structured_data)
        
    except (json.JSONDecodeError, pydantic.ValidationError, Exception) as err:
        raise ValueError(f"Failed to retrieve structured output from the finance agent: {err}")
