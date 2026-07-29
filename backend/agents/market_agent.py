import os
import pydantic
import random
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TargetAudience(pydantic.BaseModel):
    demographic: str = pydantic.Field(
        ..., 
        description="Primary age group, location, and income level of target users."
    )
    pain_points: list[str] = pydantic.Field(
        ..., 
        description="Top 3 core pain points the target audience faces currently."
    )
    persona: str = pydantic.Field(
        ..., 
        description="A brief description of the ideal buyer persona."
    )

class Competitor(pydantic.BaseModel):
    name: str = pydantic.Field(
        ..., 
        description="Name of the competitor or alternative solution."
    )
    weakness: str = pydantic.Field(
        ..., 
        description="Their biggest weakness that this startup can exploit."
    )

class MarketIntelligenceOutput(pydantic.BaseModel):
    tam_size: str = pydantic.Field(
        ..., 
        description="Estimated Total Addressable Market (TAM) size in USD or INR (e.g., $5B or ₹40,000 Cr)."
    )
    sam_size: str = pydantic.Field(
        ..., 
        description="Estimated Serviceable Available Market (SAM) size."
    )
    som_size: str = pydantic.Field(
        ..., 
        description="Estimated Serviceable Obtainable Market (SOM) size."
    )
    target_audience: TargetAudience = pydantic.Field(
        ..., 
        description="Details about the primary target audience."
    )
    competitors: list[Competitor] = pydantic.Field(
        ...,
        description="List of top 3 direct or indirect competitors."
    )
    market_trends: list[str] = pydantic.Field(
        ..., 
        description="Top 3 current market trends or tailwinds driving this industry forward."
    )

SYSTEM_PROMPT = """You are a Lead Market Research Analyst at InnovationHub AI.
Your responsibility is to analyze a startup idea and produce a highly accurate, data-driven Market Intelligence report.

Analyze the startup idea and produce a report that details:
1. Market Sizing (TAM, SAM, SOM) with realistic estimates.
2. Target Audience details (Demographics, Pain Points, Buyer Persona).
3. Competitive Landscape (Top 3 competitors and their main weaknesses).
4. Market Trends (Tailwinds driving adoption in this space).

Provide realistic, industry-standard estimates.
Strictly adhere to the provided schema and output correct, structured JSON.
"""

def generate_mock_market(idea_text: str) -> MarketIntelligenceOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set."""
    idea_lower = idea_text.lower()
    
    if "drone" in idea_lower or "agri" in idea_lower or "farm" in idea_lower:
        return MarketIntelligenceOutput(
            tam_size="₹35,000 Cr (Global precision agriculture market)",
            sam_size="₹8,500 Cr (Indian agriculture tech sector)",
            som_size="₹400 Cr (Targeting specific states like Maharashtra & Punjab initially)",
            target_audience=TargetAudience(
                demographic="Large scale farmers (50+ acres) and regional agricultural co-ops in India.",
                pain_points=[
                    "Unpredictable crop yields due to climate change.",
                    "High cost and inefficiency of manual pesticide spraying.",
                    "Lack of real-time data on soil health."
                ],
                persona="Rajesh, a 45-year-old tech-forward farm owner in Punjab looking to reduce fertilizer waste and maximize yield per acre."
            ),
            competitors=[
                Competitor(name="Traditional crop-dusting services", weakness="Inaccurate spraying and high environmental impact."),
                Competitor(name="Imported consumer drones", weakness="Not ruggedized for farm use and lack specialized multispectral sensors."),
                Competitor(name="Local AgTech startups", weakness="Focus primarily on supply chain rather than on-field yield optimization.")
            ],
            market_trends=[
                "Government subsidies pushing for domestic drone manufacturing (Kisan Drones).",
                "Increasing smartphone and internet penetration in rural farming communities.",
                "Rising costs of labor driving automation in agriculture."
            ]
        )
    
    # Generic beautiful mock for other ideas
    return MarketIntelligenceOutput(
        tam_size="$120B (Global Software as a Service market segment)",
        sam_size="$15B (North American B2B enterprise software)",
        som_size="$250M (Niche vertical specific to the startup's unique value prop)",
        target_audience=TargetAudience(
            demographic="Mid-market to Enterprise companies (500-5000 employees), tech-savvy decision makers.",
            pain_points=[
                "Fragmented toolchains causing data silos.",
                "High operational overhead for manual processes.",
                "Security and compliance risks with shadow IT."
            ],
            persona="Sarah, VP of Operations, looking to consolidate tools and reduce overhead by 20% this fiscal year."
        ),
        competitors=[
            Competitor(name="Legacy Enterprise Suites (e.g. Oracle, SAP)", weakness="Slow deployment cycles and clunky UI/UX."),
            Competitor(name="Incumbent SaaS Leaders", weakness="Expensive, bloatware features that customers don't need."),
            Competitor(name="In-house custom builds", weakness="High maintenance costs and difficulty scaling.")
        ],
        market_trends=[
            "AI-first workflows replacing traditional manual data entry.",
            "Consolidation of point solutions into unified platforms.",
            "Rise of product-led growth (PLG) allowing easy bottom-up adoption."
        ]
    )

async def generate_market_analysis(idea_text: str) -> MarketIntelligenceOutput:
    """Formulates a detailed market analysis for a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_MARKET_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.

    Returns:
        An instance of MarketIntelligenceOutput with structured market data.
    """
    api_key = os.getenv("GROQ_MARKET_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_MARKET_API_KEY not configured. Running in local Mock Demo Mode for market intelligence.")
        return generate_mock_market(idea_text)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(MarketIntelligenceOutput.model_json_schema())
        prompt = f"Please provide a comprehensive market analysis for the following startup idea:\n\n{idea_text}"
        
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
        return MarketIntelligenceOutput(**structured_data)
        
    except (json.JSONDecodeError, pydantic.ValidationError, Exception) as err:
        raise ValueError(f"Failed to retrieve structured output from the market agent: {err}")
