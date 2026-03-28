"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquareText, X, CheckCircle2, AlertCircle, Loader2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface QuoteRequestDialogProps {
  productId: string
  productName: string
  productNameAr: string
  productSlug: string
  category: string
  categoryAr: string
  locale: string
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  phone: string
  email: string
  quantity: number
}

interface FormErrors {
  fullName?: string
  phone?: string
  email?: string
  quantity?: string
}

// Sonar/Ping Effect Component
function SonarEffect({ status }: { status: "idle" | "success" | "error" | "loading" }) {
  if (status === "idle") return null
  
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    loading: "bg-blue-500"
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${colors[status]} rounded-full opacity-30`}
        initial={{ width: 0, height: 0 }}
        animate={{ 
          width: [0, 400, 600], 
          height: [0, 400, 600],
          opacity: [0.5, 0.2, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeOut" 
        }}
        style={{ zIndex: -1 }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${colors[status]} rounded-full opacity-20`}
        initial={{ width: 0, height: 0 }}
        animate={{ 
          width: [0, 300, 500], 
          height: [0, 300, 500],
          opacity: [0.4, 0.15, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.3
        }}
        style={{ zIndex: -1 }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${colors[status]} rounded-full opacity-10`}
        initial={{ width: 0, height: 0 }}
        animate={{ 
          width: [0, 200, 400], 
          height: [0, 200, 400],
          opacity: [0.3, 0.1, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.6
        }}
        style={{ zIndex: -1 }}
      />
    </div>
  )
}

export function QuoteRequestDialog({
  productId,
  productName,
  productNameAr,
  productSlug,
  category,
  categoryAr,
  locale,
  isOpen,
  onClose,
}: QuoteRequestDialogProps) {
  const t = useTranslations("QuoteRequest")
  const isRtl = locale === "ar"
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    quantity: 1,
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: keyof FormData, value: string | number): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value || (typeof value === "string" && value.trim().length < 2)) {
          return t("errors.fullNameRequired")
        }
        if (typeof value === "string" && value.trim().length > 100) {
          return t("errors.fullNameTooLong")
        }
        break
      case "phone":
        if (!value || (typeof value === "string" && value.trim().length < 8)) {
          return t("errors.phoneRequired")
        }
        // Allow international formats with +, spaces, and common separators
        const phoneRegex = /^[+]?[\d\s\-\(\)]{8,20}$/
        if (typeof value === "string" && !phoneRegex.test(value.trim())) {
          return t("errors.phoneInvalid")
        }
        break
      case "email":
        if (typeof value === "string" && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value.trim())) {
            return t("errors.emailInvalid")
          }
          if (value.trim().length > 254) {
            return t("errors.emailTooLong")
          }
        }
        break
      case "quantity":
        const qty = typeof value === "string" ? parseInt(value) : value
        if (isNaN(qty) || qty < 1) {
          return t("errors.quantityMin")
        }
        if (qty > 999999) {
          return t("errors.quantityMax")
        }
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const fullNameError = validateField("fullName", formData.fullName)
    if (fullNameError) newErrors.fullName = fullNameError
    
    const phoneError = validateField("phone", formData.phone)
    if (phoneError) newErrors.phone = phoneError
    
    const emailError = validateField("email", formData.email)
    if (emailError) newErrors.email = emailError
    
    const quantityError = validateField("quantity", formData.quantity)
    if (quantityError) newErrors.quantity = quantityError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(999999, formData.quantity + delta))
    handleChange("quantity", newQuantity)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ fullName: true, phone: true, email: true, quantity: true })
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/request-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productId,
          productNameAr,
          productSlug,
          categoryAr,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form after success
        setTimeout(() => {
          setFormData({ fullName: "", phone: "", email: "", quantity: 1 })
          setTouched({})
          setSubmitStatus("idle")
          onClose()
        }, 3000)
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ fullName: "", phone: "", email: "", quantity: 1 })
      setErrors({})
      setTouched({})
      setSubmitStatus("idle")
      onClose()
    }
  }

  // Determine sonar status
  const sonarStatus = isSubmitting ? "loading" : submitStatus !== "idle" ? submitStatus : "idle"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-md md:max-w-lg bg-black border-white/10",
          isRtl && "font-arabic"
        )}
        showCloseButton={false}
      >
        {/* Sonar Effect */}
        <SonarEffect status={sonarStatus} />
        
        <DialogHeader className={cn("space-y-2", isRtl && "text-right")}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-white">
              <MessageSquareText className="size-5 text-primary" />
              {t("title")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full shrink-0 text-white hover:bg-white/10"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="size-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </div>
          <DialogDescription className={cn("text-xs text-muted-foreground", isRtl && "text-right")}>
            {t("subtitle", { productName })}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4 relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative"
              >
                <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500">
                  <CheckCircle2 className="size-8 text-green-500" />
                </div>
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{t("success.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("success.message")}</p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5 pt-2 relative"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs font-medium flex items-center gap-1 text-white">
                  {t("fields.fullName")}
                  <span className="text-destructive">*</span>
                </label>
                <motion.div
                  animate={errors.fullName && touched.fullName ? { x: [0, -5, 5, -5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t("placeholders.fullName")}
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={cn(
                      "h-10 transition-all duration-200 bg-white/5 border-white/10 text-white placeholder:text-white/40",
                      errors.fullName && touched.fullName && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                </motion.div>
                <AnimatePresence>
                  {errors.fullName && touched.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="size-3" />
                      {errors.fullName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-medium flex items-center gap-1 text-white">
                  {t("fields.phone")}
                  <span className="text-destructive">*</span>
                </label>
                <motion.div
                  animate={errors.phone && touched.phone ? { x: [0, -5, 5, -5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("placeholders.phone")}
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={cn(
                      "h-10 transition-all duration-200 bg-white/5 border-white/10 text-white placeholder:text-white/40",
                      errors.phone && touched.phone && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    disabled={isSubmitting}
                    dir="ltr"
                  />
                </motion.div>
                <AnimatePresence>
                  {errors.phone && touched.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="size-3" />
                      {errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium flex items-center gap-1 text-white">
                  {t("fields.email")}
                  <span className="text-muted-foreground text-[10px]">({t("optional")})</span>
                </label>
                <motion.div
                  animate={errors.email && touched.email ? { x: [0, -5, 5, -5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("placeholders.email")}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={cn(
                      "h-10 transition-all duration-200 bg-white/5 border-white/10 text-white placeholder:text-white/40",
                      errors.email && touched.email && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    disabled={isSubmitting}
                    dir="ltr"
                  />
                </motion.div>
                <AnimatePresence>
                  {errors.email && touched.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="size-3" />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Quantity Field */}
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-xs font-medium text-white">
                  {t("fields.quantity")}
                </label>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-full border-white/10 hover:bg-white/10"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={isSubmitting || formData.quantity <= 1}
                    >
                      <Minus className="size-4 text-white" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    key={formData.quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                  >
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={999999}
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                      onBlur={() => handleBlur("quantity")}
                      className={cn(
                        "h-10 w-24 text-center transition-all duration-200 bg-white/5 border-white/10 text-white",
                        errors.quantity && touched.quantity && "border-destructive focus-visible:ring-destructive/20"
                      )}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                  
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-full border-white/10 hover:bg-white/10"
                      onClick={() => handleQuantityChange(1)}
                      disabled={isSubmitting || formData.quantity >= 999999}
                    >
                      <Plus className="size-4 text-white" />
                    </Button>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {errors.quantity && touched.quantity && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="size-3" />
                      {errors.quantity}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    {t("errors.submitFailed")}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.div
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="size-4 animate-spin" />
                        {t("submitting")}
                      </motion.div>
                    ) : (
                      t("submit")
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Privacy Note */}
              <p className={cn(
                "text-[10px] text-muted-foreground text-center",
                isRtl && "font-arabic"
              )}>
                {t("privacyNote")}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
