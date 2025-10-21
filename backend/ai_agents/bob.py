# backend/ai_agents/bob.py
import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def build_code(design: str) -> str:
    """
    Builds frontend/backend logic according to the design.
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(f"Generate the code for a React component based on the following design: {design}. Only include the code for the component, no explanations.")
    return response.text
