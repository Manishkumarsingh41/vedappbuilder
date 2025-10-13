import AgentAvatar from '../AgentAvatar';

export default function AgentAvatarExample() {
  return (
    <div className="flex gap-6 p-8 bg-background items-center">
      <AgentAvatar name="Perry" color="200 80% 55%" size="sm" />
      <AgentAvatar name="Gemma" color="280 75% 60%" size="md" isActive />
      <AgentAvatar name="Ollie" color="340 85% 55%" size="lg" />
    </div>
  );
}
