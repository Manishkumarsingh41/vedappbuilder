import WorkflowTimeline from '../WorkflowTimeline';

export default function WorkflowTimelineExample() {
  const steps = [
    { id: 1, title: "Product Definition", description: "Define MVP scope and features", status: "complete" as const, agent: "Perry" },
    { id: 2, title: "UI/UX Design", description: "Create wireframes and design system", status: "complete" as const, agent: "Gemma" },
    { id: 3, title: "Frontend Development", description: "Build React components", status: "active" as const, agent: "Ollie" },
    { id: 4, title: "Backend Development", description: "Create API endpoints", status: "pending" as const, agent: "Hugo" },
    { id: 5, title: "Deployment", description: "Deploy to production", status: "pending" as const, agent: "Milo" },
  ];

  return (
    <div className="p-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 font-['Space_Grotesk']">Build Progress</h2>
        <WorkflowTimeline steps={steps} />
      </div>
    </div>
  );
}
