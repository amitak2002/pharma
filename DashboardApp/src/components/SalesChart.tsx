import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Sale {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
}

interface SalesChartProps {
  sales: Sale[];
  chartData?: {
    allTimeTotal: number;
    categoryBreakdown: { category: string; totalAmount: number }[];
  };
}

export const SalesChart: React.FC<SalesChartProps> = ({ sales, chartData }) => {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group sales by day of month (1 to 30) for June 2026 (current) and May 2026 (prev)
  const currentMonthSales = Array(30).fill(0);
  const prevMonthSales = Array(30).fill(0);

  sales.forEach(sale => {
    const saleDate = new Date(sale.date);
    const day = saleDate.getDate(); // 1 - 31
    const month = saleDate.getMonth(); // 0 - 11

    if (month === 5) { // June (current month)
      if (day <= 30) {
        currentMonthSales[day - 1] += sale.totalAmount;
      }
    } else if (month === 4) { // May (prev month)
      if (day <= 30) {
        prevMonthSales[day - 1] += sale.totalAmount;
      }
    }
  });

  // SVG dimensions
  const width = 650;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value to scale Y axis
  const maxVal = Math.max(...currentMonthSales, ...prevMonthSales, 1000); // at least 1000 baseline
  const maxValRounded = Math.ceil(maxVal / 10000) * 10000; // round up for labels

  // Convert (day, value) to SVG coordinate points
  const getCoordinates = (dayIndex: number, value: number) => {
    const x = paddingLeft + (dayIndex / 29) * chartWidth;
    const y = height - paddingBottom - (value / maxValRounded) * chartHeight;
    return { x, y };
  };

  // Generate path strings
  let currentPath = '';
  let currentAreaPath = '';
  let prevPath = '';

  for (let i = 0; i < 30; i++) {
    const ptCurr = getCoordinates(i, currentMonthSales[i]);
    const ptPrev = getCoordinates(i, prevMonthSales[i]);

    if (i === 0) {
      currentPath = `M ${ptCurr.x} ${ptCurr.y}`;
      currentAreaPath = `M ${ptCurr.x} ${height - paddingBottom} L ${ptCurr.x} ${ptCurr.y}`;
      prevPath = `M ${ptPrev.x} ${ptPrev.y}`;
    } else {
      currentPath += ` L ${ptCurr.x} ${ptCurr.y}`;
      currentAreaPath += ` L ${ptCurr.x} ${ptCurr.y}`;
      prevPath += ` L ${ptPrev.x} ${ptPrev.y}`;
    }

    if (i === 29) {
      currentAreaPath += ` L ${ptCurr.x} ${height - paddingBottom} Z`;
    }
  }

  // Aggregate Category Data
  const categories = [
    { key: 'categoryAntibiotics', name: 'Antibiotics', color: '#10b981' },
    { key: 'categoryPainkillers', name: 'Painkillers', color: '#3b82f6' },
    { key: 'categoryVitamins', name: 'Vitamins', color: '#f59e0b' },
    { key: 'categoryDevices', name: 'Medical Devices', color: '#8b5cf6' },
    { key: 'categoryOther', name: 'Other OTC', color: '#ec4899' }
  ];

  const categoryTotals: Record<string, number> = {
    'Antibiotics': 0,
    'Painkillers': 0,
    'Vitamins': 0,
    'Medical Devices': 0,
    'Other OTC': 0
  };

  let totalSalesSum = chartData?.allTimeTotal || 0;

  if (chartData?.categoryBreakdown) {
    chartData.categoryBreakdown.forEach(item => {
      // Map empty or missing categories to 'Other OTC' if necessary
      const cat = item.category || 'Other OTC';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += item.totalAmount;
      } else {
        categoryTotals['Other OTC'] += item.totalAmount;
      }
    });
  }

  // Calculate angles for Donut Chart (Radius R=50, Circumference C=314.16)
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const donutSlices = categories.map(cat => {
    const rawVal = categoryTotals[cat.name] || 0;
    const percent = totalSalesSum > 0 ? rawVal / totalSalesSum : 0;
    const strokeDasharray = `${(percent * circ).toFixed(2)} ${(circ - percent * circ).toFixed(2)}`;
    const strokeDashoffset = `${(-accumulatedPercent * circ).toFixed(2)}`;
    accumulatedPercent += percent;

    return {
      ...cat,
      value: rawVal,
      percent,
      strokeDasharray,
      strokeDashoffset
    };
  });

  // Dynamic values for hovered tooltip
  const getHoverTooltipContent = () => {
    if (hoveredIndex === null) return null;
    const day = hoveredIndex + 1;
    const currVal = currentMonthSales[hoveredIndex];
    const prevVal = prevMonthSales[hoveredIndex];
    return (
      <div className="chart-tooltip">
        <div className="tooltip-title">Date: June {day}, 2026</div>
        <div className="tooltip-row">
          <span className="tooltip-marker curr"></span>
          <span>{t('chartCurrentMonth')}: ₹{currVal.toLocaleString('en-IN')}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-marker prev"></span>
          <span>{t('chartLastMonth')}: ₹{prevVal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - svgRect.left;
    
    // Reverse-calculate day index from X position
    const relativeX = xPos - paddingLeft;
    if (relativeX < 0 || relativeX > chartWidth) {
      setHoveredIndex(null);
      return;
    }

    const index = Math.round((relativeX / chartWidth) * 29);
    if (index >= 0 && index < 30) {
      setHoveredIndex(index);
    }
  };

  return (
    <div className="dashboard-charts-grid">
      {/* Sales Trend Line/Area Chart */}
      <div className="card chart-card flex-grow-2">
        <h3 className="chart-title">{t('chartSalesTrend')}</h3>
        <div className="chart-container" style={{ position: 'relative' }}>
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="sales-svg-chart"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0"/>
              </linearGradient>
            </defs>

            {/* Grid Lines & Y Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = paddingTop + ratio * chartHeight;
              const val = maxValRounded * (1 - ratio);
              return (
                <g key={index}>
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    className="grid-line" 
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={y + 4} 
                    textAnchor="end" 
                    className="chart-label"
                  >
                    ₹{val >= 1000 ? `${val / 1000}k` : val}
                  </text>
                </g>
              );
            })}

            {/* X Labels (Days 1, 5, 10, 15, 20, 25, 30) */}
            {[1, 5, 10, 15, 20, 25, 30].map((day) => {
              const pt = getCoordinates(day - 1, 0);
              return (
                <text 
                  key={day} 
                  x={pt.x} 
                  y={height - 10} 
                  textAnchor="middle" 
                  className="chart-label"
                >
                  {day}
                </text>
              );
            })}

            {/* Previous Month Line (Dotted Gray) */}
            <path 
              d={prevPath} 
              fill="none" 
              stroke="var(--text-muted)" 
              strokeWidth="2" 
              strokeDasharray="4 4" 
              className="chart-line-prev"
            />

            {/* Current Month Area Fill */}
            <path 
              d={currentAreaPath} 
              fill="url(#currentGradient)" 
            />

            {/* Current Month Line (Thick Accent) */}
            <path 
              d={currentPath} 
              fill="none" 
              stroke="var(--accent)" 
              strokeWidth="3.5" 
              className="chart-line-curr"
            />

            {/* Hover Tooltip Vertical Line and Circle Dot */}
            {hoveredIndex !== null && (
              <g>
                <line 
                  x1={getCoordinates(hoveredIndex, 0).x} 
                  y1={paddingTop} 
                  x2={getCoordinates(hoveredIndex, 0).x} 
                  y2={height - paddingBottom} 
                  stroke="var(--border-hover)" 
                  strokeWidth="1.5" 
                />
                <circle 
                  cx={getCoordinates(hoveredIndex, currentMonthSales[hoveredIndex]).x} 
                  cy={getCoordinates(hoveredIndex, currentMonthSales[hoveredIndex]).y} 
                  r="6" 
                  fill="var(--accent)" 
                  stroke="var(--bg-secondary)" 
                  strokeWidth="2"
                />
                <circle 
                  cx={getCoordinates(hoveredIndex, prevMonthSales[hoveredIndex]).x} 
                  cy={getCoordinates(hoveredIndex, prevMonthSales[hoveredIndex]).y} 
                  r="5" 
                  fill="var(--text-muted)" 
                  stroke="var(--bg-secondary)" 
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
          
          {/* Legend absolute badges */}
          <div className="chart-legend-overlay">
            <div className="legend-badge-item">
              <span className="legend-dot curr"></span>
              <span>{t('chartCurrentMonth')}</span>
            </div>
            <div className="legend-badge-item">
              <span className="legend-dot prev"></span>
              <span>{t('chartLastMonth')}</span>
            </div>
          </div>

          {/* HTML Tooltip Box */}
          {getHoverTooltipContent()}
        </div>
      </div>

      {/* Category Donut Chart */}
      <div className="card chart-card">
        <h3 className="chart-title">{t('chartCategoryTitle')}</h3>
        <div className="donut-wrapper">
          <div className="donut-svg-container">
            <svg viewBox="0 0 120 120" className="donut-svg">
              {/* Background Circle */}
              <circle 
                cx="60" 
                cy="60" 
                r={radius} 
                fill="none" 
                stroke="var(--border)" 
                strokeWidth="12" 
              />
              
              {/* Category Segment Circles */}
              {donutSlices.map((slice, i) => (
                <circle
                  key={i}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="12"
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                  className="donut-segment"
                />
              ))}

              {/* Central text for aggregate */}
              <g className="donut-center-text">
                <text x="60" y="58" textAnchor="middle" className="donut-center-val">
                  {totalSalesSum >= 100000 
                    ? `₹${(totalSalesSum / 1000).toFixed(0)}k` 
                    : `₹${totalSalesSum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                </text>
                <text x="60" y="74" textAnchor="middle" className="donut-center-lbl">
                  Total (All-time)
                </text>
              </g>
            </svg>
          </div>

          {/* Legend Table */}
          <div className="donut-legend-grid">
            {donutSlices.map((slice, i) => (
              <div key={i} className="donut-legend-item">
                <div className="donut-legend-color" style={{ backgroundColor: slice.color }}></div>
                <div className="donut-legend-info">
                  <div className="donut-legend-name">{t(slice.key) || slice.name}</div>
                  <div className="donut-legend-meta">
                    <span className="donut-legend-val">₹{slice.value >= 1000 ? `${(slice.value / 1000).toFixed(1)}k` : slice.value}</span>
                    <span className="donut-legend-pct" style={{ color: slice.color }}>
                      {slice.percent > 0 ? `${(slice.percent * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .chart-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sales-svg-chart {
          width: 100%;
          height: auto;
          display: block;
        }

        .grid-line {
          stroke: var(--border);
          stroke-width: 1;
        }

        .chart-label {
          fill: var(--text-muted);
          font-size: 10px;
          font-weight: 600;
        }

        .chart-line-curr {
          filter: drop-shadow(0 4px 6px var(--accent-glow));
        }

        .chart-legend-overlay {
          position: absolute;
          top: 10px;
          right: 16px;
          display: flex;
          gap: 16px;
          font-size: 11px;
          font-weight: 700;
        }

        .legend-badge-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.curr {
          background-color: var(--accent);
          box-shadow: 0 0 6px var(--accent);
        }

        .legend-dot.prev {
          background-color: var(--text-muted);
          border: 1px dashed var(--text-primary);
        }

        /* Tooltip Styles */
        .chart-tooltip {
          position: absolute;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: var(--shadow-md);
          pointer-events: none;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          top: 30px;
          left: 60px;
          z-index: 10;
        }

        .tooltip-title {
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .tooltip-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .tooltip-marker {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .tooltip-marker.curr { background-color: var(--accent); }
        .tooltip-marker.prev { background-color: var(--text-muted); }

        /* Donut Styles */
        .donut-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: center;
        }

        .donut-svg-container {
          width: 130px;
          height: 130px;
          flex-shrink: 0;
        }

        .donut-svg {
          width: 100%;
          height: 100%;
        }

        .donut-segment {
          transform-origin: center;
          transition: stroke-dashoffset 0.5s ease-in-out;
        }

        .donut-center-text {
          fill: var(--text-primary);
        }

        .donut-center-val {
          font-size: 15px;
          font-weight: 800;
          fill: var(--text-primary);
        }

        .donut-center-lbl {
          font-size: 10px;
          font-weight: 600;
          fill: var(--text-muted);
          text-transform: uppercase;
        }

        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .donut-legend-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .legend-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .donut-legend-info {
          display: flex;
          flex-direction: column;
        }

        .legend-cat-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .legend-cat-pct {
          font-size: 11px;
          color: var(--text-secondary);
        }

        @media (max-width: 480px) {
          .donut-wrapper {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
