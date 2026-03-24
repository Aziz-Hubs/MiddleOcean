"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, easeOut } from "framer-motion"
import { cn } from "@/lib/utils"
import { animate } from "framer-motion"

export interface ThreeDImageRingProps {
  /** Array of image URLs to display in the ring */
  images: string[]
  /** Container height in pixels */
  height?: number
  /** 3D perspective value */
  perspective?: number
  /** Distance of images from center (z-depth / ring radius) */
  imageDistance?: number
  /** Initial rotation of the ring in degrees */
  initialRotation?: number
  /** Animation duration for entrance in seconds */
  animationDuration?: number
  /** Stagger delay between image entrance animations */
  staggerDelay?: number
  /** Opacity for non-hovered images during hover */
  hoverOpacity?: number
  /** Custom container className */
  containerClassName?: string
  /** Custom ring className */
  ringClassName?: string
  /** Custom image className */
  imageClassName?: string
  /** Background color of the container */
  backgroundColor?: string
  /** Enable/disable drag-to-rotate functionality */
  draggable?: boolean
  /** Breakpoint for mobile responsiveness */
  mobileBreakpoint?: number
  /** Scale factor for mobile (e.g., 0.7 for 70% size) */
  mobileScaleFactor?: number
  /** Power for the drag end inertia animation */
  inertiaPower?: number
  /** Time constant for the drag end inertia in ms */
  inertiaTimeConstant?: number
  /** Multiplier for initial velocity when drag ends */
  inertiaVelocityMultiplier?: number
  /** Enable parallax background position effect on images */
  parallax?: boolean
  /** Width of each image card in pixels */
  imageWidth?: number
  /** Height of each image card in pixels */
  imageHeight?: number
  /** Whether to auto-rotate the ring */
  autoRotate?: boolean
  /** Auto-rotation speed in degrees per second */
  autoRotateSpeed?: number
}

