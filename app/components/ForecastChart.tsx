'use client';

import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { COLORS, SPACING, TYPOGRAPHY } from '../design-tokens';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ForecastChartProps {
  /** Additional className for custom styling */
  className?: string;
  /** Filters for data */
  filters?: {
    region: string;
    timeFrame: string;
    material: string;
  };
}

// Filter-based multiplier for realistic variations
const getFilterMultiplier = (filters?: { region: string; timeFrame: string; material: string }) => {
  if (!filters) return 1;

  let multiplier = 1;

  const regionMultipliers: Record<string, number> = {
    'All Regions': 1,
    'Southeast': 0.28,
    'Midwest': 0.22,
    'West Coast': 0.19,
    'Southwest': 0.15,
    'Northeast': 0.12,
    'Mountain': 0.04,
  };

  const materialMultipliers: Record<string, number> = {
    'All Materials': 1,
    'Raw Material A': 0.35,
    'Raw Material B': 0.18,
    'Component C': 0.12,
    'Component D': 0.15,
    'Additive E': 0.08,
    'Additive F': 0.12,
  };

  multiplier *= regionMultipliers[filters.region] || 1;
  multiplier *= materialMultipliers[filters.material] || 1;

  return multiplier;
};

interface ChartDataPoint {
  date: string;
  ordersShipped: number; // Light blue/gray - Past orders
  unshippedGap: number; // Dark blue/black - Gap distributed to future
  newOrders: number; // Bright blue - Future orders
  forecast: number; // Line forecast value
  isToday?: boolean; // Marker for today's date
}

// ============================================
// DATA - From Figma specifications
// ============================================

// Beverage industry shipment forecast data (tons/gallons in thousands)
const chartData: ChartDataPoint[] = [
  { date: '25 NOV', ordersShipped: 8450, unshippedGap: 420, newOrders: 0, forecast: 8680 },
  { date: '2 DEC', ordersShipped: 8820, unshippedGap: 380, newOrders: 0, forecast: 9050 },
  { date: '9 DEC', ordersShipped: 9150, unshippedGap: 290, newOrders: 0, forecast: 9320 },
  { date: '16 DEC', ordersShipped: 9480, unshippedGap: 450, newOrders: 0, forecast: 9750 },
  { date: '23 DEC', ordersShipped: 8920, unshippedGap: 380, newOrders: 0, forecast: 9180 },
  { date: '30 DEC', ordersShipped: 7850, unshippedGap: 320, newOrders: 0, forecast: 8050 },
  { date: '6 JAN', ordersShipped: 8250, unshippedGap: 410, newOrders: 0, forecast: 8520 },
  { date: '13 JAN', ordersShipped: 8680, unshippedGap: 350, newOrders: 0, forecast: 8920 },
  { date: '20 JAN', ordersShipped: 0, unshippedGap: 0, newOrders: 9120, forecast: 9350, isToday: true },
  { date: '27 JAN', ordersShipped: 0, unshippedGap: 0, newOrders: 9450, forecast: 9680 },
  { date: '3 FEB', ordersShipped: 0, unshippedGap: 0, newOrders: 9780, forecast: 9950 },
  { date: '10 FEB', ordersShipped: 0, unshippedGap: 0, newOrders: 10150, forecast: 10380 },
  { date: '17 FEB', ordersShipped: 0, unshippedGap: 0, newOrders: 10520, forecast: 10720 },
  { date: '24 FEB', ordersShipped: 0, unshippedGap: 0, newOrders: 10890, forecast: 11050 },
  { date: '3 MAR', ordersShipped: 0, unshippedGap: 0, newOrders: 11250, forecast: 11420 },
  { date: '10 MAR', ordersShipped: 0, unshippedGap: 0, newOrders: 11580, forecast: 11780 },
  { date: '17 MAR', ordersShipped: 0, unshippedGap: 0, newOrders: 11920, forecast: 12150 },
];

