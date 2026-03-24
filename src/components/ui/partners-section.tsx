"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { ThreeDImageRing } from "./three-d-image-ring"

// Text placeholder images for partner logos — replace with real logos later
const partnerImages = [
  "https://placehold.co/400x220/transparent/ffffff?text=OceanTeck&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=OceanJett&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=FLORA&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=HP&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Epson&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Roland&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Mimaki&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Canon&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Konica&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=3M&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Avery&font=montserrat",
  "https://placehold.co/400x220/transparent/ffffff?text=Oracal&font=montserrat",
]

export function PartnersSection() {
  const t = useTranslations("Index")

  return (
    <section className="relative w-full pt-2 pb-6 overflow-hidden">
      {/* Section heading */}
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tighter text-foreground uppercase md:text-5xl">
          {t("trusted-partners" as any) || "Strategic Partners"}
        </h2>
      </div>

      {/* Full-width 3D ring */}
      <div className="w-full -mt-4">
        <ThreeDImageRing
          images={partnerImages}
          height={200}
          imageDistance={600}
          perspective={1500}
          initialRotation={180}
          draggable={true}
          autoRotate={true}
          autoRotateSpeed={12}
          imageWidth={200}
          imageHeight={120}
          parallax={false}
          mobileScaleFactor={0.4}
          mobileBreakpoint={768}
          hoverOpacity={0.6}
          animationDuration={1}
          staggerDelay={0.06}
        />
      </div>
    </section>
  )
}

export default PartnersSection
