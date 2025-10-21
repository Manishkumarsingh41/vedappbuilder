from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import uuid
from typing import List, Dict
import threading

from ai_agents import oscar

app = FastAPI()

# In-memory database
with open("memory/db.json", "r") as f:
    db = json.load(f)

db_lock = threading.Lock()

class Project(BaseModel):
    prompt: str

class TaskUpdate(BaseModel):
    project_id: str
    task_id: int
    status: str
    output: str

def run_orchestration_in_background(project_id: str):
    with db_lock:
        project = next((p for p in db["projects"] if p["id"] == project_id), None)
    if project:
        oscar.run_orchestration(project)
        with db_lock:
            project["status"] = "complete"
            with open("memory/db.json", "w") as f:
                json.dump(db, f, indent=2)

@app.post("/create_project")
def create_project(project: Project):
    project_id = str(uuid.uuid4())
    tasks = oscar.assign_tasks(project.prompt)
    new_project = {
        "id": project_id,
        "prompt": project.prompt,
        "tasks": tasks,
        "status": "in_progress",
        "versions": [],
    }
    with db_lock:
        db["projects"].append(new_project)
        with open("memory/db.json", "w") as f:
            json.dump(db, f, indent=2)

    # Run the orchestration in a background thread
    thread = threading.Thread(target=run_orchestration_in_background, args=(project_id,))
    thread.start()

    return new_project

@app.get("/progress/{project_id}")
def get_progress(project_id: str):
    with db_lock:
        project = next((p for p in db["projects"] if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/update_task")
def update_task(task_update: TaskUpdate):
    with db_lock:
        project = next((p for p in db["projects"] if p["id"] == task_update.project_id), None)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        task = project["tasks"][task_update.task_id]
        task["status"] = task_update.status
        task["output"] = task_update.output

        with open("memory/db.json", "w") as f:
            json.dump(db, f, indent=2)
    return project

@app.get("/memory/{project_id}")
def get_memory(project_id: str):
    with db_lock:
        project = next((p for p in db["projects"] if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "versions": project["versions"],
        "task_history": project["tasks"]
    }
