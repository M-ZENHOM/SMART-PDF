import React from "react";

interface stepProps {
  step: {
    name: string;
    title: string;
    description: string;
  };
}

export default function Step({ step }: stepProps) {
  return (
    <li className="border-t border-orange-600 py-4 bg-white rounded-sm p-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-orange-600 font-medium">{step.name}</span>
        <h3 className="text-xl font-semibold">{step.title}</h3>
        <p className="text-zinc-700">{step.description}</p>
      </div>
    </li>
  );
}
