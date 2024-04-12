import React from "react";
import Step from "../Step";

export default function Steps() {
  return (
    <div className="flex flex-col  py-32 ">
      <div className="flex flex-col gap-1 pb-5">
        <h1 className="text-3xl font-bold ">Start chatting in minutes</h1>
        <p className="text-zinc-500">Get started with your PDF.</p>
      </div>
      <ul className="flex md:items-center justify-between gap-8 md:flex-row flex-col">
        {steps.map((step) => (
          <Step key={step.name} step={step} />
        ))}
      </ul>
    </div>
  );
}

const steps = [
  {
    name: "Step 1",
    title: "Sign up for an account",
    description: "Either starting out with  a free plan or choose our pro plan",
  },
  {
    name: "Step 2",
    title: "Upload your PDF",
    description:
      "We will process your file and make  it ready  for you to chat with.",
  },
  {
    name: "Step 3",
    title: "Chat with your PDF",
    description: "Now you can start chatting with your PDF.",
  },
];
