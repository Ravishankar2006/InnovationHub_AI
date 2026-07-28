import asyncio
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.idea_agent import validate_idea
from agents.strategy_agent import generate_strategy

async def main():
    api_key_val = os.getenv("GROQ_API_KEY")
    if not api_key_val:
        print("⚠️  GROQ_API_KEY environment variable is not set. Validation running in local Mock Demo Mode...")
        
    api_key_strat = os.getenv("GROQ_STRATEGY_API_KEY")
    if not api_key_strat:
        print("⚠️  GROQ_STRATEGY_API_KEY environment variable is not set. Strategy running in local Mock Demo Mode...")
        
    test_idea = "I want to build an AI-powered drone platform for agriculture that monitors crop health and automates pesticide spraying."
    print(f"🚀 Running Idea Validation Agent on concept: '{test_idea}'")
    
    try:
        result = await validate_idea(test_idea)
        print("\n✅ Validation Successful! Result Schema:")
        print(f"  • Innovation Score: {result.innovation_score}/100")
        print(f"  • Problem Statement: {result.problem_statement}")
        print(f"  • Target Audience: {result.target_audience}")
        print(f"  • Value Proposition: {result.value_proposition}")
        print(f"  • Risks: {result.risks}")
        print(f"  • Recommendations: {result.recommendations}")
    except Exception as e:
        print(f"\n❌ Validation Failed with error: {e}")
        
    print(f"\n🚀 Running Business Strategy Agent on concept: '{test_idea}'")
    try:
        strat_result = await generate_strategy(test_idea)
        print("\n✅ Strategy Generation Successful! Result Schema:")
        print(f"  • Business Model: {strat_result.business_model}")
        print(f"  • Pricing Model: {strat_result.pricing_model}")
        print(f"  • Go-To-Market tactics: {strat_result.go_to_market}")
        print(f"  • Competitive Moat: {strat_result.competitive_moat}")
        print(f"  • Roadmap (30 Days): {strat_result.roadmap.phase_1_30_days}")
        print(f"  • Roadmap (60 Days): {strat_result.roadmap.phase_2_60_days}")
        print(f"  • Roadmap (90 Days): {strat_result.roadmap.phase_3_90_days}")
    except Exception as e:
        print(f"\n❌ Strategy Generation Failed with error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
