'use client';

interface FlowStep {
  label: string;
  hint: string;
}

interface FlowStepsProps {
  title?: string;
  steps: FlowStep[];
}

export function FlowSteps({ title = 'How this works', steps }: FlowStepsProps) {
  return (
    <div className="rounded-[1.15rem] border border-line/80 bg-paper/65 p-5">
      <p className="text-[0.72rem] uppercase tracking-terminal text-muted">{title}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div key={`${index + 1}-${step.label}`} className="rounded-2xl border border-line/70 bg-white/80 p-4">
            <p className="text-[0.68rem] uppercase tracking-terminal text-muted">
              Step {index + 1}
            </p>
            <p className="mt-2 text-sm text-ink">{step.label}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{step.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
