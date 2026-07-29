import os
import pydantic
import random
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MarketingOutput(pydantic.BaseModel):
    core_message: str = pydantic.Field(
        ..., 
        description="The central marketing message or tagline that resonates with the target audience."
    )
    marketing_channels: list[str] = pydantic.Field(
        ..., 
        description="Top 3-4 marketing channels most effective for this specific business model."
    )
    customer_acquisition_strategy: str = pydantic.Field(
        ..., 
        description="High-level strategy for acquiring the first 1000 users or customers."
    )
    content_strategy: list[str] = pydantic.Field(
        ..., 
        description="Specific content marketing ideas (e.g., blog posts, webinars, case studies)."
    )
    launch_campaign_ideas: list[str] = pydantic.Field(
        ..., 
        description="Creative and viral ideas for the initial product launch."
    )

SYSTEM_PROMPT = """You are the Growth Marketing Director at InnovationHub AI.
Your responsibility is to design a high-performing growth marketing strategy for the given startup idea.

Analyze the startup idea and produce a strategy that details:
1. Core Marketing Message and positioning.
2. The most effective Marketing Channels.
3. Customer Acquisition Strategy (0 to 1000 users).
4. Content Strategy (SEO, social media, thought leadership).
5. Creative Launch Campaign Ideas.

Provide actionable, modern marketing strategies.
Strictly adhere to the provided schema and output correct, structured JSON.
"""

def generate_mock_marketing(idea_text: str) -> MarketingOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set."""
    idea_lower = idea_text.lower()
    
    if "drone" in idea_lower or "agri" in idea_lower or "farm" in idea_lower:
        return MarketingOutput(
            core_message="Precision Farming from Above. Maximize Yields, Minimize Waste.",
            marketing_channels=[
                "Agricultural Trade Shows & Expos",
                "Regional farming Facebook Groups and WhatsApp Communities",
                "Partnerships with local Agronomists and Seed Distributors",
                "Targeted YouTube ads on modern farming tutorials"
            ],
            customer_acquisition_strategy="Offer a 'Free 10-Acre Scan' to influential local farm owners. Use their positive results as localized case studies to onboard neighboring farms through a referral discount program.",
            content_strategy=[
                "Before/After visual case studies showing crop health improvements using multispectral imagery.",
                "Educational webinars on 'How to reduce pesticide costs by 30% using AgTech'.",
                "A monthly newsletter detailing local weather patterns and drone-assisted yield predictions."
            ],
            launch_campaign_ideas=[
                "The 'Future of Farming' live demo day: Invite 50 local farmers to a free BBQ and live drone spraying demonstration.",
                "A viral drone-footage video showcasing the stark difference between manual and precision-sprayed fields, heavily boosted on rural social media."
            ]
        )
    
    # Generic beautiful mock for other ideas
    return MarketingOutput(
        core_message="Automate the Mundane. Unleash Your Team's Cognitive Potential.",
        marketing_channels=[
            "LinkedIn Outbound and Thought Leadership",
            "SEO-optimized content marketing for long-tail problem queries",
            "Product Hunt and specialized Tech Communities (Hacker News, Reddit)",
            "Programmatic B2B advertising (Clearbit, Demandbase)"
        ],
        customer_acquisition_strategy="Leverage a Product-Led Growth (PLG) motion. Create a free micro-tool that solves one specific pain point perfectly, requiring users to sign up, then upsell them to the full platform via email nurturing.",
        content_strategy=[
            "Publishing in-depth 'State of the Industry' reports highlighting inefficiencies that the product solves.",
            "A technical blog detailing the engineering challenges overcome to build the platform.",
            "Short-form video tutorials on LinkedIn and X (Twitter) showing 'Aha!' moments in the product."
        ],
        launch_campaign_ideas=[
            "Coordinate a massive Product Hunt launch with early beta testers advocating in the comments.",
            "Host an exclusive virtual summit with industry leaders discussing the exact problem the startup solves, seamlessly weaving the product reveal into the keynote.",
            "An interactive ROI calculator landing page that goes viral by showing companies exactly how much money they are losing by not using the tool."
        ]
    )

async def generate_marketing_strategy(idea_text: str) -> MarketingOutput:
    """Formulates a detailed marketing strategy for a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_MARKETING_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.

    Returns:
        An instance of MarketingOutput with structured marketing data.
    """
    api_key = os.getenv("GROQ_MARKETING_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_MARKETING_API_KEY not configured. Running in local Mock Demo Mode for marketing agent.")
        return generate_mock_marketing(idea_text)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(MarketingOutput.model_json_schema())
        prompt = f"Please provide a comprehensive growth marketing strategy for the following startup idea:\n\n{idea_text}"
        
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
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        
        response_content = chat_completion.choices[0].message.content
        if not response_content:
            raise ValueError("Empty response received from Groq API.")
            
        structured_data = json.loads(response_content)
        return MarketingOutput(**structured_data)
        
    except (json.JSONDecodeError, pydantic.ValidationError, Exception) as err:
        raise ValueError(f"Failed to retrieve structured output from the marketing agent: {err}")
