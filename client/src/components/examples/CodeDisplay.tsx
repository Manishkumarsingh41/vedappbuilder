import CodeDisplay from '../CodeDisplay';

export default function CodeDisplayExample() {
  const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}! Welcome to the future.\`;
}

const result = greet("AI Agent");
console.log(result);`;

  return (
    <div className="p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <CodeDisplay
          code={sampleCode}
          language="TypeScript"
          fileName="example.ts"
        />
      </div>
    </div>
  );
}
