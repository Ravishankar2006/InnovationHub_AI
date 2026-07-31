import os
import pydantic
import random
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LegalRiskOutput(pydantic.BaseModel):
    compliance_requirements: list[str] = pydantic.Field(
        ..., 
        description="List of necessary legal compliances, licenses, and certifications required."
    )
    potential_liabilities: list[str] = pydantic.Field(
        ..., 
        description="List of potential legal liabilities and risks associated with the product or service."
    )
    ip_protection_strategy: str = pydantic.Field(
        ..., 
        description="Recommended strategy for Intellectual Property (IP) protection (patents, trademarks, etc.)."
    )
    regulatory_hurdles: str = pydantic.Field(
        ..., 
        description="Major regulatory bodies or laws that could slow down or prevent market entry."
    )
    data_privacy_concerns: str = pydantic.Field(
        ..., 
        description="Overview of how data privacy (e.g., GDPR, CCPA, DPDP Act) affects the business model."
    )

BASE_SYSTEM_PROMPT = """You are the Lead Legal & Risk Consultant at InnovationHub AI.
Your responsibility is to analyze a startup idea and produce a highly accurate, detailed Legal and Risk Assessment report.

Analyze the startup idea and produce a report that details:
1. Compliance Requirements (licenses, certifications).
2. Potential Liabilities and operational risks.
3. Intellectual Property (IP) Protection Strategy.
4. Regulatory Hurdles and major legal roadblocks.
5. Data Privacy Concerns and necessary data governance frameworks.

Provide realistic, industry-standard legal assessments.
Strictly adhere to the provided schema and output correct, structured JSON."""


def _build_system_prompt(industry_context: str) -> str:
    """Builds the full system prompt by appending industry-specific regulatory context."""
    if not industry_context or industry_context.startswith("This is a technology startup"):
        return BASE_SYSTEM_PROMPT + "\n"
    return (
        BASE_SYSTEM_PROMPT
        + "\n\n--- INDUSTRY-SPECIFIC REGULATORY CONTEXT ---\n"
        + industry_context
        + "\nEnsure the compliance_requirements and regulatory_hurdles fields prominently include "
        + "the above industry-specific regulations."
        + "\n"
    )

def generate_mock_legal(idea_text: str) -> LegalRiskOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set."""
    idea_lower = idea_text.lower()
    
    if "drone" in idea_lower or "agri" in idea_lower or "farm" in idea_lower:
        return LegalRiskOutput(
            compliance_requirements=[
                "DGCA (Directorate General of Civil Aviation) Part 137 agricultural drone operations certification.",
                "UIN (Unique Identification Number) registration for all commercial drones in the fleet.",
                "Environmental clearances for automated pesticide distribution near residential zones."
            ],
            potential_liabilities=[
                "Property damage or personal injury caused by drone malfunction or crash.",
                "Chemical drift liability causing damage to neighboring organic farms or water sources.",
                "Breach of contract claims if guaranteed yield improvements are not met."
            ],
            ip_protection_strategy="File utility patents for the proprietary weed-detection machine learning algorithm and the specialized spray-drift mitigation payloads. Register trademarks for the DaaS brand name.",
            regulatory_hurdles="Strict FAA / DGCA regulations regarding Beyond Visual Line of Sight (BVLOS) operations, which limits the scale of fully autonomous long-range flights without a human spotter.",
            data_privacy_concerns="Ensuring aerial imagery does not capture high-resolution identifiable data of individuals or restricted government properties without consent. Compliance with local geospatial data policies."
        )
    
    # Generic beautiful mock for other ideas
    return LegalRiskOutput(
        compliance_requirements=[
            "Standard business incorporation (e.g., C-Corp or LLC) and local operating licenses.",
            "SOC 2 Type II compliance if handling enterprise B2B data.",
            "ISO 27001 certification to prove information security management."
        ],
        potential_liabilities=[
            "Breach of SLA (Service Level Agreement) causing enterprise downtime and associated financial losses.",
            "Third-party copyright infringement if AI generation outputs reproduce protected works.",
            "Data breaches exposing sensitive customer or corporate information."
        ],
        ip_protection_strategy="Keep core algorithms as trade secrets. Copyright the software source code and file for trademarks on the company name, logo, and unique product tier names.",
        regulatory_hurdles="Navigating emerging AI regulations such as the EU AI Act, and avoiding classification as a 'high-risk AI system' which requires stringent auditing.",
        data_privacy_concerns="Must implement robust data anonymization and user consent flows to comply with GDPR, CCPA, and the Indian DPDP Act. Ensure data localization where legally mandated."
    )

async def generate_legal_risk_analysis(idea_text: str, industry_context: str = "") -> LegalRiskOutput:
    """Formulates a detailed legal & risk analysis for a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_LEGAL_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.
        industry_context: Optional industry-specific regulatory context string injected
                          by the industry classifier preprocessing step.

    Returns:
        An instance of LegalRiskOutput with structured legal data.
    """
    api_key = os.getenv("GROQ_LEGAL_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_LEGAL_API_KEY not configured. Running in local Mock Demo Mode for legal agent.")
        return generate_mock_legal(idea_text)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(LegalRiskOutput.model_json_schema())
        system_prompt = _build_system_prompt(industry_context)
        prompt = f"Please provide a comprehensive legal and risk analysis for the following startup idea:\n\n{idea_text}"
        
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"{system_prompt}\n\nYou must respond ONLY with a JSON object matching this schema:\n{schema_json}"
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
        return LegalRiskOutput(**structured_data)
        
    except (json.JSONDecodeError, pydantic.ValidationError, Exception) as err:
        raise ValueError(f"Failed to retrieve structured output from the legal agent: {err}")
