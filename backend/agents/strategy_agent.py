import os
import pydantic
import random
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RoadmapMilestones(pydantic.BaseModel):
    phase_1_30_days: str = pydantic.Field(
        ..., 
        description="First 30 days goals: focus on MVP definition, prototype, core feature validation."
    )
    phase_2_60_days: str = pydantic.Field(
        ..., 
        description="60 days goals: beta launch, initial user onboarding, feedback loops."
    )
    phase_3_90_days: str = pydantic.Field(
        ..., 
        description="90 days goals: public launch, initial marketing/GTM execution, optimization."
    )

class BusinessStrategyOutput(pydantic.BaseModel):
    business_model: str = pydantic.Field(
        ..., 
        description="Detailed description of the chosen business model (e.g. SaaS, Marketplace, DaaS) and value capture."
    )
    pricing_model: str = pydantic.Field(
        ..., 
        description="Recommended pricing structure, price points, and tiers."
    )
    go_to_market: list[str] = pydantic.Field(
        ..., 
        description="Specific go-to-market (GTM) tactics and acquisition channels to gain early traction."
    )
    competitive_moat: str = pydantic.Field(
        ..., 
        description="The unfair advantage or defensive moat that keeps competitors from easily copying the idea."
    )
    roadmap: RoadmapMilestones = pydantic.Field(
        ..., 
        description="30-60-90 day strategic execution milestones."
    )

SYSTEM_PROMPT = """You are the Lead Startup Strategy Consultant at InnovationHub AI.
Your responsibility is to design a high-performing business strategy and monetization model for the startup idea provided.

Analyze the startup idea and produce a strategy that details:
1. The most appropriate Business Model (e.g., SaaS, transactional marketplace, subscription DaaS) and how it captures value.
2. The recommended Pricing Model, pricing tiers, and approximate price points.
3. A set of actionable Go-To-Market (GTM) tactics and acquisition channels to acquire the first 100 users.
4. A defined Competitive Moat (technological, network effects, high switching costs, brand, data, etc.) to keep competitors at bay.
5. A realistic 30-60-90 day execution roadmap detailing milestones for Phase 1, Phase 2, and Phase 3.

Strictly adhere to the provided schema and output correct, structured JSON.
"""

def generate_mock_strategy(idea_text: str) -> BusinessStrategyOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set."""
    idea_lower = idea_text.lower()
    
    # Custom mock for agriculture drones
    if "drone" in idea_lower or "agri" in idea_lower or "farm" in idea_lower:
        return BusinessStrategyOutput(
            business_model="Drone-as-a-Service (DaaS) model providing subscription-based crop monitoring combined with on-demand precision spraying services.",
            pricing_model="Tiered subscription: Basic Crop Scanning for $15/acre per month. Premium Bundle: Crop Scanning + Targeted Pesticide/Fertilizer Spraying for $35/acre per application. Enterprise contract for cooperatives: $2,500/month flat fee.",
            go_to_market=[
                "Form strategic partnerships with local agricultural cooperatives to reach hundreds of member farms.",
                "Execute free 50-acre pilot demonstrations for influential community farming leaders to generate word-of-mouth.",
                "Establish representation at regional agricultural trade shows and state farm bureau conferences."
            ],
            competitive_moat="Proprietary machine learning models trained on regional crop disease signatures, coupled with customized spray-drift mitigation payloads protected by pending patents.",
            roadmap=RoadmapMilestones(
                phase_1_30_days="Obtain FAA Part 137 agricultural drone operations certification and construct a localized weed-detection algorithm prototype.",
                phase_2_60_days="Launch paid field trials with 5 early adopter farms to collect multispectral imagery and validate pesticide reduction rates.",
                phase_3_90_days="Form initial cooperative sales bundle and scale customer acquisition using direct localized field sales."
            )
        )
    
    # Generic beautiful mock for other ideas
    return BusinessStrategyOutput(
        business_model="B2B Subscription Software-as-a-Service (SaaS) model with usage-based credit pricing to scale with client activity.",
        pricing_model="Starter: $49/month (up to 3 users, standard features). Pro: $149/month (up to 10 users, advanced AI generation tools). Enterprise: Custom contract ($500+/month) with dedicated support and unlimited integrations.",
        go_to_market=[
            "Launch a highly targeted cold outbound sales campaign targeting Operations and Engineering managers on LinkedIn.",
            "Leverage Product-Led Growth (PLG) loops by offering a robust free-trial tier that embeds shareable results.",
            "Publish authoritative content and comparison guides to capture search traffic for relevant problems."
        ],
        competitive_moat="Deep system-level workflow integration creating high switching costs, supplemented by a self-learning vector database that customizes recommendations to company history.",
        roadmap=RoadmapMilestones(
            phase_1_30_days="Build a functional MVP focusing exclusively on the primary workflow pain point and recruit 20 active design partners.",
            phase_2_60_days="Incorporate feedback, optimize response latency, and launch publicly on Product Hunt to convert top-of-funnel traffic to paid Starter plans.",
            phase_3_90_days="Build out advanced dashboard features to upsell users to the Pro tier and kick off enterprise-focused outbound sales."
        )
    )

async def generate_strategy(idea_text: str) -> BusinessStrategyOutput:
    """Formulates a comprehensive business strategy for a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_STRATEGY_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.

    Returns:
        An instance of BusinessStrategyOutput with structured strategy results.
    """
    api_key = os.getenv("GROQ_STRATEGY_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_STRATEGY_API_KEY not configured. Running in local Mock Demo Mode for strategy.")
        return generate_mock_strategy(idea_text)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(BusinessStrategyOutput.model_json_schema())
        prompt = f"Please formulate a business strategy for the following startup idea:\n\n{idea_text}"
        
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
        return BusinessStrategyOutput(**structured_data)
        
    except (json.JSONDecodeError, pydantic.ValidationError, Exception) as err:
        raise ValueError(f"Failed to retrieve structured output from the strategy agent: {err}")
