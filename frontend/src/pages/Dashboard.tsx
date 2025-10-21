import React, { useState } from 'react';
import axios from 'axios';
import ChatPanel from '../components/ChatPanel';
import KanbanBoard from '../components/KanbanBoard';
import ProgressBar from '../components/ProgressBar';

const API_BASE_URL = "/api";

const Dashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const createAndFetchProject = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      // Create a new project
      const createResponse = await axios.post(`${API_BASE_URL}/create_project`, {
        prompt: prompt,
      });
      const projectData = createResponse.data;
      setProject(projectData);

      // Fetch progress updates
      const interval = setInterval(async () => {
        const progressResponse = await axios.get(`${API_BASE_URL}/progress/${projectData.id}`);
        setProject(progressResponse.data);
        if (progressResponse.data.status === 'complete') {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error creating or fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallProgress = () => {
    if (!project || !project.tasks) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'complete').length;
    return (completedTasks / project.tasks.length) * 100;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Ved AI App Builder</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Overall Project Progress</h2>
        <ProgressBar progress={calculateOverallProgress()} />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Chat with Oscar (Boss AI)</h2>
          <ChatPanel onSendMessage={setPrompt} />
          <button
            onClick={createAndFetchProject}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            disabled={loading}
          >
            {loading ? 'Building...' : 'Start Building'}
          </button>
        </div>
        <div className="col-span-2 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">AI Team Workflow</h2>
          {project && <KanbanBoard tasks={project.tasks} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
