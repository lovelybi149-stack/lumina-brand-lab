"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, Quote, RefreshCw, Check } from "lucide-react";
import { ProjectRecord } from "../../../types/curation";

interface TabContentEditorProps {
  project: ProjectRecord;
  onChange: (updates: Partial<ProjectRecord>) => void;
}

export const TabContentEditor: React.FC<TabContentEditorProps> = ({
  project,
  onChange
}) => {
  const [slogan, setSlogan] = useState(project.tagline || "");
  const [story, setStory] = useState(project.brand_story || "");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedFeedback, setEnhancedFeedback] = useState<string | null>(null);

  const wordCount = story.trim() ? story.trim().split(/\s+/).length : 0;

  const handleSloganChange = (val: string) => {
    setSlogan(val);
    onChange({ tagline: val });
  };

  const handleStoryChange = (val: string) => {
    setStory(val);
    onChange({ brand_story: val });
  };

  const applySuggestedTagline = (item: string) => {
    handleSloganChange(item);
  };

  const enhanceStory = (mode: "poetic" | "minimalist" | "modern") => {
    setIsEnhancing(true);
    setTimeout(() => {
      let refined = story;
      let msg = "";

      if (mode === "poetic") {
        refined =
          "Ẩn mình giữa triền đồi thông lộng gió của Đà Lạt, Gió Mộc Coffee là nơi thời gian chậm lại để tâm hồn tìm về nguyên bản. Giao hòa giữa triết lý Wabi-sabi tôn vinh nét đẹp thô mộc tự nhiên và hồn gỗ Tây Nguyên trầm ấm, từng giọt cà phê nguyên bản tại Gió Mộc tựa như làn gió núi thanh lành, khơi nguồn an yên và cảm hứng sáng tạo thuần khiết.";
        msg = "Đã tinh chỉnh giọng điệu mượt mà, đậm chất thơ tự nhiên Wabi-sabi.";
      } else if (mode === "minimalist") {
        refined =
          "Gió Mộc Coffee kiến tạo không gian tĩnh tại giữa đồi thông đại ngàn. Tinh lọc từ những hạt cà phê Arabica Cầu Đất nguyên bản cùng triết lý Wabi-sabi tôn vinh sự tối giản, chúng tôi mang đến trải nghiệm thưởng thức sâu lắng cho người làm sáng tạo.";
        msg = "Đã cô đọng câu chuyện thương hiệu theo phong cách tối giản thanh lịch.";
      } else {
        refined =
          "Gió Mộc Coffee là điểm giao thoa giữa hương vị cà phê đặc sản và không gian làm việc tĩnh tại. Đón lấy làn gió cao nguyên lướt qua từng thớ gỗ mộc, mỗi khoảnh khắc tại Gió Mộc là một trải nghiệm đánh thức nguồn năng lượng sáng tạo tích cực.";
        msg = "Đã cập nhật giọng điệu hiện đại, hướng tới trải nghiệm chuyên nghiệp.";
      }

      setStory(refined);
      onChange({ brand_story: refined });
      setIsEnhancing(false);
      setEnhancedFeedback(msg);
      setTimeout(() => setEnhancedFeedback(null), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 text-stone-200">
      {/* 1. Slogan Editor */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
            <Quote className="w-4 h-4" />
            Khẩu Hiệu / Slogan Chính Thức
          </label>
          <span className="text-[11px] text-stone-400">Hiển thị trong Logo &amp; Guideline</span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={slogan}
            onChange={(e) => handleSloganChange(e.target.value)}
            placeholder="Nhập Slogan định vị thương hiệu..."
            className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-100 text-sm font-medium tracking-wide placeholder-stone-600 outline-none transition-all"
          />
        </div>

        {/* Gợi ý Slogan AI */}
        {project.tagline_options && project.tagline_options.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gợi ý biến thể Slogan từ AI (Bấm để áp dụng nhanh):
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tagline_options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applySuggestedTagline(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all text-left flex items-center gap-1.5 border ${
                    slogan === opt
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-200 font-medium"
                      : "bg-stone-950 hover:bg-stone-800/80 border-stone-800 text-stone-300"
                  }`}
                >
                  {slogan === opt && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span>&ldquo;{opt}&rdquo;</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Brand Story Editor */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Đoạn Văn Câu Chuyện Thương Hiệu (Brand Story)
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                wordCount <= 100
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {wordCount} / 100 từ chuẩn
            </span>
          </div>
        </div>

        <textarea
          rows={6}
          value={story}
          onChange={(e) => handleStoryChange(e.target.value)}
          placeholder="Viết hoặc chỉnh sửa câu chuyện thương hiệu chạm đến cảm xúc..."
          className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-200 text-sm leading-relaxed placeholder-stone-600 outline-none transition-all resize-y"
        />

        {/* Trợ lý AI chỉnh sửa câu từ */}
        <div className="pt-2 border-t border-stone-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Công cụ AI nâng cấp câu từ của Giám đốc Sáng tạo:
            </span>
            {isEnhancing && (
              <span className="text-[11px] text-amber-400 animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Đang trau chuốt...
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isEnhancing}
              onClick={() => enhanceStory("poetic")}
              className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs transition-all flex items-center gap-1.5"
            >
              <span>🌿 Đậm chất thơ Wabi-sabi</span>
            </button>
            <button
              type="button"
              disabled={isEnhancing}
              onClick={() => enhanceStory("minimalist")}
              className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs transition-all flex items-center gap-1.5"
            >
              <span>📐 Cô đọng tối giản</span>
            </button>
            <button
              type="button"
              disabled={isEnhancing}
              onClick={() => enhanceStory("modern")}
              className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs transition-all flex items-center gap-1.5"
            >
              <span>☕ Trải nghiệm cà phê sâu sắc</span>
            </button>
          </div>

          {enhancedFeedback && (
            <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 mt-2 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>{enhancedFeedback}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

