import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

# Supported industry labels
SUPPORTED_INDUSTRIES = [
    "Healthcare",
    "FinTech",
    "Agriculture",
    "Education",
    "E-commerce",
    "SaaS",
    "Cybersecurity",
    "Manufacturing",
    "Logistics",
    "Real Estate",
    "AI/ML",
    "Generic Technology",
]

# Industry-specific regulation context injected into the Legal Agent prompt
INDUSTRY_REGULATIONS = {
    "Healthcare": (
        "This is a Healthcare startup. The Legal Risk Assessment MUST specifically address:\n"
        "- HIPAA (Health Insurance Portability and Accountability Act) compliance for patient data\n"
        "- FDA regulations and medical device clearance (510(k) / PMA) if applicable\n"
        "- Medical Device Regulations and clinical validation requirements\n"
        "- Patient data privacy and informed consent frameworks\n"
        "- Clinical trial regulations and IRB approvals\n"
        "- HITECH Act and electronic health record (EHR) security standards\n"
    ),
    "FinTech": (
        "This is a FinTech startup. The Legal Risk Assessment MUST specifically address:\n"
        "- KYC (Know Your Customer) and identity verification compliance\n"
        "- AML (Anti-Money Laundering) regulations and reporting obligations\n"
        "- RBI (Reserve Bank of India) regulations and payment aggregator licensing (if India-focused)\n"
        "- PCI-DSS (Payment Card Industry Data Security Standard) compliance\n"
        "- SEBI regulations if investment or securities are involved\n"
        "- Financial licensing requirements (NBFC, payment gateway, lending licenses)\n"
        "- Consumer financial protection laws\n"
    ),
    "Agriculture": (
        "This is an Agriculture startup. The Legal Risk Assessment MUST specifically address:\n"
        "- Environmental regulations for pesticide use, soil treatment, and water usage\n"
        "- Food Safety standards (FSSAI in India, FDA for US market, EU food safety laws)\n"
        "- Government subsidy policies and eligibility frameworks for agri-tech\n"
        "- Agricultural certifications (organic, fair-trade, GAP certifications)\n"
        "- Drone/UAV regulations for aerial crop monitoring (DGCA, FAA)\n"
        "- Land use regulations and farmers' contractual rights\n"
    ),
    "Education": (
        "This is an Education startup. The Legal Risk Assessment MUST specifically address:\n"
        "- Student data privacy and COPPA compliance for under-13 users\n"
        "- FERPA (Family Educational Rights and Privacy Act) where applicable\n"
        "- Accessibility requirements (ADA, WCAG) for e-learning platforms\n"
        "- Accreditation and certification requirements for online courses\n"
        "- Content licensing and copyright compliance for educational materials\n"
        "- Data localization requirements for student records\n"
    ),
    "E-commerce": (
        "This is an E-commerce startup. The Legal Risk Assessment MUST specifically address:\n"
        "- Consumer protection laws (Consumer Protection Act 2019 in India, FTC in US)\n"
        "- E-commerce platform regulations (IT Act, DPDP Act in India)\n"
        "- GST/VAT and cross-border tax compliance\n"
        "- Return, refund, and dispute resolution policies\n"
        "- Seller and marketplace operator liability frameworks\n"
        "- Product liability and counterfeit goods prevention\n"
    ),
    "SaaS": (
        "This is a SaaS startup. The Legal Risk Assessment MUST specifically address:\n"
        "- SLA (Service Level Agreement) obligations and enterprise liability caps\n"
        "- GDPR, CCPA, and DPDP Act compliance for user data processing\n"
        "- Data residency and cross-border data transfer restrictions\n"
        "- SOC 2 Type II compliance for enterprise security assurance\n"
        "- Open-source software licensing obligations\n"
        "- EU AI Act compliance if AI features are core to the product\n"
    ),
    "Cybersecurity": (
        "This is a Cybersecurity startup. The Legal Risk Assessment MUST specifically address:\n"
        "- ISO 27001 certification for information security management systems\n"
        "- SOC 2 Type II compliance for security, availability, and confidentiality\n"
        "- GDPR and DPDP Act for personal data protection\n"
        "- Vulnerability disclosure and responsible reporting laws\n"
        "- Export control regulations on encryption technologies (EAR, ITAR)\n"
        "- CERT-In guidelines and mandatory breach notification timelines\n"
    ),
    "Manufacturing": (
        "This is a Manufacturing startup. The Legal Risk Assessment MUST specifically address:\n"
        "- Industrial safety standards (OSHA, Factory Act 1948 in India)\n"
        "- Environmental compliance (pollution control board clearances, EPA regulations)\n"
        "- Product liability and quality assurance certifications (ISO 9001, CE marking)\n"
        "- Import/export regulations and customs compliance for raw materials\n"
        "- Labour laws and worker safety obligations\n"
        "- Intellectual property protection for proprietary manufacturing processes\n"
    ),
    "Logistics": (
        "This is a Logistics startup. The Legal Risk Assessment MUST specifically address:\n"
        "- Transport regulations and licensing (Motor Vehicles Act, CMR Convention)\n"
        "- Customs and import/export compliance for cross-border logistics\n"
        "- Carrier liability and cargo insurance requirements\n"
        "- Data privacy for shipment and customer tracking information\n"
        "- Driver and gig-worker classification and labor law compliance\n"
        "- Hazardous materials transport regulations\n"
    ),
    "Real Estate": (
        "This is a Real Estate startup. The Legal Risk Assessment MUST specifically address:\n"
        "- RERA (Real Estate Regulation and Development Act) compliance in India\n"
        "- Real estate broker licensing and fiduciary duty regulations\n"
        "- Anti-money laundering (AML) obligations in property transactions\n"
        "- Zoning laws, land use regulations, and building permits\n"
        "- Fair housing and anti-discrimination laws\n"
        "- Data privacy for property-related financial and personal information\n"
    ),
    "AI/ML": (
        "This is an AI/ML startup. The Legal Risk Assessment MUST specifically address:\n"
        "- EU AI Act compliance and risk classification (prohibited, high-risk, limited risk)\n"
        "- Algorithmic bias, fairness, and explainability requirements\n"
        "- GDPR and DPDP Act for AI-processed personal data (right to explanation)\n"
        "- Copyright and IP issues with training data and AI-generated outputs\n"
        "- Product liability for AI system failures or harmful outputs\n"
        "- Sector-specific AI regulations (healthcare AI, financial AI)\n"
    ),
    "Generic Technology": (
        "This is a technology startup. Apply standard legal and risk assessment practices covering "
        "data privacy (GDPR, CCPA, DPDP Act), IP protection, SLA obligations, and emerging AI regulations."
    ),
}