// ============================================
// CUSTOM TOOLTIP
// ============================================

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: COLORS.neutral[0],
          padding: SPACING[16],
          borderRadius: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          minWidth: '200px',
        }}
      >
        {/* Date */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.bodySmallMedium.fontFamily,
            fontSize: TYPOGRAPHY.bodySmallMedium.fontSize,
            lineHeight: TYPOGRAPHY.bodySmallMedium.lineHeight,
            fontWeight: 600,
            color: COLORS.text.primary,
            marginBottom: SPACING[12],
          }}
        >
          {data.date}
        </div>

        {/* Forecast Line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: SPACING[8],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[8] }}>
            <div
              style={{
                width: '14px',
                height: '2px',
                backgroundColor: '#17263D',
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.bodySmallMedium,
                fontWeight: 400,
                color: COLORS.text.secondary,
              }}
            >
              Forecast
            </span>
          </div>
          <span
            style={{
              ...TYPOGRAPHY.bodySmallMedium,
              fontWeight: 600,
              color: COLORS.text.primary,
            }}
          >
            {data.forecast.toLocaleString()}
          </span>
        </div>

        {/* Orders Shipped (if > 0) */}
        {data.ordersShipped > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: SPACING[8],
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[8] }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#9EADCC',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  ...TYPOGRAPHY.bodySmallMedium,
                  fontWeight: 400,
                  color: COLORS.text.secondary,
                }}
              >
                Orders Shipped
              </span>
            </div>
            <span
              style={{
                ...TYPOGRAPHY.bodySmallMedium,
                fontWeight: 600,
                color: COLORS.text.primary,
              }}
            >
              {data.ordersShipped.toLocaleString()}
            </span>
          </div>
        )}

        {/* Unshipped Gap (if > 0) */}
        {data.unshippedGap > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: SPACING[8],
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[8] }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#070D15',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  ...TYPOGRAPHY.bodySmallMedium,
                  fontWeight: 400,
                  color: COLORS.text.secondary,
                }}
              >
                Unshipped Gap
              </span>
            </div>
            <span
              style={{
                ...TYPOGRAPHY.bodySmallMedium,
                fontWeight: 600,
                color: COLORS.text.primary,
              }}
            >
              {data.unshippedGap.toLocaleString()}
            </span>
          </div>
        )}

        {/* New Orders (if > 0) */}
        {data.newOrders > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[8] }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#365EC8',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  ...TYPOGRAPHY.bodySmallMedium,
                  fontWeight: 400,
                  color: COLORS.text.secondary,
                }}
              >
                New Orders
              </span>
            </div>
            <span
              style={{
                ...TYPOGRAPHY.bodySmallMedium,
                fontWeight: 600,
                color: COLORS.text.primary,
              }}
            >
              {data.newOrders.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ============================================
// CUSTOM LEGEND
// ============================================

const CustomLegend = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: SPACING[24],
        marginTop: SPACING[16],
        paddingLeft: '68px', // Align with chart content
      }}
    >
      {/* Forecast */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: '2px solid #17263D',
            backgroundColor: 'transparent',
          }}
        />
        <span
          style={{
            ...TYPOGRAPHY.bodyExtraSmallText,
            color: COLORS.text.primary,
          }}
        >
          Forecast
        </span>
      </div>

      {/* Orders Shipped (Past) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#9EADCC',
            borderRadius: '2px',
          }}
        />
        <span
          style={{
            ...TYPOGRAPHY.bodyExtraSmallText,
            color: COLORS.text.primary,
          }}
        >
          Orders Shipped (Past)
        </span>
      </div>

      {/* Unshipped Gap */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#070D15',
            borderRadius: '2px',
          }}
        />
        <span
          style={{
            ...TYPOGRAPHY.bodyExtraSmallText,
            color: COLORS.text.primary,
          }}
        >
          Unshipped Gap (Distributed to Future)
        </span>
      </div>

      {/* New Orders to Ship (Future) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#365EC8',
            borderRadius: '2px',
          }}
        />
        <span
          style={{
            ...TYPOGRAPHY.bodyExtraSmallText,
            color: COLORS.text.primary,
          }}
        >
          New Orders to Ship (Future)
        </span>
      </div>
    </div>
  );
};

// ============================================
// CUSTOM X-AXIS TICK
// ============================================

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const isToday = chartData[payload.index]?.isToday;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        style={{
          fontFamily: TYPOGRAPHY.bodyExtraSmallText.fontFamily,
          fontSize: TYPOGRAPHY.bodyExtraSmallText.fontSize,
          fontWeight: TYPOGRAPHY.bodyExtraSmallText.fontWeight,
          fill: isToday ? '#365EC8' : '#99A5B8',
        }}
      >
        {payload.value}
      </text>
    </g>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * ForecastChart Component
 * Combined bar + line chart showing forecast vs actual orders
 * Exact specifications from Figma with stacked bars and forecast line
 */
export const ForecastChart = React.forwardRef<HTMLDivElement, ForecastChartProps>(
  ({ className, filters }, ref) => {
    // Apply filter multiplier to chart data
    const filteredChartData = useMemo(() => {
      const mult = getFilterMultiplier(filters);
      return chartData.map(point => ({
        ...point,
        ordersShipped: Math.round(point.ordersShipped * mult),
        unshippedGap: Math.round(point.unshippedGap * mult),
        newOrders: Math.round(point.newOrders * mult),
        forecast: Math.round(point.forecast * mult),
      }));
    }, [filters]);

    const todayIndex = filteredChartData.findIndex((d) => d.isToday);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: '100%',
          height: '380px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={0}
            barCategoryGap="20%"
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="0"
              stroke="#D9E0E9"
              vertical={false}
              horizontalPoints={[0, 76, 152, 228, 304]}
            />

            {/* X-Axis */}
            <XAxis
              dataKey="date"
              axisLine={{ stroke: '#D9E0E9', strokeWidth: 1 }}
              tickLine={false}
              tick={<CustomXAxisTick />}
              height={50}
            />

            {/* Y-Axis */}
            <YAxis
              domain={[0, 3400]}
              ticks={[0, 850, 1700, 2550, 3400]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: TYPOGRAPHY.bodySmallMedium.fontFamily,
                fontSize: 14,
                fontWeight: TYPOGRAPHY.bodySmallMedium.fontWeight,
                fill: '#99A5B8',
              }}
              width={68}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />

            {/* Legend */}
            <Legend content={<CustomLegend />} />

            {/* TODAY Reference Line */}
            {todayIndex >= 0 && (
              <ReferenceLine
                x={filteredChartData[todayIndex].date}
                stroke="#D345F8"
                strokeWidth={2}
                label={{
                  value: 'TODAY',
                  position: 'top',
                  fill: '#D345F8',
                  fontFamily: 'Inter',
                  fontSize: 10,
                  fontWeight: 700,
                  offset: 10,
                }}
              />
            )}

            {/* Stacked Bars - Orders Shipped (Past) - Bottom of stack, no rounding */}
            <Bar
              dataKey="ordersShipped"
              stackId="a"
              fill="#9EADCC"
              radius={[0, 0, 0, 0]}
              maxBarSize={16}
            />

            {/* Stacked Bars - Unshipped Gap - Top of past stack, rounded corners */}
            <Bar
              dataKey="unshippedGap"
              stackId="a"
              fill="#070D15"
              radius={[4, 4, 0, 0]}
              maxBarSize={16}
            />

            {/* Stacked Bars - New Orders (Future) - Standalone, rounded corners */}
            <Bar
              dataKey="newOrders"
              stackId="a"
              fill="#365EC8"
              radius={[4, 4, 0, 0]}
              maxBarSize={16}
            />

            {/* Forecast Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#17263D"
              strokeWidth={2}
              dot={{
                fill: '#17263D',
                strokeWidth: 2,
                r: 4,
                stroke: '#FFFFFF',
              }}
              activeDot={{
                r: 6,
                fill: '#17263D',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

ForecastChart.displayName = 'ForecastChart';
