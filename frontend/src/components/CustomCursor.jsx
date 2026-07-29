import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor({ theme = 'gold' }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef(null);

  const getThemeColors = () => {
    switch (theme) {
      case 'silver':
        return {
          dot: '#E5E4E2',
          glow: 'rgba(255, 255, 255, 0.75)'
        };
      case 'emerald':
        return {
          dot: '#2ECC71',
          glow: 'rgba(46, 204, 113, 0.75)'
        };
      case 'blue':
        return {
          dot: '#3B82F6',
          glow: 'rgba(59, 130, 246, 0.75)'
        };
      case 'gold':
      default:
        return {
          dot: '#D4AF37',
          glow: 'rgba(212, 175, 55, 0.75)'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    // Detect mobile
    const checkDevice = () => {
      const mobile = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.matchMedia('(max-width: 768px)').matches ||
        ('ontouchstart' in window);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    // Enable custom cursor active style (hides standard cursor)
    document.body.classList.add('custom-cursor-active');

    const onMouseMove = (e) => {
      setIsVisible(true);
      
      // Instantly position the point cursor at mouse coordinates (0 latency)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering interactive components to expand the point cursor
      const target = e.target;
      if (target) {
        const isClickable = 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.tagName === 'SELECT' || 
          target.closest('button') || 
          target.closest('a') || 
          target.classList.contains('cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer';
        
        setIsHovered(!!isClickable);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out will-change-transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        isHovered ? 'w-4 h-4' : 'w-2 h-2'
      }`}
      style={{
        backgroundColor: colors.dot,
        boxShadow: `0 0 ${isHovered ? '20px 8px' : '10px 3px'} ${colors.glow}`,
        transitionProperty: 'width, height, background-color, box-shadow'
      }}
    />
  );
}
