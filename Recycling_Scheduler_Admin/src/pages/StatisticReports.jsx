import React, { useEffect, useState, useRef } from 'react'
import NavigationWrapper from '../components/Navigation/NavigationWrapper';
import { getClients, getCollectionsByClientId } from '../api/dummyCalls';
import Spinner from '../components/Navigation/Spinner';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useReactToPrint } from 'react-to-print';

const StatisticReports = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  const reportRef = useRef(null);
  const handlePrintReport = useReactToPrint({
    content: () => reportRef.current,
    contentRef: reportRef,
    documentTitle: () => {
      const monthPart = selectedMonth !== '' ? `_${String(parseInt(selectedMonth) + 1).padStart(2, '0')}` : '';
      return `informe_residuos_${selectedYear}${monthPart}`;
    },
    pageStyle: `
    @page { size: A3 portrait; margin: 10mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #ffffff; }
    .report-scope * { page-break-inside: avoid; }
    .report-scope { transform: scale(0.92); transform-origin: top left; }
    @media screen {
      .report-scope { transform: none !important; }
    }
    .no-print { display: none !important; }
  `
  });

  // Dedicated print method for Exportar PDF button
  const printReport = () => {
    handlePrintReport();
  };

  // Dedicated print method: creates a perfectly formatted A3 print document
  const handleDedicatedPrint = () => {
    try {
      if (!selectedClient) {
        alert("Por favor seleccione un cliente primero.");
        return;
      }
  
      if (collections.length === 0) {
        alert("No hay datos de colección para este cliente.");
        return;
      }

        const monthPart = selectedMonth !== '' ? `_${String(parseInt(selectedMonth) + 1).padStart(2, '0')}` : '';
        const title = `informe_residuos_${selectedYear}${monthPart}`;
      const reportTitle = getReportHeaderTitle();
      const chartTitle = getChartTitle();

      // Build table HTML
      const buildTableHTML = () => {
        let tableRows = '';
        monthlyData.forEach((row) => {
          tableRows += `
            <tr>
              <td style="padding: 10px; border: 1px solid #000; font-weight: 600;">${row.month}</td>
              <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.plasticos.cell};">
                ${row.plasticos > 0 ? Math.round(row.plasticos).toLocaleString() : 'SD'}
              </td>
              <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.papel_carton.cell};">
                ${row.papel_carton > 0 ? Math.round(row.papel_carton).toLocaleString() : 'SD'}
              </td>
              <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.organico.cell};">
                ${row.organico > 0 ? Math.round(row.organico).toLocaleString() : 'SD'}
              </td>
              <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.otros.cell};">
                ${row.otros > 0 ? Math.round(row.otros).toLocaleString() : 'SD'}
              </td>
              <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.descarte.cell};">
                ${row.descarte > 0 ? Math.round(row.descarte).toLocaleString() : 'SD'}
              </td>
            </tr>`;
        });

        // Totals row
        tableRows += `
          <tr style="background-color: #e5e7eb; font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #000;">TOTAL ${selectedYear}</td>
            <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.plasticos.cell};">
              ${totals.plasticos > 0 ? Math.round(totals.plasticos).toLocaleString() : 'SD'}
            </td>
            <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.papel_carton.cell};">
              ${totals.papel_carton > 0 ? Math.round(totals.papel_carton).toLocaleString() : 'SD'}
            </td>
            <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.organico.cell};">
              ${totals.organico > 0 ? Math.round(totals.organico).toLocaleString() : 'SD'}
            </td>
            <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.otros.cell};">
              ${totals.otros > 0 ? Math.round(totals.otros).toLocaleString() : 'SD'}
            </td>
            <td style="padding: 10px; border: 1px solid #000; text-align: center; background-color: ${MATERIAL_PALETTE.descarte.cell};">
              ${totals.descarte > 0 ? Math.round(totals.descarte).toLocaleString() : 'SD'}
            </td>
          </tr>`;

        return `
          <div style="margin-top: 20px; page-break-inside: avoid; padding-bottom: 50px; border-bottom: 2px solid rgba(0,0,0,0.3);">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background-color: #d1d5db; color: #000;">
                  <th style="padding: 12px; border: 1px solid #000; text-align: left; font-weight: bold;">Fecha</th>
                  <th style="padding: 12px; border: 1px solid #000; text-align: center; font-weight: bold; background-color: ${MATERIAL_PALETTE.plasticos.header};">
                    Plásticos<br/>(kg/mes)
                  </th>
                  <th style="padding: 12px; border: 1px solid #000; text-align: center; font-weight: bold; background-color: ${MATERIAL_PALETTE.papel_carton.header};">
                    Papel y cartón<br/>(kg/mes)
                  </th>
                  <th style="padding: 12px; border: 1px solid #000; text-align: center; font-weight: bold; background-color: ${MATERIAL_PALETTE.organico.header};">
                    Orgánicos<br/>(kg/mes)
                  </th>
                  <th style="padding: 12px; border: 1px solid #000; text-align: center; font-weight: bold; background-color: ${MATERIAL_PALETTE.otros.header};">
                    Otros<br/>(kg/mes)
                  </th>
                  <th style="padding: 12px; border: 1px solid #000; text-align: center; font-weight: bold; background-color: ${MATERIAL_PALETTE.descarte.header};">
                    Descarte<br/>(kg/mes)
                  </th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>`;
      };

      // Build pie chart as SVG
      const buildPieChartSVG = () => {
        if (pieChartData.length === 0) return '';

        const svgSize = 450; // Increased to accommodate outside labels
        const centerX = svgSize / 2;
        const centerY = svgSize / 2;
        const radius = 140;
        const labelLineRadius = radius + 20; // Where line ends
        const labelRadius = radius + 45; // Where text is placed
        let currentAngle = -90; // Start from top

        const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
        
        // Sort slices by size (largest to smallest) and rearrange to alternate large/small
        const sortedBySize = [...pieChartData].sort((a, b) => b.value - a.value);
        const rearranged = [];
        
        // Create alternating pattern: largest, smallest, second largest, second smallest, etc.
        // This spreads small slices between large ones to prevent label collisions
        let frontIndex = 0;
        let backIndex = sortedBySize.length - 1;
        
        while (frontIndex <= backIndex) {
          if (frontIndex <= backIndex) {
            rearranged.push(sortedBySize[frontIndex]); // Large slice
            frontIndex++;
          }
          if (frontIndex <= backIndex) {
            rearranged.push(sortedBySize[backIndex]); // Small slice
            backIndex--;
          }
        }

        const paths = [];
        const labelLines = [];
        const labels = [];

        rearranged.forEach((item, index) => {
          const percentage = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + percentage;

          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;

          const x1 = centerX + radius * Math.cos(startAngleRad);
          const y1 = centerY + radius * Math.sin(startAngleRad);
          const x2 = centerX + radius * Math.cos(endAngleRad);
          const y2 = centerY + radius * Math.sin(endAngleRad);

          const largeArc = percentage > 180 ? 1 : 0;

          const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          paths.push(`<path d="${path}" fill="${item.color}" stroke="#fff" stroke-width="2"/>`);

          // Label position (middle of arc) - outside the circle
          const labelAngle = startAngle + percentage / 2;
          const labelAngleRad = (labelAngle * Math.PI) / 180;
          
          // Point on the circle edge
          const edgeX = centerX + radius * Math.cos(labelAngleRad);
          const edgeY = centerY + radius * Math.sin(labelAngleRad);
          
          // Point where line ends
          const lineEndX = centerX + labelLineRadius * Math.cos(labelAngleRad);
          const lineEndY = centerY + labelLineRadius * Math.sin(labelAngleRad);
          
          // Point where text is placed
          const textX = centerX + labelRadius * Math.cos(labelAngleRad);
          const textY = centerY + labelRadius * Math.sin(labelAngleRad);

          // Add line from circle edge to text position
          labelLines.push(
            `<line x1="${edgeX}" y1="${edgeY}" x2="${lineEndX}" y2="${lineEndY}" stroke="#000" stroke-width="1.5"/>`
          );

          // Add text at the end of the line
          labels.push(
            `<text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="600" fill="#000">${item.percentage}%</text>`
          );

          currentAngle = endAngle;
        });

        return `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <h3 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 8px; color: rgba(0,0,0,0.7);">
              ${chartTitle.main}
            </h3>
            <p style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #dc2626;">
              ${chartTitle.subtitle}
            </p>
            <svg width="${svgSize}" height="${svgSize}" style="flex-shrink: 0;">
              ${paths.join('')}
              ${labelLines.join('')}
              ${labels.join('')}
            </svg>
          </div>`;
      };

      // Build bar chart as HTML/CSS
      const buildBarChartHTML = () => {
        if (monthlyData.length === 0) return '';

        const rawMaxValue = Math.max(
          ...monthlyData.map(row => 
            row.plasticos + row.papel_carton + row.organico + row.otros + row.descarte
          ),
          100
        );
        
        // Round maxValue to a nice multiple
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawMaxValue)));
        const normalized = rawMaxValue / magnitude;
        let roundedMultiple;
        if (normalized <= 2) {
          roundedMultiple = 2 * magnitude;
        } else if (normalized <= 5) {
          roundedMultiple = 5 * magnitude;
        } else {
          roundedMultiple = 10 * magnitude;
        }
        const maxValue = Math.ceil(rawMaxValue / roundedMultiple) * roundedMultiple;
        
        const chartHeight = 350;
        const barWidth = Math.max(40, Math.min(80, (750 / monthlyData.length) - 15));
        
        // Calculate y-axis ticks (5 ticks: 0, 25%, 50%, 75%, 100%) - from bottom (0) to top (max)
        const numTicks = 5;
        const yAxisLabels = [];
        for (let i = 0; i < numTicks; i++) {
          const value = (maxValue / (numTicks - 1)) * i; // Start from 0 and go up
          yAxisLabels.push(Math.round(value));
        }

        // Build integrated chart with y-axis and bars together
        // Chart container only includes bars area (not month labels)
        let chartContainerHTML = '<div style="display: flex; align-items: flex-end; height: ' + chartHeight + 'px; position: relative;">';
        
        // Y-axis labels on the left (before the line)
        chartContainerHTML += '<div style="display: flex; flex-direction: column-reverse; justify-content: space-between; align-items: flex-end; height: 100%; padding-right: 8px; padding-left: 5px; min-width: 50px;">';
        yAxisLabels.forEach((label) => {
          chartContainerHTML += `<div style="font-size: 11px; font-weight: 500;">${label.toLocaleString()}</div>`;
        });
        chartContainerHTML += '</div>';
        
        // Y-axis line (after the labels)
        chartContainerHTML += '<div style="width: 2px; height: 100%; background-color: #000; flex-shrink: 0;"></div>';
        
        // Bars section (only bars, no month labels inside)
        chartContainerHTML += '<div style="display: flex; align-items: flex-end; justify-content: space-around; height: 100%; padding: 0 20px; flex: 1; position: relative;">';
        
        monthlyData.forEach((row) => {
          const stackHeights = [
            (row.plasticos / maxValue) * chartHeight,
            (row.papel_carton / maxValue) * chartHeight,
            (row.organico / maxValue) * chartHeight,
            (row.otros / maxValue) * chartHeight,
            (row.descarte / maxValue) * chartHeight
          ];

          // Calculate total for this month
          const monthTotal = (row.plasticos || 0) + (row.papel_carton || 0) + (row.organico || 0) + (row.otros || 0) + (row.descarte || 0);
          
          chartContainerHTML += '<div style="display: flex; flex-direction: column; align-items: center; gap: 0; flex: 1; position: relative;">';
          
          // Stack container (bars only)
          chartContainerHTML += '<div style="display: flex; flex-direction: column; align-items: center; width: 100%; position: relative;">';
          
          // Value label above the bar - positioned absolutely at the top of the bar stack
          chartContainerHTML += `<div style="position: absolute; bottom: 100%; margin-bottom: 4px; font-size: 10px; font-weight: 600; text-align: center; white-space: nowrap; width: 100%;">${Math.round(monthTotal).toLocaleString()}</div>`;
          
          // Stack bars from bottom to top
          const bars = [];
          if (stackHeights[4] > 0) {
            bars.push(`<div style="width: ${barWidth}px; height: ${stackHeights[4]}px; background-color: ${MATERIAL_PALETTE.descarte.bar}; border: 1px solid #000;"></div>`);
          }
          if (stackHeights[3] > 0) {
            bars.push(`<div style="width: ${barWidth}px; height: ${stackHeights[3]}px; background-color: ${MATERIAL_PALETTE.otros.bar}; border: 1px solid #000;"></div>`);
          }
          if (stackHeights[2] > 0) {
            bars.push(`<div style="width: ${barWidth}px; height: ${stackHeights[2]}px; background-color: ${MATERIAL_PALETTE.organico.bar}; border: 1px solid #000;"></div>`);
          }
          if (stackHeights[1] > 0) {
            bars.push(`<div style="width: ${barWidth}px; height: ${stackHeights[1]}px; background-color: ${MATERIAL_PALETTE.papel_carton.bar}; border: 1px solid #000;"></div>`);
          }
          if (stackHeights[0] > 0) {
            bars.push(`<div style="width: ${barWidth}px; height: ${stackHeights[0]}px; background-color: ${MATERIAL_PALETTE.plasticos.bar}; border: 1px solid #000;"></div>`);
          }
          
          chartContainerHTML += bars.join('');
          chartContainerHTML += '</div>';
          chartContainerHTML += '</div>'; // Close column container
        });

        chartContainerHTML += '</div>'; // Close bars section
        chartContainerHTML += '</div>'; // Close chart container (with borders)
        
        // Month labels section (separate, below the chart)
        let monthLabelsHTML = '<div style="display: flex; justify-content: space-around; padding: 0 50px; margin-top: 5px; padding-left: 60px;">';
        monthlyData.forEach((row) => {
          monthLabelsHTML += `<div style="font-size: 11px; text-align: right; transform: rotate(-45deg); transform-origin: right center; white-space: nowrap; width: 60px; flex: 1;">${row.month}</div>`;
        });
        monthLabelsHTML += '</div>';
        
        chartContainerHTML += monthLabelsHTML;

        return `
          <div style="display: flex; flex-direction: column; align-items: center; margin-top: 0;">
            <h3 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 65px; margin-top: 0;">
              <span style="color: #dc2626; font-weight: bold;">${selectedYear}</span>
              <span style="color: rgba(0,0,0,0.7);"> GESTIÓN RESIDUOS</span>
            </h3>
            ${chartContainerHTML}
          </div>`;
      };

      // Build summary paragraph for PDF
      const buildSummaryParagraph = () => {
        const materialNames = {
          plasticos: 'plásticos',
          papel_carton: 'papel y cartón',
          organico: 'orgánicos',
          otros: 'otros',
          descarte: 'descarte'
        };

        const topMaterial = Object.entries(totals)
          .sort(([, a], [, b]) => b - a)[0];
        const topMaterialName = materialNames[topMaterial[0]] || 'desconocido';
        const topMaterialPct = Math.round((topMaterial[1] / (totals.plasticos + totals.papel_carton + totals.organico + totals.otros + totals.descarte)) * 100);

        const bottomMaterial = Object.entries(totals)
          .filter(([, v]) => v > 0)
          .sort(([, a], [, b]) => a - b)[0];
        const bottomMaterialName = bottomMaterial ? materialNames[bottomMaterial[0]] : null;

        const monthlyTotals = monthlyData.map(row => ({
          month: row.month,
          total: (row.plasticos || 0) + (row.papel_carton || 0) + (row.organico || 0) + 
                 (row.otros || 0) + (row.descarte || 0)
        }));

        const totalWeight = totals.plasticos + totals.papel_carton + totals.organico + totals.otros + totals.descarte;
        const bestMonth = monthlyTotals.length > 0 ? monthlyTotals.reduce((max, m) => m.total > max.total ? m : max, monthlyTotals[0]) : null;
        const worstMonth = monthlyTotals.length > 0 ? monthlyTotals.reduce((min, m) => m.total < min.total ? m : min, monthlyTotals[0]) : null;
        
        const avgFirstHalf = monthlyTotals.length > 0 ? monthlyTotals.slice(0, Math.ceil(monthlyTotals.length / 2))
          .reduce((sum, m) => sum + m.total, 0) / Math.ceil(monthlyTotals.length / 2) : 0;
        const avgSecondHalf = monthlyTotals.length > 0 ? monthlyTotals.slice(Math.ceil(monthlyTotals.length / 2))
          .reduce((sum, m) => sum + m.total, 0) / (monthlyTotals.length - Math.ceil(monthlyTotals.length / 2)) : 0;
        const trend = avgSecondHalf > avgFirstHalf ? 'creciente' : avgSecondHalf < avgFirstHalf ? 'decreciente' : 'estable';
        const trendChange = avgFirstHalf > 0 ? Math.abs(((avgSecondHalf - avgFirstHalf) / avgFirstHalf) * 100) : 0;

        const monthPart = selectedMonth !== '' ? MONTHS[parseInt(selectedMonth)] : 'Todos los meses';

        let summary = `Durante el período ${monthPart} ${selectedYear}, ${selectedClient.client_name} ha gestionado un total de ${Math.round(totalWeight).toLocaleString()} kg de residuos. `;
        
        summary += `La distribución muestra que ${topMaterialName} representa el material dominante con ${topMaterialPct}% del total (${Math.round(topMaterial[1]).toLocaleString()} kg). `;
        
        if (pieChartData.length > 1) {
          const secondMaterial = pieChartData
            .sort((a, b) => b.percentage - a.percentage)[1];
          summary += `Seguido de ${secondMaterial.name.toLowerCase()} con ${secondMaterial.percentage}%. `;
        }

        if (bottomMaterial && bottomMaterial[1] > 0) {
          const bottomPct = Math.round((bottomMaterial[1] / totalWeight) * 100);
          summary += `Por otro lado, ${bottomMaterialName} representa solo ${bottomPct}% del total. `;
        }

        if (bestMonth && worstMonth) {
          summary += `En términos de rendimiento mensual, ${bestMonth.month} destacó como el mes con mayor recolección (${Math.round(bestMonth.total).toLocaleString()} kg)`;
          
          if (worstMonth.month !== bestMonth.month) {
            summary += `, mientras que ${worstMonth.month} registró el menor volumen (${Math.round(worstMonth.total).toLocaleString()} kg)`;
          }
          summary += `. `;
          
          if (monthlyTotals.length >= 3) {
            summary += `La tendencia general muestra un patrón ${trend}`;
            if (trendChange > 5) {
              summary += ` con una variación significativa del ${Math.round(trendChange)}%`;
            }
            summary += `. `;
          }
        }

        if (topMaterialPct > 40) {
          summary += `El alto porcentaje de ${topMaterialName} sugiere una oportunidad para fortalecer programas específicos de reciclaje. `;
        }

        if (totals.descarte > 0) {
          const descartePct = Math.round((totals.descarte / totalWeight) * 100);
          if (descartePct > 5) {
            summary += `Es importante notar que el descarte representa ${descartePct}% del total, lo cual indica áreas de mejora en la separación de residuos. `;
          } else {
            summary += `El bajo porcentaje de descarte (${descartePct}%) refleja una efectiva separación de residuos en origen. `;
          }
        }

        summary += `Estos datos proporcionan una base sólida para optimizar las estrategias de gestión de residuos.`;

        return `
          <div style="page-break-inside: avoid; margin-top: 20px; margin-bottom: 30px; padding-bottom: 25px; border-bottom: 2px solid rgba(0,0,0,0.3);">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: rgba(0,0,0,0.7);">
              Resumen Ejecutivo
            </h3>
            <p style="text-align: justify; line-height: 1.8; font-size: 14px; color: #000;">
              ${summary}
            </p>
          </div>`;
      };

      // Build combined charts section with legend at bottom
      const buildCombinedChartsHTML = () => {
        if (pieChartData.length === 0 && monthlyData.length === 0) return '';

        const pieChart = pieChartData.length > 0 ? buildPieChartSVG() : '';
        const barChart = monthlyData.length > 0 ? buildBarChartHTML() : '';

        // Legend with all material types
        const legendHTML = `
          <div style="display: flex; justify-content: center; gap: 25px; margin-top: 25px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.2);">
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 20px; height: 15px; background-color: ${MATERIAL_PALETTE.plasticos.bar}; border: 1px solid #000;"></div>
              <span style="font-size: 13px; font-weight: 500;">Plásticos</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 20px; height: 15px; background-color: ${MATERIAL_PALETTE.papel_carton.bar}; border: 1px solid #000;"></div>
              <span style="font-size: 13px; font-weight: 500;">Papel y cartón</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 20px; height: 15px; background-color: ${MATERIAL_PALETTE.organico.bar}; border: 1px solid #000;"></div>
              <span style="font-size: 13px; font-weight: 500;">Orgánicos</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 20px; height: 15px; background-color: ${MATERIAL_PALETTE.otros.bar}; border: 1px solid #000;"></div>
              <span style="font-size: 13px; font-weight: 500;">Otros</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 20px; height: 15px; background-color: ${MATERIAL_PALETTE.descarte.bar}; border: 1px solid #000;"></div>
              <span style="font-size: 13px; font-weight: 500;">Descarte</span>
            </div>
          </div>`;

        return `
          <div style="page-break-inside: avoid; margin-top: 30px;">
            <div style="display: flex; justify-content: space-around; align-items: flex-start; gap: 40px;">
              ${pieChart}
              ${barChart}
            </div>
            ${legendHTML}
          </div>`;
      };

      // Get logo as base64 or use path
      const logoPath = '/logo.jpg';

      const printHTML = `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <title>${title}</title>
            <style>
              @page {
                size: A3 portrait;
                margin: 15mm;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #000;
                background: #fff;
                padding: 20px;
              }
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                margin-bottom: 25px;
                page-break-inside: avoid;
              }
              .header img {
                height: 120px;
                width: auto;
                object-fit: contain;
              }
              .header-text {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
              }
              .header h1 {
                font-size: 24px;
                font-weight: bold;
                color: rgba(0,0,0,0.7);
                margin: 0;
              }
              .header .date {
                font-size: 16px;
                color: rgba(0,0,0,0.6);
                margin-top: 5px;
              }
              .content-section {
                page-break-inside: avoid;
                margin-bottom: 30px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-text">
                <h1>${reportTitle}</h1>
                <div class="date">${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <img src="${window.location.origin}${logoPath}" alt="Logo" onerror="this.style.display='none'" />
            </div>
            ${buildSummaryParagraph()}
            ${buildTableHTML()}
            ${buildCombinedChartsHTML()}
          </body>
        </html>`;

      // Use iframe to print
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(printHTML);
      iframeDoc.close();

      // Flag to ensure print is only called once
      let hasPrinted = false;

      const triggerPrint = () => {
        if (hasPrinted || !iframe.parentNode) return;
        
        try {
          const iframeWindow = iframe.contentWindow;
          if (iframeWindow && iframeWindow.document.readyState === 'complete') {
            hasPrinted = true;
            iframeWindow.focus();
            iframeWindow.print();
            
            setTimeout(() => {
              if (iframe.parentNode) {
                document.body.removeChild(iframe);
              }
            }, 2000);
          }
            } catch (e) {
          console.error("Print error:", e);
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }
      };

      // Wait for iframe to load, then print
      iframe.onload = () => {
        setTimeout(triggerPrint, 800);
      };

      // Fallback in case onload doesn't fire
      setTimeout(() => {
        if (!hasPrinted && iframe.parentNode) {
          triggerPrint();
        }
      }, 1500);

    } catch (e) {
      console.error("Dedicated print failed:", e);
      alert("Error: " + e.message);
    }
  };

  // Generate AI Summary from report data
  const generateAISummary = async () => {
    try {
      if (!selectedClient) {
        alert("Por favor seleccione un cliente primero.");
        return;
      }

      if (collections.length === 0) {
        alert("No hay datos de colección para este cliente.");
        return;
      }

      setLoadingSummary(true);
      setAiSummary('');

      // Ensure we have valid data
      if (!monthlyData || !Array.isArray(monthlyData)) {
        throw new Error('No hay datos mensuales disponibles para generar el resumen.');
      }

      if (!totals || typeof totals !== 'object') {
        throw new Error('No hay datos de totales disponibles para generar el resumen.');
      }

      // Format report data for AI
      const reportData = {
        client: selectedClient.client_name,
        year: selectedYear,
        month: selectedMonth !== '' ? MONTHS[parseInt(selectedMonth)] : 'Todos los meses',
        totals: {
          plasticos: totals.plasticos || 0,
          papel_carton: totals.papel_carton || 0,
          organico: totals.organico || 0,
          otros: totals.otros || 0,
          descarte: totals.descarte || 0
        },
        monthlyData: (monthlyData || []).map(row => ({
          month: row.month,
          plasticos: row.plasticos || 0,
          papel_carton: row.papel_carton || 0,
          organico: row.organico || 0,
          otros: row.otros || 0,
          descarte: row.descarte || 0
        })),
        pieChartData: (pieChartData || []).map(item => ({
          name: item.name,
          value: item.value,
          percentage: item.percentage
        }))
      };

      const totalWeight = reportData.totals.plasticos + reportData.totals.papel_carton + 
                         reportData.totals.organico + reportData.totals.otros + 
                         reportData.totals.descarte;

      // Create prompt for AI
      const distributionText = reportData.pieChartData.length > 0 
        ? reportData.pieChartData.map(item => `- ${item.name}: ${item.percentage}%`).join('\n')
        : '- No hay datos de distribución disponible';
      
      const monthlyText = reportData.monthlyData.length > 0
        ? reportData.monthlyData.map(row => `${row.month}: ${Math.round((row.plasticos || 0) + (row.papel_carton || 0) + (row.organico || 0) + (row.otros || 0) + (row.descarte || 0)).toLocaleString()} kg`).join('\n')
        : '- No hay datos mensuales disponibles';

      const prompt = `Eres un analista de gestión de residuos. Analiza los siguientes datos y genera un resumen ejecutivo en español (máximo 200 palabras).

INFORME DE GESTIÓN DE RESIDUOS
Cliente: ${reportData.client}
Período: ${reportData.month} ${reportData.year}

TOTALES ANUALES:
- Plásticos: ${Math.round(reportData.totals.plasticos || 0).toLocaleString()} kg
- Papel y cartón: ${Math.round(reportData.totals.papel_carton || 0).toLocaleString()} kg
- Orgánicos: ${Math.round(reportData.totals.organico || 0).toLocaleString()} kg
- Otros: ${Math.round(reportData.totals.otros || 0).toLocaleString()} kg
- Descarte: ${Math.round(reportData.totals.descarte || 0).toLocaleString()} kg
- Total General: ${Math.round(totalWeight || 0).toLocaleString()} kg

DISTRIBUCIÓN PORCENTUAL:
${distributionText}

DATOS MENSUALES:
${monthlyText}

Por favor, genera un resumen ejecutivo que incluya:
1. Puntos clave sobre el rendimiento del cliente
2. Observaciones sobre las tendencias mensuales
3. Recomendaciones breves para mejorar la gestión de residuos
4. Highlights sobre los materiales más y menos recogidos

Responde SOLO con el resumen, sin introducción ni conclusiones adicionales.`;

      // Use Groq API (free tier, very fast)
      // Get free API key at: https://console.groq.com/
      const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
      
      // Debug: log if API key is found (first few chars only for security)
      console.log('API Key check:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'Not found');
      
      if (!apiKey) {
        // Generate a narrative summary with pattern analysis
        const materialNames = {
          plasticos: 'plásticos',
          papel_carton: 'papel y cartón',
          organico: 'orgánicos',
          otros: 'otros',
          descarte: 'descarte'
        };

        // Find top material
        const topMaterial = Object.entries(reportData.totals)
          .sort(([, a], [, b]) => b - a)[0];
        const topMaterialName = materialNames[topMaterial[0]] || 'desconocido';
        const topMaterialPct = Math.round((topMaterial[1] / totalWeight) * 100);

        // Find least collected material
        const bottomMaterial = Object.entries(reportData.totals)
          .filter(([, v]) => v > 0)
          .sort(([, a], [, b]) => a - b)[0];
        const bottomMaterialName = bottomMaterial ? materialNames[bottomMaterial[0]] : null;

        // Analyze monthly trends
        const monthlyTotals = reportData.monthlyData.map(row => ({
          month: row.month,
          total: (row.plasticos || 0) + (row.papel_carton || 0) + (row.organico || 0) + 
                 (row.otros || 0) + (row.descarte || 0)
        }));

        const bestMonth = monthlyTotals.reduce((max, m) => m.total > max.total ? m : max, monthlyTotals[0]);
        const worstMonth = monthlyTotals.reduce((min, m) => m.total < min.total ? m : min, monthlyTotals[0]);
        
        // Calculate trend (compare first half vs second half if we have enough data)
        const avgFirstHalf = monthlyTotals.slice(0, Math.ceil(monthlyTotals.length / 2))
          .reduce((sum, m) => sum + m.total, 0) / Math.ceil(monthlyTotals.length / 2);
        const avgSecondHalf = monthlyTotals.slice(Math.ceil(monthlyTotals.length / 2))
          .reduce((sum, m) => sum + m.total, 0) / (monthlyTotals.length - Math.ceil(monthlyTotals.length / 2));
        const trend = avgSecondHalf > avgFirstHalf ? 'creciente' : avgSecondHalf < avgFirstHalf ? 'decreciente' : 'estable';
        const trendChange = Math.abs(((avgSecondHalf - avgFirstHalf) / avgFirstHalf) * 100);

        // Build narrative summary
        let summary = `Durante el período ${reportData.month} ${reportData.year}, ${reportData.client} ha gestionado un total de ${Math.round(totalWeight).toLocaleString()} kg de residuos. `;
        
        summary += `La distribución muestra que ${topMaterialName} representa el material dominante con ${topMaterialPct}% del total (${Math.round(topMaterial[1]).toLocaleString()} kg), `;
        
        if (reportData.pieChartData.length > 1) {
          const secondMaterial = reportData.pieChartData
            .sort((a, b) => b.percentage - a.percentage)[1];
          summary += `seguido de ${secondMaterial.name.toLowerCase()} con ${secondMaterial.percentage}%. `;
        }

        if (bottomMaterial && bottomMaterial[1] > 0) {
          const bottomPct = Math.round((bottomMaterial[1] / totalWeight) * 100);
          summary += `Por otro lado, ${bottomMaterialName} representa solo ${bottomPct}% del total, indicando una menor generación de este tipo de residuo. `;
        }

        if (monthlyTotals.length > 1) {
          summary += `En términos de rendimiento mensual, ${bestMonth.month} destacó como el mes con mayor recolección (${Math.round(bestMonth.total).toLocaleString()} kg), `;
          
          if (worstMonth.month !== bestMonth.month) {
            summary += `mientras que ${worstMonth.month} registró el menor volumen (${Math.round(worstMonth.total).toLocaleString()} kg). `;
          }
          
          if (monthlyTotals.length >= 3) {
            summary += `La tendencia general muestra un patrón ${trend}`;
            if (trendChange > 5) {
              summary += ` con una variación significativa del ${Math.round(trendChange)}%`;
            }
            summary += `. `;
          }
        }

        // Add insights
        if (topMaterialPct > 40) {
          summary += `El alto porcentaje de ${topMaterialName} sugiere una oportunidad para fortalecer programas específicos de reciclaje y reducir el impacto ambiental mediante una gestión más enfocada de este material. `;
        }

        if (reportData.totals.descarte > 0) {
          const descartePct = Math.round((reportData.totals.descarte / totalWeight) * 100);
          if (descartePct > 5) {
            summary += `Es importante notar que el descarte representa ${descartePct}% del total, lo cual indica áreas de mejora en la separación y clasificación de residuos. `;
          } else {
            summary += `El bajo porcentaje de descarte (${descartePct}%) refleja una efectiva separación de residuos en origen. `;
          }
        }

        summary += `Estos datos proporcionan una base sólida para optimizar las estrategias de gestión de residuos y mejorar los procesos de reciclaje en el futuro.`;

        setAiSummary(summary);
        return;
      }

      // Use Groq API if API key is provided
      const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
      
      const response = await fetch(groqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Fast and free
          messages: [
            {
              role: 'system',
              content: 'Eres un experto analista de gestión de residuos que genera resúmenes ejecutivos concisos y profesionales en español.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Error de Groq API: ${errorMsg}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected Groq API response:', data);
        throw new Error('Formato de respuesta inesperado de Groq API.');
      }
      
      const summary = data.choices[0].message.content || 'No se pudo generar el resumen.';
      setAiSummary(summary);

    } catch (error) {
      console.error('Error generating AI summary:', error);
      console.error('Error details:', {
        error,
        message: error.message,
        stack: error.stack,
        monthlyData: monthlyData,
        totals: totals,
        pieChartData: pieChartData
      });
      
      const errorMessage = error.message || 'Error desconocido al generar el resumen';
      alert('Error al generar el resumen: ' + errorMessage + '\n\nPor favor, asegúrate de:\n1. Tener datos de colección cargados\n2. Haber seleccionado un cliente\n3. Tener configurada la API key (opcional) como VITE_GROQ_API_KEY en tu archivo .env\n\nRevisa la consola para más detalles.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch all clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        await getClients(setClients);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Fetch collections when a client is selected
  useEffect(() => {
    const fetchCollections = async () => {
      if (!selectedClient) {
        setCollections([]);
        setReportGenerated(false);
        setAiSummary('');
        return;
      }

      try {
        setLoadingCollections(true);
        const data = await getCollectionsByClientId(selectedClient.id);
        setCollections(data);
        // Reset report when client changes
        setReportGenerated(false);
        setAiSummary('');
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCollections(false);
      }
    };
    fetchCollections();
  }, [selectedClient]);

  // Reset report when year or month changes
  useEffect(() => {
    setReportGenerated(false);
    setAiSummary('');
  }, [selectedYear, selectedMonth]);

  // Generate report function
  const generateReport = () => {
    if (!selectedClient) {
      alert("Por favor seleccione un cliente primero.");
      return;
    }

    if (collections.length === 0) {
      alert("No hay datos de colección para este cliente.");
      return;
    }

    setReportGenerated(true);
    // Automatically generate the summary paragraph
    generateAISummary();
  };

  // Material categories mapping
  const MATERIAL_CATEGORIES = {
    plasticos: 'Plásticos',
    papel_carton: 'Papel y cartón',
    organico: 'Orgánicos',
    otros: 'Otros',
    otros_reciclables: 'Otros',
    descarte: 'Descarte',
    mezclado: 'Otros'
  };

  // Month names in Spanish
  const MONTHS = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  // Generate array of years (current year and past 5 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const availableYears = generateYears();

  // Aggregate collections data by month and material type
  const getMonthlyData = () => {
    const monthlyData = {};
    const totals = {
      plasticos: 0,
      papel_carton: 0,
      organico: 0,
      otros: 0,
      descarte: 0
    };

    collections.forEach(collection => {
      if (!collection.timeStamp && !collection.createdAt) return;
      
      const date = collection.timeStamp?.toDate ? collection.timeStamp.toDate() : 
                   collection.createdAt?.toDate ? collection.createdAt.toDate() : 
                   new Date(collection.timeStamp || collection.createdAt);
      
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      // Filter by selected year
      if (year !== selectedYear) return;
      
      // Filter by selected month (if specified)
      if (selectedMonth !== '' && monthIndex !== parseInt(selectedMonth)) return;
      
      const monthKey = `${year}-${monthIndex}`;
      const monthName = MONTHS[monthIndex];

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          year: year,
          plasticos: 0,
          papel_carton: 0,
          organico: 0,
          otros: 0,
          descarte: 0,
          sortKey: `${year}-${String(monthIndex).padStart(2, '0')}`
        };
      }

      // Aggregate materials from collection
      if (collection.collections && Array.isArray(collection.collections)) {
        collection.collections.forEach(item => {
          const materialId = item.materialId?.toLowerCase() || '';
          const weight = Number(item.weight) || 0;
          
          // Map material to category
          if (materialId.includes('plastico')) {
            monthlyData[monthKey].plasticos += weight;
            totals.plasticos += weight;
          } else if (materialId.includes('papel') || materialId.includes('carton')) {
            monthlyData[monthKey].papel_carton += weight;
            totals.papel_carton += weight;
          } else if (materialId.includes('organico')) {
            monthlyData[monthKey].organico += weight;
            totals.organico += weight;
          } else if (materialId.includes('descarte')) {
            monthlyData[monthKey].descarte += weight;
            totals.descarte += weight;
          } else {
            monthlyData[monthKey].otros += weight;
            totals.otros += weight;
          }
        });
      }
    });

    // Convert to array and sort by date
    const dataArray = Object.values(monthlyData).sort((a, b) => 
      a.sortKey.localeCompare(b.sortKey)
    );

    return { monthlyData: dataArray, totals };
  };

  const { monthlyData, totals } = collections.length > 0 ? getMonthlyData() : { monthlyData: [], totals: {} };

  // Unified color palette for all materials (provided palette)
  const MATERIAL_PALETTE = {
    // Lighter tints for TABLE headers and cells; solid colors kept for charts
    plasticos: {
      header: 'rgba(224,190,121,0.20)',
      cell: 'rgba(224,190,121,0.12)',
      pie: '#E0BE79',
      bar: '#E0BE79'
    }, // Burlywood
    papel_carton: {
      header: 'rgba(50,68,82,0.18)',
      cell: 'rgba(50,68,82,0.10)',
      pie: '#324452',
      bar: '#324452'
    }, // Charcoal
    organico: {
      header: 'rgba(82,117,103,0.18)',
      cell: 'rgba(82,117,103,0.10)',
      pie: '#527567',
      bar: '#527567'
    }, // Hooker's Green
    otros: {
      header: 'rgba(132,86,55,0.18)',
      cell: 'rgba(132,86,55,0.10)',
      pie: '#845637',
      bar: '#845637'
    }, // Milk Chocolate
    descarte: {
      header: 'rgba(240,218,166,0.25)',
      cell: 'rgba(240,218,166,0.12)',
      pie: '#F0DAA6',
      bar: '#F0DAA6'
    }, // Deep Champagne
  };

  // Get pie chart data based on month selection
  const getPieChartData = () => {
    let data = {
      plasticos: 0,
      papel_carton: 0,
      organico: 0,
      otros: 0,
      descarte: 0
    };

    collections.forEach(collection => {
      if (!collection.timeStamp && !collection.createdAt) return;
      
      const date = collection.timeStamp?.toDate ? collection.timeStamp.toDate() : 
                   collection.createdAt?.toDate ? collection.createdAt.toDate() : 
                   new Date(collection.timeStamp || collection.createdAt);
      
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      // Filter by selected year
      if (year !== selectedYear) return;
      
      // Filter by selected month if provided
      if (selectedMonth !== '' && monthIndex !== parseInt(selectedMonth)) return;

      // Aggregate materials
      if (collection.collections && Array.isArray(collection.collections)) {
        collection.collections.forEach(item => {
          const materialId = item.materialId?.toLowerCase() || '';
          const weight = Number(item.weight) || 0;
          
          if (materialId.includes('plastico')) {
            data.plasticos += weight;
          } else if (materialId.includes('papel') || materialId.includes('carton')) {
            data.papel_carton += weight;
          } else if (materialId.includes('organico')) {
            data.organico += weight;
          } else if (materialId.includes('descarte')) {
            data.descarte += weight;
          } else {
            data.otros += weight;
          }
        });
      }
    });

    // Calculate total and convert to array format for pie chart
    const total = data.plasticos + data.papel_carton + data.organico + data.otros + data.descarte;
    
    if (total === 0) return [];

    const pieData = [
      { 
        name: 'Plásticos (kg/mes)', 
        value: data.plasticos, 
        percentage: Math.round((data.plasticos / total) * 100),
        color: MATERIAL_PALETTE.plasticos.pie
      },
      { 
        name: 'Papel y cartón (kg/mes)', 
        value: data.papel_carton, 
        percentage: Math.round((data.papel_carton / total) * 100),
        color: MATERIAL_PALETTE.papel_carton.pie
      },
      { 
        name: 'Orgánicos (kg/mes)', 
        value: data.organico, 
        percentage: Math.round((data.organico / total) * 100),
        color: MATERIAL_PALETTE.organico.pie
      },
      { 
        name: 'Otros (kg/mes)', 
        value: data.otros, 
        percentage: Math.round((data.otros / total) * 100),
        color: MATERIAL_PALETTE.otros.pie
      },
      { 
        name: 'Descarte (kg/mes)', 
        value: data.descarte, 
        percentage: Math.round((data.descarte / total) * 100),
        color: MATERIAL_PALETTE.descarte.pie
      }
    ];

    // Filter out items with 0 value
    return pieData.filter(item => item.value > 0);
  };

  const pieChartData = collections.length > 0 ? getPieChartData() : [];

  // Get chart title based on month selection
  const getChartTitle = () => {
    if (selectedMonth !== '') {
      return {
        main: '% CANTIDAD DE RESIDUOS',
        subtitle: `${MONTHS[parseInt(selectedMonth)]} ${selectedYear}`
      };
    }
    return {
      main: '% CANTIDAD DE RESIDUOS',
      subtitle: `${selectedYear}`
    };
  };

  // Header title for the report (above the table)
  const getReportHeaderTitle = () => {
    const suffix = selectedMonth !== ''
      ? `${MONTHS[parseInt(selectedMonth)]} ${selectedYear}`
      : `${selectedYear}`;
    return `INFORME GESTIÓN DE RESIDUOS - ${suffix}`;
  };

  // Custom label for pie chart
  const renderCustomLabel = (entry) => {
    return `${entry.percentage}% (${Math.round(entry.value).toLocaleString()} kg)`;
  };

  return (
    <NavigationWrapper>
      <div className="pt-12 w-full flex items-center justify-center">
        <div className="flex flex-col w-11/12 md:w-5/6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-5 items-center">
              <h1 className="text-3xl md:text-5xl text-black/70">Statistic Reports</h1>
              {loading && (
                <div className="w-10 h-10">
                  <Spinner />
                </div>
              )}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="w-full bg-white/20 border-[1px] border-black/40 rounded-3xl mt-8 shadow-xl shadow-black/30 p-5">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.5fr] gap-4 items-end">
              {/* Client Selector */}
              <div>
                <label htmlFor="client-select" className="text-black/70 font-semibold mb-2 block">
                  Cliente:
                </label>
                {loading ? (
                  <p className="text-black/50">Loading clients...</p>
                ) : (
                  <select
                    id="client-select"
                    value={selectedClient?.id || ''}
                    onChange={(e) => {
                      const client = clients.find(c => c.id === e.target.value);
                      setSelectedClient(client || null);
                    }}
                    className="w-full p-3 rounded-xl bg-white/70 text-black border-2 border-black/20 focus:outline-none focus:ring-2 focus:ring-black/30 cursor-pointer"
                  >
                    <option value="">-- Seleccionar cliente --</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Year Selector */}
              <div>
                <label htmlFor="year-select" className="text-black/70 font-semibold mb-2 block">
                  Año:
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/70 text-black border-2 border-black/20 focus:outline-none focus:ring-2 focus:ring-black/30 cursor-pointer"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selector (Optional) */}
              <div>
                <label htmlFor="month-select" className="text-black/70 font-semibold mb-2 block">
                  Mes: <span className="text-black/50 text-sm">(opcional)</span>
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/70 text-black border-2 border-black/20 focus:outline-none focus:ring-2 focus:ring-black/30 cursor-pointer"
                >
                  <option value="">-- Todos los meses --</option>
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate / Export Buttons */}
              <div className="flex flex-col justify-end">
                <div className="flex space-x-2 flex-wrap gap-2 w-full">
                  <button
                    onClick={generateReport}
                    disabled={!selectedClient || collections.length === 0}
                    className="whitespace-nowrap bg-green-500/90 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white border border-green-600/30 rounded-xl px-4 py-3 shadow-sm font-semibold"
                    title="Obtener informe"
                  >
                    Obtener informe
                  </button>
                  <button
                    onClick={handleDedicatedPrint}
                    disabled={!reportGenerated}
                    className="whitespace-nowrap bg-white/90 hover:bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-black border border-black/30 rounded-xl px-4 py-3 shadow-sm"
                    title="Generar PDF"
                  >
                    Generar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report content wrapper for PDF export */}
          {reportGenerated && (
          <div ref={reportRef} className="report-scope">
            <style>{`
              .report-scope th, .report-scope td { border-color: rgba(0,0,0,0.25) !important; }
              .report-scope .text-red-600 { color: #dc2626 !important; }
            `}</style>

            {/* Summary Paragraph - Editable */}
            {aiSummary && (
              <div className="w-full bg-white/90 border-[1px] border-black/40 rounded-3xl mt-8 mb-8 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-black/70">
                    Resumen Ejecutivo
                  </h3>
                  <button
                    onClick={() => setIsEditingSummary(!isEditingSummary)}
                    className="text-sm px-3 py-1 rounded-lg bg-black/10 hover:bg-black/20 text-black/70"
                  >
                    {isEditingSummary ? 'Guardar' : 'Editar'}
                  </button>
                </div>
                {isEditingSummary ? (
                  <textarea
                    value={aiSummary}
                    onChange={(e) => setAiSummary(e.target.value)}
                    className="w-full min-h-[200px] p-4 text-black/80 leading-relaxed border-2 border-black/20 rounded-lg focus:outline-none focus:border-black/40"
                    style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
                  />
                ) : (
                  <p className="text-black/80 leading-relaxed whitespace-pre-line text-justify">
                    {aiSummary}
                  </p>
                )}
              </div>
            )}

            {/* Monthly Statistics Table */}
            {selectedClient && (
              <div className="flex flex-col w-full rounded-3xl mt-3 mb-8" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.4)' }}>
                <div className="p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.2)', backgroundColor: '#e5e7eb' }}>
                  <h2 className="text-2xl font-bold text-center" style={{ color: 'rgba(0,0,0,0.7)' }}>
                    {getReportHeaderTitle()}
                  </h2>
                  {loadingCollections && (
                    <div className="w-8 h-8 mt-2 mx-auto">
                      <Spinner />
                    </div>
                  )}
                </div>

                {!loadingCollections && collections.length === 0 && (
                  <div className="p-10 text-center text-black/50">
                    No collections found for this client.
                  </div>
                )}

                {!loadingCollections && collections.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr style={{ color: '#000000', backgroundColor: '#d1d5db' }}>
                          <th className="p-4 font-bold border border-gray-400 text-left">Fecha</th>
                          <th className="p-4 font-bold border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.plasticos.header }}>
                            Plásticos<br/>(kg/mes)
                          </th>
                          <th className="p-4 font-bold border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.papel_carton.header }}>
                            Papel y cartón<br/>(kg/mes)
                          </th>
                          <th className="p-4 font-bold border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.organico.header }}>
                            Orgánicos<br/>(kg/mes)
                          </th>
                          <th className="p-4 font-bold border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.otros.header }}>
                            Otros<br/>(kg/mes)
                          </th>
                          <th className="p-4 font-bold border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.descarte.header }}>
                            Descarte<br/>(kg/mes)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((row, index) => (
                          <tr key={index} className="hover:bg-white/20 transition-colors">
                            <td className="p-3 border border-gray-400 font-semibold text-black">
                              {row.month}
                            </td>
                            <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.plasticos.cell }}>
                              {row.plasticos > 0 ? Math.round(row.plasticos).toLocaleString() : 'SD'}
                            </td>
                            <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.papel_carton.cell }}>
                              {row.papel_carton > 0 ? Math.round(row.papel_carton).toLocaleString() : 'SD'}
                            </td>
                            <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.organico.cell }}>
                              {row.organico > 0 ? Math.round(row.organico).toLocaleString() : 'SD'}
                            </td>
                            <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.otros.cell }}>
                              {row.otros > 0 ? Math.round(row.otros).toLocaleString() : 'SD'}
                            </td>
                            <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.descarte.cell }}>
                              {row.descarte > 0 ? Math.round(row.descarte).toLocaleString() : 'SD'}
                            </td>
                          </tr>
                        ))}
                        {/* Totals Row */}
                        <tr className="bg-gray-200 font-bold">
                          <td className="p-3 border border-gray-400 text-black">
                            TOTAL {selectedYear}
                          </td>
                          <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.plasticos.cell }}>
                            {totals.plasticos > 0 ? Math.round(totals.plasticos).toLocaleString() : 'SD'}
                          </td>
                          <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.papel_carton.cell }}>
                            {totals.papel_carton > 0 ? Math.round(totals.papel_carton).toLocaleString() : 'SD'}
                          </td>
                          <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.organico.cell }}>
                            {totals.organico > 0 ? Math.round(totals.organico).toLocaleString() : 'SD'}
                          </td>
                          <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.otros.cell }}>
                            {totals.otros > 0 ? Math.round(totals.otros).toLocaleString() : 'SD'}
                          </td>
                          <td className="p-3 border border-gray-400 text-center" style={{ backgroundColor: MATERIAL_PALETTE.descarte.cell }}>
                            {totals.descarte > 0 ? Math.round(totals.descarte).toLocaleString() : 'SD'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Charts Section: Pie and Bar charts together */}
            {selectedClient && collections.length > 0 && pieChartData.length > 0 && monthlyData.length > 0 && (
              <div>
                <div className="flex flex-row flex-wrap items-start justify-between w-full mt-4 mb-8 gap-x-0 gap-y-1">
                  {/* Pie Chart */}
                  <div className="w-[49%] p-3 rounded-3xl" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.4)', height: '720px' }}>
                    <div className="text-center mb-2">
                      <h3 className="text-2xl font-bold" style={{ color: 'rgba(0,0,0,0.7)' }}>
                        {getChartTitle().main}
                      </h3>
                      <p className="text-2xl font-bold mt-1" style={{ color: '#dc2626' }}>
                        {getChartTitle().subtitle}
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                      {(() => {
                        // Rearrange pie chart data to alternate large/small slices (same as PDF)
                        const sortedBySize = [...pieChartData].sort((a, b) => b.value - a.value);
                        const rearrangedPieData = [];
                        let frontIndex = 0;
                        let backIndex = sortedBySize.length - 1;
                        while (frontIndex <= backIndex) {
                          if (frontIndex <= backIndex) {
                            rearrangedPieData.push(sortedBySize[frontIndex]);
                            frontIndex++;
                          }
                          if (frontIndex <= backIndex) {
                            rearrangedPieData.push(sortedBySize[backIndex]);
                            backIndex--;
                          }
                        }
                        return (
                      <PieChart>
                        <Pie
                              data={rearrangedPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={renderCustomLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                              {rearrangedPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend 
                          verticalAlign="bottom" 
                          height={64}
                          wrapperStyle={{ paddingTop: 10, marginTop: 16}}
                          formatter={(value, entry) => (
                            <span style={{ color: '#374151', fontWeight: 500 }}>
                              {value}
                            </span>
                          )}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${Math.round(value).toLocaleString()} kg`,
                            name
                          ]}
                        />
                      </PieChart>
                        );
                      })()}
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart - Gestión Residuos (stacked) */}
                  <div className="w-[49%] p-3 rounded-3xl" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.4)', height: '720px' }}>
                    <div className="text-center mb-8">
                      <span className="text-2xl font-bold mr-2" style={{ color: '#dc2626' }}>{selectedYear}</span>
                      <span className="text-2xl font-bold" style={{ color: 'rgba(0,0,0,0.7)' }}>GESTIÓN RESIDUOS</span>
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" interval={0} height={70} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${Math.round(value).toLocaleString()} kg`} />
                        <Legend
                            verticalAlign="bottom"
                            height={44}
                            align="center"
                            wrapperStyle={{ paddingTop: 40, marginTop: 16 }}
                            formatter={(value) => `${value}`} 
                            />
                        <Bar dataKey="plasticos" name="Plásticos (kg/mes)" stackId="a" fill={MATERIAL_PALETTE.plasticos.bar} />
                        <Bar dataKey="papel_carton" name="Papel y cartón (kg/mes)" stackId="a" fill={MATERIAL_PALETTE.papel_carton.bar} />
                        <Bar dataKey="organico" name="Orgánicos (kg/mes)" stackId="a" fill={MATERIAL_PALETTE.organico.bar} />
                        <Bar dataKey="otros" name="Otros (kg/mes)" stackId="a" fill={MATERIAL_PALETTE.otros.bar} />
                        <Bar dataKey="descarte" name="Descarte (kg/mes)" stackId="a" fill={MATERIAL_PALETTE.descarte.bar} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {!selectedClient && !loading && (
            <div className="flex flex-col w-full bg-white/20 border-[1px] border-black/40 rounded-3xl mt-8 mb-32 shadow-xl shadow-black/30 p-10">
              <p className="text-black/50 text-center">
                Please select a client to view their collection data.
              </p>
            </div>
          )}
        </div>
      </div>
    </NavigationWrapper>
  )
}

export default StatisticReports

