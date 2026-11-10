"use client";

import React from "react";
import { Check, Sparkles, Building2, Palette, Sliders, SendHorizontal } from "lucide-react";
import { StepNumber } from "../types/brief";

interface StepperProgressBarProps {
  currentStep: StepNumber;
  onStepClick: (step: StepNumber) => void;
  completedSteps: StepNumber[];
}

interface StepItem {
  number: StepNumber;
  shortTitle: string;
  fullTitle: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  {
    number: 1,
    shortTitle: "Định Danh",
    fullTitle: "Định danh thương hiệu",
    icon: Building2,
  },
  {
    number: 2,
    shortTitle: "Logo",
    fullTitle: "Chọn định dạng logo",
    icon: Sparkles,
  },
  {
    number: 3,
    shortTitle: "Tông Màu",
    fullTitle: "Chọn bảng màu sắc",
    icon: Palette,
  },
  {
    number: 4,
    shortTitle: "Cảm Xúc",
    fullTitle: "Phong cách & Cảm xúc thương hiệu",
    icon: Sliders,
  },
  {
    number: 5,
    shortTitle: "Bàn Giao",
    fullTitle: "Thông tin liên hệ",
    icon: SendHorizontal,
  },
];

export const StepperProgressBar: React.FC<StepperProgressBarProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {/* Top Status & Progress Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-stone-400 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-stone-200 font-semibold uppercase tracking-wider">
            Bước {currentStep} / 5:
          </span>
          <span className="text-amber-300 font-medium hidden sm:inline">
            {STEPS[currentStep - 1].fullTitle}
          </span>
        </div>
        <div className="text-stone-400 font-mono">
          Hoàn tất <span className="text-amber-400 font-semibold">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800 p-0.5 relative">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500 ease-out shadow-sm shadow-amber-500/50"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Nodes */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-4">
        {STEPS.map((step) => {
          const isCurrent = step.number === currentStep;
          const isCompleted = completedSteps.includes(step.number);
          const isClickable = isCompleted || step.number < currentStep;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              type="button"
              disabled={!isClickable && !isCurrent}
              onClick={() => isClickable && onStepClick(step.number)}
              className={`flex flex-col items-center text-center p-2 rounded-xl transition-all duration-200 group ${
                isCurrent
                  ? "bg-stone-900/90 border border-amber-500/40 shadow-lg shadow-amber-950/30"
                  : isCompleted
                  ? "bg-stone-950/60 border border-stone-800/80 hover:border-amber-500/30 cursor-pointer"
                  : "bg-transparent border border-transparent opacity-40 cursor-not-allowed"
              }`}
            >
              {/* Badge Circle */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-1.5 transition-all ${
                  isCurrent
                    ? "bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/40 scale-105"
                    : isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-stone-800 text-stone-400"
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-[10px] sm:text-xs font-medium truncate max-w-full tracking-tight ${
                  isCurrent
                    ? "text-amber-300 font-semibold"
                    : isCompleted
                    ? "text-stone-300"
                    : "text-stone-500"
                }`}
              >
                {step.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
