# backend/ai_agents/alice.py
import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def generate_ui_ux(prompt: str) -> str:
    """
    Generates UI/UX designs as HTML/CSS/React components based on user prompts.
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(f"Generate a single React component for a UI that does the following: {prompt}. Only include the code for the component, no explanations.")
    return response.text
