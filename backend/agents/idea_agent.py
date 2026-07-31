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

SYSTEM_PROMPT = """You are the Chief Innovation Officer and Startup Validation Expert.

Your responsibility is to analyze ONLY the startup idea provided by the user.

The recommendations must be completely tailored to the specific startup idea.

Never generate generic startup advice.

Analyze the startup idea and generate:
1. Innovation Score (1-100)
2. Problem Statement
3. Target Audience
4. Value Proposition
5. Risks
6. Recommendations

IMPORTANT RULES:

The recommendations MUST be directly related to the startup described.

Do NOT generate generic startup suggestions such as:
- Build an MVP
- Offer Freemium Pricing
- Improve Customer Acquisition
- Improve Product Market Fit
- Launch Marketing Campaigns
- AI Onboarding
- Raise Funding
- Find Investors
- Validate the Idea
- Scale the Team

These recommendations are NOT allowed unless they are explicitly relevant to the startup.

Instead, recommend improvements such as:
• Product Features
• Security Enhancements
• Technical Improvements
• Compliance Improvements
• User Experience Enhancements
• Architecture Improvements
• Performance Optimizations
• Integrations
• Scalability Improvements
• Accessibility Improvements
• Privacy Enhancements
• Domain-Specific Features

Every recommendation must be actionable and clearly applicable to the specific startup idea.

A judge should immediately feel that the recommendations were written specifically for this startup and could not be copied to another unrelated startup.

Strictly adhere to the provided schema and output correct, structured JSON. Do not fabricate facts.
"""

