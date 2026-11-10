"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { BriefFormData, BriefPayload, StepNumber } from "../types/brief";
import { StepperProgressBar } from "./StepperProgressBar";
import { Step1BrandIdentity } from "./steps/Step1BrandIdentity";
import { Step2LogoFormat } from "./steps/Step2LogoFormat";
import { Step3ColorTone } from "./steps/Step3ColorTone";
import { Step4StyleVibes } from "./steps/Step4StyleVibes";
import { Step5Contact } from "./steps/Step5Contact";
import { ProcessingScreen } from "./ProcessingScreen";
import { SuccessScreen } from "./SuccessScreen";

const INITIAL_FORM_DATA: BriefFormData = {
  brand_name: "",
  slogan: "",
  industry: "F&B / Ẩm thực",
  target_audience: "",
  logo_format: "Combination Mark",
  color_tone: "Earth Tones (Nâu gỗ, xanh lá rừng, be đất)",
  style_vibes: ["Minimalist", "Rustic"],
  client_name: "",
  client_phone: "",
  client_email: "",
  order_config: {
    delivery_time: "24h",
    logo_options_count: 1,
    revision_rounds: 2,
    quote_price: 1000000,
    currency: "VND",
    payment_status: "Quotation_Accepted",
  },
};

export const SmartBriefWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [completedSteps, setCompletedSteps] = useState<StepNumber[]>([]);
  const [formData, setFormData] = useState<BriefFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<BriefPayload | null>(null);

  // Update form fields
  const updateFormData = (fields: Partial<BriefFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear field-level error when user modifies it
    if (errors) {
      const keys = Object.keys(fields);
      const newErrors = { ...errors };
      keys.forEach((k) => delete newErrors[k]);
      setErrors(newErrors);
    }
  };

  // Step Validation logic
  const validateStep = (step: StepNumber): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.brand_name.trim()) {
        newErrors.brand_name = "Vui lòng nhập tên thương hiệu để tiếp tục.";
      }
      if (!formData.industry) {
        newErrors.industry = "Vui lòng chọn ngành hàng hoạt động của thương hiệu.";
      }
    } else if (step === 2) {
      if (!formData.logo_format) {
        newErrors.logo_format = "Vui lòng chọn 1 định dạng logo mong muốn.";
      }
    } else if (step === 3) {
      if (!formData.color_tone) {
        newErrors.color_tone = "Vui lòng chọn 1 tông màu định hướng.";
      }
    } else if (step === 4) {
      if (!formData.style_vibes || formData.style_vibes.length === 0) {
        newErrors.style_vibes = "Vui lòng chọn ít nhất 1 phong cách thương hiệu.";
      } else if (formData.style_vibes.length > 3) {
        newErrors.style_vibes = "Chỉ được chọn tối đa 3 tính từ phong cách.";
      }
    } else if (step === 5) {
      if (!formData.client_name.trim()) {
        newErrors.client_name = "Vui lòng nhập họ và tên của bạn.";
      }
      if (!formData.client_phone.trim()) {
        newErrors.client_phone = "Vui lòng nhập số điện thoại hoặc Zalo liên hệ.";
      } else if (formData.client_phone.trim().length < 8) {
        newErrors.client_phone = "Số điện thoại không hợp lệ (tối thiểu 8 chữ số).";
      }
      if (!formData.client_email.trim()) {
        newErrors.client_email = "Vui lòng nhập email nhận trọn bộ file.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email.trim())) {
        newErrors.client_email = "Địa chỉ email không đúng định dạng.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to Next Step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as StepNumber);
        // Scroll smoothly to form container top
        const formElement = document.getElementById("smart-brief-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  // Navigate to Previous Step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber);
      const formElement = document.getElementById("smart-brief-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Jump to Step from progress bar
  const handleJumpToStep = (targetStep: StepNumber) => {
    if (targetStep < currentStep || completedSteps.includes(targetStep)) {
      setCurrentStep(targetStep);
    }
  };

  // Submit Brief
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) {
      return;
    }

    // Build standard payload matching Section V Schema
    const payload: BriefPayload = {
      client_name: formData.client_name.trim(),
      client_phone: formData.client_phone.trim(),
      client_email: formData.client_email.trim(),
      brand_name: formData.brand_name.trim(),
      slogan: formData.slogan.trim() || "Chưa có slogan (AI sáng tạo)",
      industry: formData.industry,
      target_audience: formData.target_audience.trim() || "Khách hàng đại chúng",
      logo_format: formData.logo_format,
      color_tone: formData.color_tone,
      style_vibes: formData.style_vibes,
      status: "Pending",
      created_at: new Date().toISOString(),
      order_config: formData.order_config,
    };

    setSubmittedPayload(payload);
    setIsProcessing(true);
    setIsApiDone(false);

    // Call Backend API với xử lý đồng bộ đảm bảo có mã trước khi chuyển màn hình
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.project_id) {
        setSubmittedPayload({ ...payload, project_id: data.project_id });
      } else {
        const fallbackId = `LUMINA-${String(Date.now()).slice(-2)}`;
        setSubmittedPayload({ ...payload, project_id: fallbackId });
      }
    } catch (err) {
      console.warn("Lumina Backend API error, using safe assigned ID:", err);
      const fallbackId = `LUMINA-${String(Date.now()).slice(-2)}`;
      setSubmittedPayload({ ...payload, project_id: fallbackId });
    } finally {
      setIsApiDone(true);
    }
  };

  // Finish processing animation callback
  const handleFinishProcessing = () => {
    setIsProcessing(false);
    setIsSuccess(true);
    // Smooth scroll to success state
    const formElement = document.getElementById("smart-brief-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Reset form to start a new brief
  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCompletedSteps([]);
    setCurrentStep(1);
    setIsProcessing(false);
    setIsApiDone(false);
    setIsSuccess(false);
    setSubmittedPayload(null);
    setErrors({});
  };

  return (
    <div
      id="smart-brief-form"
      className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      {/* Container Box with Studio Glassmorphism & Gold Accent */}
      <div className="rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl shadow-stone-950/80 backdrop-blur-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        {/* Subtle Decorative Ambient Light inside card */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. PROCESSING STATE (Animation loading) */}
        {isProcessing && (
          <ProcessingScreen
            formData={formData}
            isApiDone={isApiDone}
            onFinish={handleFinishProcessing}
          />
        )}

        {/* 2. SUCCESS STATE */}
        {!isProcessing && isSuccess && submittedPayload && (
          <SuccessScreen
            payload={submittedPayload}
            onReset={handleResetForm}
          />
        )}

        {/* 3. SMART BRIEF STEPPER (Active wizard) */}
        {!isProcessing && !isSuccess && (
          <div>
            {/* Stepper Progress Bar */}
            <StepperProgressBar
              currentStep={currentStep}
              onStepClick={handleJumpToStep}
              completedSteps={completedSteps}
            />

            {/* Current Step Content */}
            <div className="mt-8 mb-10">
              {currentStep === 1 && (
                <Step1BrandIdentity
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <Step2LogoFormat
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3ColorTone
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 4 && (
                <Step4StyleVibes
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 5 && (
                <Step5Contact
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  isSubmitting={isProcessing}
                  onSubmit={handleSubmit}
                />
              )}
            </div>

            {/* Bottom Navigation Buttons (For Steps 1 to 4) */}
            {currentStep < 5 && (
              <div className="flex items-center justify-between pt-6 border-t border-stone-800">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={handleBack}
                  className={`px-5 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    currentStep === 1
                      ? "opacity-30 border-transparent text-stone-600 cursor-not-allowed"
                      : "border-stone-800 bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-mono hidden sm:inline">
                    Bước {currentStep} của 5
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Tiếp tục</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
