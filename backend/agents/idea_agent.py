import os
import pydantic
import random
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class IdeaValidationOutput(pydantic.BaseModel):
    innovation_score: int = pydantic.Field(
        ..., 
        description="A score between 1 and 100 representing how unique, innovative, and market-ready the idea is."
    )
    problem_statement: str = pydantic.Field(
        ..., 
        description="A synthesized description of the core customer pain points this idea addresses."
    )
    target_audience: list[str] = pydantic.Field(
        ..., 
        description="A list of specific target groups or user personas who would benefit most from this startup."
    )
    value_proposition: str = pydantic.Field(
        ..., 
        description="The unique value proposition: why customers would choose this solution over alternatives."
    )
    risks: list[str] = pydantic.Field(
        ..., 
        description="A list of potential execution, technical, market, or regulatory risks."
    )
    recommendations: list[str] = pydantic.Field(
        ..., 
        description="Actionable steps or suggestions to improve the feasibility and success rate of the idea."
    )

SYSTEM_PROMPT = """You are the Chief Innovation Officer of InnovationHub AI.
Your responsibility is to evaluate startup ideas objectively and constructively.

Review the startup idea and analyze it based on the following aspects:
1. Identify the core customer pain points.
2. Determine the primary target user groups.
3. Formulate a strong, compelling value proposition.
4. Highlight major risks (technical, financial, market, legal, etc.).
5. Calculate a realistic innovation score (1-100) based on feasibility, uniqueness, and demand.
6. Provide concrete, actionable recommendations to improve or pivot the idea.

Strictly adhere to the provided schema and output correct, structured JSON. Do not fabricate facts.
"""

def generate_mock_validation(idea_text: str) -> IdeaValidationOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set."""
    idea_lower = idea_text.lower()
    
    # Custom mock for agriculture drones
    if "drone" in idea_lower or "agri" in idea_lower or "farm" in idea_lower:
        return IdeaValidationOutput(
            innovation_score=87,
            problem_statement="Modern farmers face high operational costs, labor shortages, and difficulty monitoring crop health over large acreages. Manual pesticide spraying is time-consuming, chemically hazardous, and leads to uneven chemical distribution.",
            target_audience=[
                "Commercial crop farm owners", 
                "Agri-business cooperatives", 
                "Precision agriculture service providers",
                "Environmental farming consultants"
            ],
            value_proposition="An autonomous drone-as-a-service platform that leverages multispectral imagery to detect crop stress early and execute precision spraying, reducing chemical waste by 30% and labor requirements by 60%.",
            risks=[
                "High initial capital expenditure for commercial drone fleets.",
                "Regulatory challenges regarding autonomous drone flights (FAA Part 107 restrictions).",
                "Battery life limits coverage area per flight, restricting scale.",
                "Potential pesticide drift onto adjacent non-target fields."
            ],
            recommendations=[
                "Start with a leasing model to lower initial barrier to entry for farmers.",
                "Form alliances with agricultural co-ops to bundle drone imagery with seed and chemical sales.",
                "Integrate battery-swap stations at farm borders to optimize flight logistics.",
                "Focus compliance strategies on agricultural drone exemptions under FAA regulations."
            ]
        )
    
    # Generic beautiful mock for other ideas
    return IdeaValidationOutput(
        innovation_score=random.randint(75, 92),
        problem_statement=f"Customers struggle with inefficiencies and fragmented solutions in the domain of: '{idea_text}'. Existing solutions are either too expensive, lack personalization, or require complex manual workflows.",
        target_audience=[
            "Tech-savvy early adopters",
            "Small and medium businesses (SMBs)",
            "Freelancers and independent consultants",
            "Operations and product managers"
        ],
        value_proposition="An AI-native dashboard that automates cognitive tasks, synchronizes workflows, and delivers personalized outcomes at a fraction of current market costs.",
        risks=[
            "Intense market competition from established legacy vendors.",
            "User churn due to high learning curves of AI configurations.",
            "High token usage or infrastructure API expenses scaling up."
        ],
        recommendations=[
            "Launch a simple MVP focused on solving the single biggest user pain point first.",
            "Offer a freemium pricing structure to accelerate user acquisition.",
            "Implement onboarding wizards to guide users through their first AI generation."
        ]
    )

async def validate_idea(idea_text: str) -> IdeaValidationOutput:
    """Evaluates and validates a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.

    Returns:
        An instance of IdeaValidationOutput with structured valuation results.
    """
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_API_KEY not configured. Running in local Mock Demo Mode.")
        return generate_mock_validation(idea_text)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(IdeaValidationOutput.model_json_schema())
        prompt = f"Please evaluate the following startup idea:\n\n{idea_text}"
        
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
        return IdeaValidationOutput(**structured_data)
        
    except (json.JSONDecodeError, pydantic.ValidationError, Exception) as err:
        raise ValueError(f"Failed to retrieve structured output from the validation agent: {err}")
