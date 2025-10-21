# backend/ai_agents/clara.py
import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def test_code(code: str) -> dict:
    """
    Validates code and reports bugs to the Boss AI.
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(f"Review the following code for bugs and suggest improvements: {code}. If no bugs are found, respond with 'All tests passed. No bugs found.'.")
    return {
        "status": "success",
        "report": response.text
    }
