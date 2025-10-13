import ProjectForm from '../ProjectForm';

export default function ProjectFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Project submitted:', data);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-background to-accent/10 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <ProjectForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
