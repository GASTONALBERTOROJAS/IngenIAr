'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const variants = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  const getAutoVariant = () => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'default';
  };

  const finalVariant = variant === 'default' ? getAutoVariant() : variant;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs text-text-muted">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs font-medium text-text-primary">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${variants[finalVariant]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}