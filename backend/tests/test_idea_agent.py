import asyncio
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.idea_agent import validate_idea

async def main():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("⚠️  GROQ_API_KEY environment variable is not set. Testing in local Mock Demo Mode...")
        
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

if __name__ == "__main__":
    asyncio.run(main())