# Industry-label → domain-specific mock recommendations for Demo Mode
_MOCK_RECOMMENDATIONS = {
    "Agriculture": [
        "Integrate IoT soil sensors (moisture, pH, NPK) to enable real-time field health dashboards.",
        "Add weather forecast API integration (OpenWeatherMap) to guide irrigation scheduling.",
        "Build a crop disease detection module using image classification on drone or phone photos.",
        "Connect to government subsidy portals (PM-Kisan, eNAM) to auto-populate eligible farmer profiles.",
        "Implement precision drip-irrigation control integration with existing valve hardware.",
        "Add yield prediction models trained on historical harvest and weather data.",
    ],
    "Healthcare": [
        "Implement HIPAA-compliant end-to-end encryption for all patient data in transit and at rest.",
        "Add HL7 FHIR API integration to enable interoperability with existing Electronic Health Records.",
        "Build a doctor and practitioner verification workflow with license number cross-checks.",
        "Implement granular patient consent management with audit trails for data sharing.",
        "Add clinical audit logging for every data access event to satisfy regulatory inspection needs.",
        "Design offline-capable data entry for low-connectivity rural clinic environments.",
    ],
    "FinTech": [
        "Integrate KYC verification APIs (Aadhaar e-KYC, DigiLocker) for frictionless onboarding.",
        "Implement real-time AML transaction monitoring with configurable alert thresholds.",
        "Add PCI-DSS Level 1 compliant payment tokenization to eliminate raw card data storage.",
        "Build a fraud detection engine using velocity checks and device fingerprinting.",
        "Integrate UPI, NEFT, and RTGS payment rails for full Indian market coverage.",
        "Add a financial dashboard with spending categorization and budgeting analytics.",
    ],
    "Education": [
        "Implement adaptive learning paths that adjust content difficulty based on student performance metrics.",
        "Add WCAG 2.1 AA accessibility compliance: screen reader support, keyboard navigation, captions.",
        "Build a spaced-repetition flashcard engine to boost long-term knowledge retention.",
        "Integrate with Google Classroom and Microsoft Teams for seamless LMS interoperability.",
        "Add real-time plagiarism detection to protect academic integrity on student submissions.",
        "Implement offline content caching so students can study without internet connectivity.",
    ],
    "E-commerce": [
        "Integrate an AI-powered product recommendation engine based on browsing and purchase history.",
        "Add real-time inventory synchronization across warehouse, storefront, and marketplace channels.",
        "Implement fraud detection with velocity checks, device fingerprinting, and order risk scoring.",
        "Enable one-click checkout with saved payment methods, addresses, and UPI autopay.",
        "Build a returns and refund automation workflow to eliminate manual support intervention.",
        "Add a seller analytics dashboard with conversion rate, return rate, and revenue breakdowns.",
    ],
    "SaaS": [
        "Implement role-based access control (RBAC) with team workspaces and invite management.",
        "Add webhook support so enterprise customers can push events to their own data pipelines.",
        "Build an API rate-limiting and quota management layer for multi-tenant fairness.",
        "Add SOC 2 Type II readiness: audit logging, data residency controls, and access reviews.",
        "Implement single sign-on (SSO) via SAML 2.0 and OIDC for enterprise identity providers.",
        "Add a usage analytics dashboard for customers to track their own consumption and ROI.",
    ],
    "Cybersecurity": [
        "Implement continuous vulnerability scanning and CVE alerting for monitored assets.",
        "Add threat intelligence feed integration (MISP, VirusTotal) for enriched incident context.",
        "Build a SIEM-compatible export in CEF/LEEF format for enterprise SOC integration.",
        "Implement automated incident response playbooks triggered by defined alert conditions.",
        "Add compliance reporting templates for ISO 27001, SOC 2, and GDPR audit requirements.",
        "Build a red team simulation module for automated penetration test scenario execution.",
    ],
    "Logistics": [
        "Add real-time GPS tracking with ETAs recalculated on live traffic and route conditions.",
        "Implement route optimization using multi-stop algorithms to reduce fuel and delivery time.",
        "Build a proof-of-delivery capture with photo, e-signature, and OTP confirmation flows.",
        "Integrate with customs and e-way bill APIs for automated cross-border documentation.",
        "Add driver performance scoring (on-time rate, idle time, harsh braking) for fleet management.",
        "Implement cold-chain temperature monitoring integration for pharmaceutical and food shipments.",
    ],
    "Real Estate": [
        "Build a RERA compliance module that auto-generates required disclosures and project filings.",
        "Add virtual property tour support using 360° photo walkthroughs and floor plan overlays.",
        "Integrate with stamp duty and registration APIs for digital transaction cost estimation.",
        "Implement AML-compliant transaction screening for high-value property deals.",
        "Add neighborhood analytics dashboards: school ratings, commute time, price trend history.",
        "Build automated rental agreement generation with e-signature and escrow payment tracking.",
    ],
    "AI/ML": [
        "Add model explainability (SHAP / LIME) reports so users understand prediction rationale.",
        "Implement data drift monitoring to alert when production input distributions shift significantly.",
        "Build a model versioning and rollback system with A/B traffic splitting for safe deployments.",
        "Add bias and fairness evaluation metrics across demographic groups before each model release.",
        "Implement EU AI Act compliance documentation: risk category classification and technical file.",
        "Add federated learning support so clients can contribute training data without sharing raw records.",
    ],
    "Manufacturing": [
        "Integrate OPC-UA and MQTT protocols to collect real-time telemetry from factory floor machines.",
        "Build a predictive maintenance module using anomaly detection on sensor vibration and temperature.",
        "Add digital twin simulation for production line capacity planning and bottleneck identification.",
        "Implement ISO 9001 quality control checklists with defect photo capture and traceability.",
        "Add energy consumption monitoring per machine to identify inefficiencies and reduce utility costs.",
        "Integrate with ERP systems (SAP, Oracle) for seamless production order and BOM synchronization.",
    ],
    "Generic Technology": [
        "Implement end-to-end encryption for all user-generated data in transit and at rest.",
        "Build a comprehensive audit log and activity timeline for operator and compliance review.",
        "Add role-based access control (RBAC) with granular permission management per resource.",
        "Integrate third-party identity providers (Google, Microsoft SSO) for enterprise onboarding.",
        "Design an offline-capable mode with background sync when connectivity is restored.",
        "Add webhook support so enterprise clients can push events to their own data pipelines.",
    ],
}


