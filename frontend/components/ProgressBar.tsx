'use client';

import { useState, useEffect } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  size = 'md',
  animated = false,
  striped = false
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-tech-teal';
      case 'secondary':
        return 'bg-gray-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'gold':
        return 'bg-african-gold';
      default:
        return 'bg-tech-teal';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showValue && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}

      <div className={`relative w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`h-full ${getColorClasses()} rounded-full transition-all duration-500 ease-out ${
            striped ? 'bg-stripes' : ''
          } ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${displayValue}%` }}
        >
          {striped && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide"></div>
          )}
        </div>
      </div>

      {showValue && !label && (
        <div className="mt-1 text-center">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {Math.round(displayValue)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Componentes especializados
export function CourseProgress({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <ProgressBar
      value={value}
      max={max}
      color="gold"
      size="md"
      animated
      striped
    />
  );
}

export function LessonProgress({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <ProgressBar
      value={value}
      max={max}
      color="primary"
      size="sm"
      animated
    />
  );
}

export function StatsProgress({ 
  value, 
  max = 100, 
  label 
}: { 
  value: number; 
  max?: number; 
  label: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex items-center space-x-2">
        <ProgressBar
          value={value}
          max={max}
          showValue={false}
          size="sm"
          color="success"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">
          {Math.round((value / max) * 100)}%
        </span>
      </div>
    </div>
  );
}
