"use client";

import { Check, CircleDot, Eye, LayoutGrid, Pencil, Settings } from "lucide-react";

import { cn } from "~/lib/utils";

function getStepIcon(step: number) {
  switch (step) {
    case 1:
      return <LayoutGrid className="w-2.5 h-2.5 md:w-3 md:h-3" />;
    case 2:
      return <Pencil className="w-2.5 h-2.5 md:w-3 md:h-3" />;
    case 3:
      return <Settings className="w-2.5 h-2.5 md:w-3 md:h-3" />;
    case 4:
      return <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" />;
    default:
      return <span className="text-xs">{step}</span>;
  }
}

function getStepLabel(step: number) {
  switch (step) {
    case 1: return "Type";
    case 2: return "Details";
    case 3: return "Settings";
    case 4: return "Preview";
    default: return `Step ${step}`;
  }
}

export function StepIndicator({
  currentStep = 1,
  totalSteps = 4,
  onStepChange,
  className,
}: {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
  className?: string;
}) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center flex-1">
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute h-0.5 w-full right-0",
                  step < currentStep ? "bg-primary" : "bg-muted",
                )}
                style={{ top: "9px", left: "50%" }}
              />
            )}
            <button
              type="button"
              className={cn(
                "relative z-10 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border",
                step === currentStep && "border-primary bg-primary text-primary-foreground",
                step < currentStep && "border-primary bg-primary text-primary-foreground",
                step > currentStep && "border-muted bg-background text-muted-foreground",
                onStepChange && "cursor-pointer hover:border-primary/80",
              )}
              onClick={() => onStepChange?.(step)}
              disabled={!onStepChange}
            >
              {step < currentStep
                ? <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                : step === currentStep
                  ? <CircleDot className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  : getStepIcon(step)}
            </button>
            <span
              className={cn(
                "mt-1 text-[10px] md:text-xs",
                step === currentStep ? "text-primary" : "text-muted-foreground",
              )}
            >
              {getStepLabel(step)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
