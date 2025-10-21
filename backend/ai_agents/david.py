# backend/ai_agents/david.py
import os
from perplexity import Client

def research_topic(topic: str) -> str:
    """
    Researches libraries/frameworks and suggests improvements.
    """
    client = Client(os.environ["PERPLEXITY_API_KEY"])
    response = client.chat.completions.create(
        model="llama-3-sonar-small-32k-online",
        messages=[
            {"role": "system", "content": "You are a helpful research assistant."},
            {"role": "user", "content": f"Research the best libraries and frameworks for {topic} and provide a summary of your findings."},
        ],
    )
    return response.choices[0].message.content
