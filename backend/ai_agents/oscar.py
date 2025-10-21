# backend/ai_agents/oscar.py
import os
from openai import OpenAI
from typing import List, Dict
from . import alice, bob, clara, david

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def assign_tasks(prompt: str) -> List[Dict]:
    """
    Assigns tasks dynamically, monitors progress, approves changes, triggers deployment.
    """
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a project manager AI. Your job is to break down a user's prompt into a series of tasks for your AI team."},
            {"role": "user", "content": f"Break down the following prompt into a series of tasks for my AI team: {prompt}. The team consists of Alice (Designer), Bob (Developer), Clara (Tester), and David (Researcher). Respond with a JSON list of tasks, where each task has an 'agent', 'task', 'status' ('pending'), 'output' (empty string), and 'dependencies' (a list of task indices that must be completed before this task can start)."},
        ],
    )
    return response.choices[0].message.content

def run_orchestration(project: Dict):
    """
    Runs the AI agent orchestration.
    """
    tasks = project["tasks"]
    completed_tasks = set()

    while len(completed_tasks) < len(tasks):
        for i, task in enumerate(tasks):
            if task["status"] == "pending" and all(dep in completed_tasks for dep in task.get("dependencies", [])):
                task["status"] = "in_progress"

                try:
                    if task["agent"] == "Alice":
                        task["output"] = alice.generate_ui_ux(task["task"])
                    elif task["agent"] == "David":
                        task["output"] = david.research_topic(task["task"])
                    elif task["agent"] == "Bob":
                        # Bob needs the design from Alice
                        design = ""
                        for dep_index in task.get("dependencies", []):
                            if tasks[dep_index]["agent"] == "Alice":
                                design = tasks[dep_index]["output"]
                                break
                        task["output"] = bob.build_code(design)
                    elif task["agent"] == "Clara":
                        # Clara needs the code from Bob
                        code = ""
                        for dep_index in task.get("dependencies", []):
                            if tasks[dep_index]["agent"] == "Bob":
                                code = tasks[dep_index]["output"]
                                break
                        task["output"] = clara.test_code(code)

                    task["status"] = "complete"
                    completed_tasks.add(i)
                except Exception as e:
                    task["status"] = "failed"
                    task["output"] = str(e)
                    completed_tasks.add(i) # Mark as complete to avoid infinite loop
