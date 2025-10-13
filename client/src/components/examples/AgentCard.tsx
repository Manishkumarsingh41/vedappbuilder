import AgentCard from '../AgentCard';

export default function AgentCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
        <AgentCard
          name="Perry"
          role="Product Manager"
          model="Perplexity"
          color="200 80% 55%"
          status="complete"
          tasks={["Research similar apps", "Define user pain points"]}
          output="Completed market research and identified 3 key competitors..."
        />
        <AgentCard
          name="Gemma"
          role="UI/UX Designer"
          model="Gemini"
          color="280 75% 60%"
          status="working"
          tasks={["Create screen hierarchy", "Suggest UI color scheme"]}
        />
        <AgentCard
          name="Ollie"
          role="Frontend Developer"
          model="OpenAI"
          color="340 85% 55%"
          status="idle"
          tasks={["Generate React components", "Integrate API endpoints"]}
        />
      </div>
    </div>
  );
}