export function ThreeDImageRing({
  images,
  height = 500,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 180,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  hoverOpacity = 0.5,
  containerClassName,
  ringClassName,
  imageClassName,
  backgroundColor,
  draggable = true,
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.7,
  inertiaPower = 0.8,
  inertiaTimeConstant = 300,
  inertiaVelocityMultiplier = 20,
  parallax = true,
  imageWidth = 200,
  imageHeight = 130,
  autoRotate = true,
  autoRotateSpeed = 8,
}: ThreeDImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const rotationY = useMotionValue(initialRotation)
  const startXRef = useRef<number>(0)
  const currentRotRef = useRef<number>(initialRotation)
  const isDraggingRef = useRef<boolean>(false)
  const velocityRef = useRef<number>(0)
  const autoRotateRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const lastTimeRef = useRef<number>(0)

  const isInertiaAnimatingRef = useRef<boolean>(false)

  const [currentScale, setCurrentScale] = useState(1)
  const [showImages, setShowImages] = useState(false)

  const angle = useMemo(() => 360 / images.length, [images.length])

  // Parallax background position calculation
  const getBgPos = useCallback(
    (imageIndex: number, currentRot: number, scale: number) => {
      const scaledDistance = imageDistance * scale
      const effectiveRotation = currentRot - 180 - imageIndex * angle
      const parallaxOffset = (((effectiveRotation % 360) + 360) % 360) / 360
      return `${-(parallaxOffset * (scaledDistance / 1.5))}px 0px`
    },
    [imageDistance, angle]
  )

  // Sync background positions when rotation changes (only when parallax enabled)
  useEffect(() => {
    if (!parallax) return
    const unsubscribe = rotationY.on("change", (latestRotation) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((child, i) => {
          ;(child as HTMLElement).style.backgroundPosition = getBgPos(
            i,
            latestRotation,
            currentScale
          )
        })
      }
      currentRotRef.current = latestRotation
    })
    return () => unsubscribe()
  }, [rotationY, currentScale, getBgPos, parallax])

  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth
      setCurrentScale(vw <= mobileBreakpoint ? mobileScaleFactor : 1)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileBreakpoint, mobileScaleFactor])

  // Auto-rotation loop (always running if autoRotate is true)
  useEffect(() => {
    if (!autoRotate) return

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const delta = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      // Skip updates if user is interacting
      if (!isDraggingRef.current && !isInertiaAnimatingRef.current) {
        const newRot = rotationY.get() + autoRotateSpeed * delta
        rotationY.set(newRot)
        currentRotRef.current = newRot
      }

      autoRotateRef.current = requestAnimationFrame(tick)
    }

    autoRotateRef.current = requestAnimationFrame(tick)

    return () => {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current)
        autoRotateRef.current = null
      }
      lastTimeRef.current = 0
    }
  }, [autoRotate, autoRotateSpeed, rotationY])

  // Show images on mount
  useEffect(() => {
    setShowImages(true)
  }, [])

  // --- Drag handlers ---

  const handleDragMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!draggable || !isDraggingRef.current) return
      
      const clientX =
        "touches" in event
          ? (event as TouchEvent).touches[0].clientX
          : (event as MouseEvent).clientX
          
      const deltaX = clientX - startXRef.current
      startXRef.current = clientX
      
      // Update rotation based on movement
      const sensitivity = 0.5
      const newRotation = rotationY.get() - deltaX * sensitivity
      rotationY.set(newRotation)
      
      // Update velocity for inertia (per frame)
      velocityRef.current = -deltaX * sensitivity
    },
    [draggable, rotationY]
  )

  const handleDragEnd = useCallback(
    function onDragEnd() {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      
      if (ringRef.current) {
        ringRef.current.style.cursor = "grab"
        currentRotRef.current = rotationY.get()
      }

      document.removeEventListener("mousemove", handleDragMove)
      document.removeEventListener("mouseup", onDragEnd)
      document.removeEventListener("touchmove", handleDragMove)
      document.removeEventListener("touchend", onDragEnd)

      // Apply inertia based on the last recorded velocity
      const velocity = velocityRef.current * inertiaVelocityMultiplier
      
      isInertiaAnimatingRef.current = true
      animate(rotationY, rotationY.get() + velocity, {
        type: "inertia",
        velocity: velocity,
        power: inertiaPower,
        timeConstant: inertiaTimeConstant,
        restDelta: 0.1,
        onUpdate: (latest) => {
          currentRotRef.current = latest
        },
        onComplete: () => {
          isInertiaAnimatingRef.current = false
          lastTimeRef.current = performance.now() // Smooth handoff back to auto-rotation
        },
        onStop: () => {
          isInertiaAnimatingRef.current = false
        }
      })

      velocityRef.current = 0
    },
    [
      rotationY,
      handleDragMove,
      inertiaVelocityMultiplier,
      inertiaPower,
      inertiaTimeConstant,
    ]
  )

  const handleDragStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!draggable) return
      isDraggingRef.current = true

      // Stop any existing animations
      rotationY.stop()
      isInertiaAnimatingRef.current = false
      
      lastTimeRef.current = 0

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX
      startXRef.current = clientX
      velocityRef.current = 0

      if (ringRef.current) {
        ringRef.current.style.cursor = "grabbing"
      }

      document.addEventListener("mousemove", handleDragMove)
      document.addEventListener("mouseup", handleDragEnd)
      document.addEventListener("touchmove", handleDragMove)
      document.addEventListener("touchend", handleDragEnd)
    },
    [draggable, rotationY, handleDragMove, handleDragEnd]
  )

  // Entrance animation variants
  const imageVariants = {
    hidden: { y: 200, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const scaledDistance = imageDistance * currentScale

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden select-none",
        containerClassName
      )}
      style={{
        height: `${height * currentScale}px`,
        backgroundColor,
      }}
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <motion.div
          ref={ringRef}
          className={cn("absolute inset-0", ringClassName)}
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotationY,
            cursor: draggable ? "grab" : "default",
          }}
        >
          <AnimatePresence>
            {showImages &&
              images.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "absolute overflow-hidden",
                    imageClassName
                  )}
                  style={{
                    transformStyle: "preserve-3d",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backfaceVisibility: "hidden",
                    width: `${imageWidth * currentScale}px`,
                    height: `${imageHeight * currentScale}px`,
                    rotateY: index * -angle,
                    translateZ: -scaledDistance,
                    transformOrigin: `50% 50% ${scaledDistance}px`,
                    backgroundPosition: parallax
                      ? getBgPos(
                          index,
                          currentRotRef.current,
                          currentScale
                        )
                      : "center",
                    left: "50%",
                    top: "50%",
                    marginLeft: `-${(imageWidth * currentScale) / 2}px`,
                    marginTop: `-${(imageHeight * currentScale) / 2}px`,
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={imageVariants}
                  custom={index}
                  transition={{
                    delay: index * staggerDelay,
                    duration: animationDuration,
                    ease: easeOut,
                  }}
                  whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
                  onHoverStart={() => {
                    if (isDraggingRef.current) return
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach(
                        (el, i) => {
                          if (i !== index) {
                            ;(el as HTMLElement).style.opacity = `${hoverOpacity}`
                          }
                        }
                      )
                    }
                  }}
                  onHoverEnd={() => {
                    if (isDraggingRef.current) return
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((el) => {
                        ;(el as HTMLElement).style.opacity = "1"
                      })
                    }
                  }}
                />
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default ThreeDImageRing
