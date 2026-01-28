'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Info,
  Package,
  Target,
  ChevronRight,
} from 'lucide-react';
import { CARD_CURVATURE } from '../design-tokens';

export interface MetricCardProps {
  /** Icon type for the metric */
  icon: 'dollar' | 'package' | 'target' | 'trending-down';
  /** Title of the metric */
  title: string;
  /** Main value to display */
  value: string;
  /** Trend information */
  trend: {
    direction: 'up' | 'down';
    percentage: string;
    label: string;
  };
  /** Comparison data (Pre-Nuel vs Post-Nuel) */
  comparison: {
    preNuel: string;
    postNuel: string;
  };
  /** Additional className */
  className?: string;
}

/**
 * MetricCard Component
 * Displays KPI metrics
 *
 * Specifications from Figma:
 * - Border Radius: 16px (CARD_CURVATURE token)
 * - Padding: 16px (all sides)
 * - Background: #ffffff
 * - Height: 170px
 * - Width: 100% (responsive in flex container)
 * - Gap between cards: 12px
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      icon,
      title,
      value,
      trend,
      comparison,
      className,
    },
    ref
  ) => {
    // Icon mapping
    const getIcon = () => {
      const iconProps = { size: 14, strokeWidth: 1.5 };
      switch (icon) {
        case 'dollar':
          return <DollarSign {...iconProps} />;
        case 'package':
          return <Package {...iconProps} />;
        case 'target':
          return <Target {...iconProps} />;
        case 'trending-down':
          return <TrendingDown {...iconProps} />;
        default:
          return <DollarSign {...iconProps} />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white flex flex-col gap-[12px] p-[16px] h-[170px] w-full',
          `rounded-[${CARD_CURVATURE}]`,
          className
        )}
      >
        {/* Header Section */}
        <div className="flex gap-[8px] items-center w-full">
          {/* Rounded Icon */}
          <div className="bg-[#EAF1FF] rounded-full p-[4px] flex items-center justify-center shrink-0">
            <div className="text-[#17263D] w-[14px] h-[14px]">
              {getIcon()}
            </div>
          </div>

          {/* Title Wrapper */}
          <div className="flex flex-1 gap-[4px] items-center min-w-0">
            <p className="font-['DM_Sans'] font-medium text-[14px] leading-[22px] text-[#17263D] truncate">
              {title}
            </p>
            <Info size={12} className="text-[#7F8FA4] shrink-0" strokeWidth={1.5} />
          </div>
        </div>

        {/* Value Section */}
        <div className="flex flex-col gap-[2px] w-full">
          {/* Main Value */}
          <p className="font-['DM_Sans'] font-bold text-[18px] leading-[26px] text-[#1C58F7]">
            {value}
          </p>

          {/* Insight Row */}
          <div className="flex items-center w-full">
            {/* Value Tag */}
            <div className="flex gap-[4px] items-center pr-[4px]">
              {trend.direction === 'up' ? (
                <TrendingUp size={10} className="text-[#34C759]" strokeWidth={1.5} />
              ) : (
                <TrendingDown size={10} className="text-[#FF3B30]" strokeWidth={1.5} />
              )}
              <p
                className={cn(
                  "font-['DM_Sans'] font-normal text-[10px] leading-[16px] uppercase",
                  trend.direction === 'up' ? 'text-[#34C759]' : 'text-[#FF3B30]'
                )}
              >
                {trend.percentage}
              </p>
            </div>

            {/* Label */}
            <p className="font-['DM_Sans'] font-normal text-[10px] leading-[16px] text-[#7F8FA4] uppercase">
              {trend.label}
            </p>
          </div>
        </div>

        {/* Comparison Section (Pre-Nuel vs Post-Nuel) */}
        <div className="border-t-[0.5px] border-[#D9E0E9] pt-[8px] flex gap-[8px] items-center w-full">
          {/* Pre-Nuel */}
          <div className="flex-1 flex flex-col min-w-0">
            <p className="font-['DM_Sans'] font-medium text-[12px] leading-[20px] text-[#7F8FA4]">
              Pre-Nuel
            </p>
            <p className="font-['DM_Sans'] font-normal text-[12px] leading-[20px] text-[#7F8FA4] truncate">
              {comparison.preNuel}
            </p>
          </div>

          {/* Caret Icon */}
          <ChevronRight size={14} className="text-[#7F8FA4] shrink-0" strokeWidth={1.5} />

          {/* Post-Nuel */}
          <div className="flex-1 flex flex-col items-end min-w-0">
            <p className="font-['DM_Sans'] font-medium text-[12px] leading-[20px] text-[#17263D] text-right">
              Post-Nuel
            </p>
            <p className="font-['DM_Sans'] font-normal text-[12px] leading-[20px] text-[#17263D] text-right truncate">
              {comparison.postNuel}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

MetricCard.displayName = 'MetricCard';
