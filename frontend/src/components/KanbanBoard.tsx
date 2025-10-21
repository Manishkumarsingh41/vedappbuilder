import React from 'react';

interface Task {
  agent: string;
  task: string;
  status: string;
}

interface KanbanBoardProps {
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {tasks.map((task, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold">{task.agent}</h3>
          <p>{task.task}</p>
          <p className={`mt-2 ${task.status === 'complete' ? 'text-green-500' : 'text-yellow-500'}`}>
            {task.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
