"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Brain, Cpu, CheckCircle } from "lucide-react";
import { BriefFormData } from "../types/brief";

interface ProcessingScreenProps {
  formData: BriefFormData;
  isApiDone?: boolean;
  onFinish: () => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  formData,
  isApiDone = false,
  onFinish,
}) => {
  const [progress, setProgress] = useState(10);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    {
      title: "Phân tích dữ liệu & Định vị ngành hàng",
      sub: `Hệ thống AI đang phân tích dữ liệu ngành ${formData.industry || "thương hiệu"}...`,
      percent: 35,
    },
    {
      title: "Khởi tạo hình học & Phác thảo Vector",
      sub: `Đang tính toán tỷ lệ vàng & phác thảo vector logo ${formData.logo_format}...`,
      percent: 70,
    },
    {
      title: "Hoàn tất cấp mã & Lưu trữ hồ sơ",
      sub: "Đồng bộ hóa bảng màu, font chữ, cấp mã dự án và gửi đến Giám đốc Sáng tạo...",
      percent: 100,
    },
  ];

  useEffect(() => {
    let finished = false;

    // Tăng tiến độ mượt mà từ 10% đến 90% trong khoảng 2.2 giây
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90 && !isApiDone) {
          // Nếu API chưa trả về kết quả, giữ ở mức 90-95% chờ API
          if (prev < 95) return prev + 1;
          return prev;
        }
        if (prev >= 98) {
          return 100;
        }
        return prev + 3;
      });
    }, 60);

    const stage1Timer = setTimeout(() => {
      setCurrentStage(1);
    }, 1000);

    const stage2Timer = setTimeout(() => {
      setCurrentStage(2);
    }, 2000);

    // Safety timeout: tối đa 8 giây nếu mạng treo thì vẫn mở màn hình thành công
    const safetyTimer = setTimeout(() => {
      if (!finished) {
        finished = true;
        setProgress(100);
        setCurrentStage(2);
        setTimeout(onFinish, 300);
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(safetyTimer);
    };
  }, [isApiDone, onFinish]);

  // Khi API đã có kết quả (isApiDone = true) và progress đã đạt tối thiểu 70%
  useEffect(() => {
    if (isApiDone && progress >= 60) {
      setProgress(100);
      setCurrentStage(2);
      const timer = setTimeout(() => {
        onFinish();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isApiDone, progress, onFinish]);

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-xl mx-auto animate-fade-in">
      {/* High-tech Glowing Ring Animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center" />
        <div className="absolute inset-2 rounded-full border-2 border-stone-800 border-b-amber-300/80 animate-spin [animation-direction:reverse] [animation-duration:3s]" />
        
        {/* Center Glowing Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 rounded-full bg-stone-900 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/20">
            <Brain className="w-8 h-8 animate-pulse text-amber-400" />
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-amber-500/10 blur-xl rounded-full pointer-events-none" />
      </div>

      {/* Brand Identity Processing Header */}
      <div className="space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lumina AI Engine Processing</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-100">
          Đang Khởi Tạo Bản Sắc Thương Hiệu
        </h3>
        <p className="text-sm font-medium text-amber-300/90 font-serif tracking-wide">
          &ldquo;{formData.brand_name}&rdquo;
        </p>
      </div>

      {/* Dynamic Sub-text based on 3-second stage */}
      <div className="min-h-[48px] mb-8">
        <p className="text-sm sm:text-base text-stone-200 font-medium transition-all duration-300">
          {stages[currentStage].sub}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Hệ thống AI đang xử lý theo chuẩn tỷ lệ vàng quốc tế...
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full space-y-2 mb-6">
        <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-150 ease-out shadow-sm shadow-amber-500/50"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-stone-400 px-1">
          <span>AI Pipeline</span>
          <span className="text-amber-400 font-semibold">{Math.min(progress, 100)}%</span>
        </div>
      </div>

      {/* Three Sub-steps List */}
      <div className="w-full text-left space-y-2.5 pt-4 border-t border-stone-800/80">
        {stages.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isCurrent = currentStage === idx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs p-2 rounded-lg transition-all ${
                isCurrent
                  ? "bg-stone-900 border border-amber-500/30 text-amber-200"
                  : isDone
                  ? "text-stone-300 opacity-80"
                  : "text-stone-500 opacity-40"
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
              )}
              <span className="font-medium truncate">{stage.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