# Keyword-based fallback classifier (no API needed)
KEYWORD_MAP = {
    "Healthcare": ["health", "medical", "hospital", "patient", "clinic", "doctor", "pharma", "drug", "therapy", "telemedicine", "diagnosis", "ehr", "emr", "biotech"],
    "FinTech": ["fintech", "payment", "banking", "finance", "loan", "lending", "invest", "wallet", "crypto", "insurance", "neobank", "trading", "wealth"],
    "Agriculture": ["agri", "farm", "crop", "drone spraying", "soil", "irrigation", "livestock", "harvest", "pesticide", "fertilizer", "food supply"],
    "Education": ["education", "edtech", "learning", "school", "college", "student", "course", "tutoring", "e-learning", "skill", "upskill", "lms"],
    "E-commerce": ["ecommerce", "e-commerce", "marketplace", "shop", "retail", "product listing", "cart", "delivery", "seller", "buyer", "order"],
    "SaaS": ["saas", "software as a service", "subscription", "b2b software", "platform", "dashboard", "api", "cloud tool"],
    "Cybersecurity": ["cybersecurity", "security", "threat", "vulnerability", "firewall", "siem", "pen test", "zero trust", "ransomware", "phishing"],
    "Manufacturing": ["manufactur", "factory", "industrial", "production", "assembly", "machining", "3d print"],
    "Logistics": ["logistic", "supply chain", "delivery", "shipping", "freight", "warehouse", "fleet", "last-mile", "cargo", "dispatch"],
    "Real Estate": ["real estate", "property", "rent", "lease", "housing", "apartment", "commercial space", "realty", "proptech"],
    "AI/ML": ["artificial intelligence", "machine learning", "deep learning", "neural network", "nlp", "computer vision", "llm", "generative ai"],
}


def _keyword_classify(idea_text: str) -> str:
    """Fast keyword-based fallback classifier."""
    idea_lower = idea_text.lower()
    scores = {industry: 0 for industry in KEYWORD_MAP}
    for industry, keywords in KEYWORD_MAP.items():
        for kw in keywords:
            if kw in idea_lower:
                scores[industry] += 1
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "Generic Technology"
    return best


async def classify_industry(idea_text: str) -> str:
    """
    Classifies a startup idea into one of the supported industry verticals.
    Uses the Groq LLM if GROQ_API_KEY is available; otherwise falls back to
    a fast keyword-based classifier.

    Args:
        idea_text: The raw startup idea description.

    Returns:
        A string label from SUPPORTED_INDUSTRIES.
    """
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        # No API key available — use keyword fallback
        classified = _keyword_classify(idea_text)
        print(f"🏭  Industry classifier (keyword mode): {classified}")
        return classified

    try:
        client = AsyncGroq(api_key=api_key)
        industries_str = ", ".join(SUPPORTED_INDUSTRIES)

        classification_prompt = (
            f"Classify the following startup idea into exactly ONE industry category from this list:\n"
            f"{industries_str}\n\n"
            f"Startup idea:\n{idea_text}\n\n"
            f"Respond with ONLY the category name, nothing else. "
            f"If unsure, respond with 'Generic Technology'."
        )

        response = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a startup industry classification expert. Respond with only the industry name, no explanation."
                },
                {
                    "role": "user",
                    "content": classification_prompt
                }
            ],
            model="llama-3.1-8b-instant",  # Fast, lightweight model for classification
            max_tokens=10,
            temperature=0.0,
        )

        raw = response.choices[0].message.content.strip()
        # Validate the response is one of the known industries
        for industry in SUPPORTED_INDUSTRIES:
            if industry.lower() in raw.lower():
                print(f"🏭  Industry classifier (LLM mode): {industry}")
                return industry

        # LLM returned something unexpected — fallback to keywords
        classified = _keyword_classify(idea_text)
        print(f"🏭  Industry classifier (keyword fallback): {classified}")
        return classified

    except Exception as e:
        # API error — fallback to keyword classifier silently
        classified = _keyword_classify(idea_text)
        print(f"🏭  Industry classifier (error fallback): {classified} | err: {e}")
        return classified


def get_industry_legal_context(industry: str) -> str:
    """Returns the regulation context string to inject into the Legal Agent prompt."""
    return INDUSTRY_REGULATIONS.get(industry, INDUSTRY_REGULATIONS["Generic Technology"])