def generate_mock_validation(idea_text: str, industry: str = "Generic Technology") -> IdeaValidationOutput:
    """Generates a high-quality mock response for demo purposes when no API key is set.
    
    Uses the pre-classified industry label to select domain-specific recommendations
    instead of fragile substring matching on the idea text.
    """
    idea_lower = idea_text.lower()
    
    # Special-cased detailed mock for Agriculture/drone (original quality mock preserved)
    if "drone" in idea_lower or ("agri" in idea_lower and "farm" in idea_lower):
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
                "Regulatory challenges regarding autonomous drone flights (FAA Part 107 / DGCA restrictions).",
                "Battery life limits coverage area per flight, restricting operational scale.",
                "Potential pesticide drift onto adjacent non-target fields and water sources."
            ],
            recommendations=_MOCK_RECOMMENDATIONS["Agriculture"]
        )
    
    # Use the industry label (classified by industry_classifier.py) for all other ideas
    recs = _MOCK_RECOMMENDATIONS.get(industry, _MOCK_RECOMMENDATIONS["Generic Technology"])
    
    return IdeaValidationOutput(
        innovation_score=random.randint(75, 92),
        problem_statement=(
            f"Professionals and businesses in the {industry} sector face fragmented tooling, "
            f"manual workflows, and high operational overhead when dealing with: '{idea_text[:120]}...'. "
            f"Existing solutions lack automation, personalization, or seamless integrations."
        ),
        target_audience=[
            "Tech-savvy early adopters",
            "Small and medium businesses (SMBs)",
            "Freelancers and independent consultants",
            "Operations and product managers"
        ],
        value_proposition=(
            f"A purpose-built {industry} platform that automates complex workflows, "
            f"integrates with existing toolchains, and delivers measurable outcomes at a "
            f"fraction of current market costs."
        ),
        risks=[
            "Intense market competition from established legacy vendors.",
            "User churn due to integration complexity with existing enterprise systems.",
            "High infrastructure costs when scaling concurrent AI workloads."
        ],
        recommendations=recs
    )

async def validate_idea(idea_text: str, industry: str = "Generic Technology") -> IdeaValidationOutput:
    """Evaluates and validates a startup idea using the Groq API.
    Falls back to a high-quality mock generator if no GROQ_API_KEY is configured.

    Args:
        idea_text: The description of the startup idea.
        industry: Pre-classified industry label from the industry_classifier preprocessing step.
                  Used by the mock generator to select domain-appropriate recommendations.

    Returns:
        An instance of IdeaValidationOutput with structured valuation results.
    """
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        print("⚠️  GROQ_API_KEY not configured. Running in local Mock Demo Mode.")
        return generate_mock_validation(idea_text, industry=industry)
        
    client = AsyncGroq(api_key=api_key)
    
    try:
        schema_json = json.dumps(IdeaValidationOutput.model_json_schema())
        
        # Structured task prompt mirrors the Chief Innovation Officer instructions
        prompt = (
            f"----------------------------------------------------\n"
            f"STARTUP IDEA\n"
            f"----------------------------------------------------\n\n"
            f"{idea_text}\n\n"
            f"----------------------------------------------------\n"
            f"YOUR TASK\n"
            f"----------------------------------------------------\n\n"
            f"Analyze this startup idea and generate:\n"
            f"1. Innovation Score (1-100)\n"
            f"2. Problem Statement\n"
            f"3. Target Audience\n"
            f"4. Value Proposition\n"
            f"5. Risks\n"
            f"6. Recommendations\n\n"
            f"Remember: Every recommendation must be domain-specific and directly applicable "
            f"to THIS startup. Generic advice is strictly forbidden."
        )
        
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
