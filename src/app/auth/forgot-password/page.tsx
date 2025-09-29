"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PulseLoader } from "react-spinners";
import { useLanguage } from "@/contexts/language-content";

// ResetWithCodeFlow: three-step flow (email -> code -> new password)
function ResetWithCodeFlow() {
  const router = useRouter();
  const { t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }>({ email: "", code: "", newPassword: "", confirmPassword: "" });

  // Step 1: Send email to receive code
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: t("forgot-password-page.code.error-email-required"),
      }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: t("forgot-password-page.code.error-email-invalid"),
      }));
      return;
    }

    setIsLoading(true);
    try {
      // Use existing endpoint to trigger email code
      const response = await api.post("/api/users/password/forgot/send-code", {
        email,
      });
      if (response.status === 200) {
        toast.success(t("forgot-password-page.code.sent"));
        setStep(2);
      }
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : t("forgot-password-page.code.error-processing");
      console.error("Erro ao solicitar recuperação:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Verify code locally and proceed (server will validate on reset)
  async function handleCodeVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        code: t("forgot-password-page.code.error-code-invalid"),
      }));
      return;
    }

    setIsLoading(true);
    try {
      // Call server to verify the code
      const response = await api.post(
        "/api/users/password/forgot/verify-code",
        {
          email,
          code,
        }
      );
      if (response.status === 200) {
        toast.success(t("forgot-password-page.code.code-provided"));
        setStep(3);
      }
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : t("forgot-password-page.code.error-code-invalid");
      setErrors((prev) => ({ ...prev, code: message }));
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  // Step 3: Reset password using email + code + newPassword
  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();

    let isValid = true;
    const nextErrors = { ...errors };

    if (!newPassword) {
      nextErrors.newPassword = t(
        "forgot-password-page.code.error-password-required"
      );
      isValid = false;
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = t(
        "forgot-password-page.code.error-password-min"
      );
      isValid = false;
    } else {
      nextErrors.newPassword = "";
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = t(
        "forgot-password-page.code.error-password-mismatch"
      );
      isValid = false;
    } else {
      nextErrors.confirmPassword = "";
    }

    if (!isValid) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Use new endpoint for password reset with code
      const response = await api.post("/api/users/password/forgot/reset", {
        email,
        code,
        password: newPassword,
      });

      if (response.status === 200) {
        toast.success(t("forgot-password-page.code.reset-success"));
        router.push("/auth/signin");
      }
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : t("forgot-password-page.code.error-reset");
      console.error("Erro ao redefinir senha:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {t("forgot-password-page.code.title")}
        </h2>
        <p className="text-sm text-gray-600">
          {step === 1 && t("forgot-password-page.code.step1-desc")}
          {step === 2 && t("forgot-password-page.code.step2-desc")}
          {step === 3 && t("forgot-password-page.code.step3-desc")}
        </p>
      </div>

      <div className="bg-white/70 p-6 rounded-xl border relative space-y-4">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <div
            className={`h-1 w-16 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">
                {t("forgot-password-page.email")}
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder={t("forgot-password-page.email-placeholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl"
            >
              {isLoading ? (
                <PulseLoader color="white" size={8} />
              ) : (
                t("forgot-password-page.code.send-code")
              )}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">
                {t("forgot-password-page.code.verification-code-label")}
              </Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(value);
                  if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                }}
                className={`text-center tracking-widest font-mono ${
                  errors.code ? "border-red-500" : ""
                }`}
                disabled={isLoading}
                maxLength={6}
                required
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl"
              >
                {isLoading ? (
                  <PulseLoader color="white" size={8} />
                ) : (
                  t("forgot-password-page.code.verify-code")
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full"
              >
                {t("forgot-password-page.code.back-to-email")}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">
                {t("forgot-password-page.code.new-password-label")}
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword)
                    setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                className={errors.newPassword ? "border-red-500" : ""}
                disabled={isLoading}
                required
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                {t("forgot-password-page.code.confirm-password-label")}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
                required
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl"
              >
                {isLoading ? (
                  <PulseLoader color="white" size={8} />
                ) : (
                  t("forgot-password-page.code.reset-password")
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(2)}
                className="w-full"
              >
                {t("forgot-password-page.code.back-to-code")}
              </Button>
            </div>
          </form>
        )}

        <p className="text-[11px] text-center text-gray-500">
          {t("forgot-password-page.code.security-note")}
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full">
        <div className="overflow-hidden min-h-[70vh] max-w-[600px] mx-auto bg-white border rounded-xl shadow-sm p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">
              {t("forgot-password-page.title")}
            </h1>
            <span
              className="p-3 rounded-lg border cursor-pointer"
              onClick={() => router.replace("/auth/signin")}
            >
              <X className="w-3 h-3" />
            </span>
          </div>

          <ResetWithCodeFlow />
        </div>
      </div>
    </div>
  );
}
