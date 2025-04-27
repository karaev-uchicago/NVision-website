"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedCursor() {
  const innerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursorInner = innerRef.current
    const cursorOuter = outerRef.current

    if (!cursorInner || !cursorOuter) return

    let mouseX = 0,
      mouseY = 0
    let outlineX = 0,
      outlineY = 0

    const animate = () => {
      const dampening = 0.2
      const dx = mouseX - outlineX
      const dy = mouseY - outlineY

      outlineX += dx * dampening
      outlineY += dy * dampening

      if (cursorInner) {
        cursorInner.style.left = `${mouseX}px`
        cursorInner.style.top = `${mouseY}px`
      }

      if (cursorOuter) {
        cursorOuter.style.left = `${outlineX}px`
        cursorOuter.style.top = `${outlineY}px`
      }

      requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseEnter = () => {
      if (cursorInner) cursorInner.style.opacity = "1"
      if (cursorOuter) cursorOuter.style.opacity = "0.2"
    }

    const onMouseLeave = () => {
      if (cursorInner) cursorInner.style.opacity = "0"
      if (cursorOuter) cursorOuter.style.opacity = "0"
    }

    // Add hover effect to interactive elements
    const addHoverToElements = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, .hover-trigger, h1, h2, h3, h4, h5, h6',
      )

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (cursorInner) cursorInner.style.transform = "translate(-50%, -50%) scale(1.5)"
          if (cursorOuter) {
            cursorOuter.style.transform = "translate(-50%, -50%) scale(1.8)"
            cursorOuter.style.opacity = "0.4"
          }
        })

        el.addEventListener("mouseleave", () => {
          if (cursorInner) cursorInner.style.transform = "translate(-50%, -50%) scale(1)"
          if (cursorOuter) {
            cursorOuter.style.transform = "translate(-50%, -50%) scale(1)"
            cursorOuter.style.opacity = "0.2"
          }
        })
      })
    }

    // Start animation loop
    animate()

    // Add event listeners
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseleave", onMouseLeave)

    // Add hover effects
    addHoverToElements()

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    <>
      <div ref={innerRef} className="cursor-inner"></div>
      <div ref={outerRef} className="cursor-outer"></div>
    </>
  )
}

export default function CursorWrapper() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      const mobileCheck = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
        (isTouchDevice && window.matchMedia('(pointer:coarse)').matches)
      
      setIsMobile(mobileCheck)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return !isMobile ? <AnimatedCursor /> : null
}
