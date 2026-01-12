'use client'
import React, { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

function getColorByLevel(level: number) {
  return level === 0 ? "#FF1493" : // 中心節點 "me" 使用粉紅色
         level === 1 ? "#007BFF" : 
         level === 2 ? "#28A745" : 
         level === 3 ? "#FFC107" : "#66ccff";
}

interface SkillTree2DProps {
  data: any;
  onNodeSelect?: (node: any) => void;
}

function SkillTree2D({ data, onNodeSelect }: SkillTree2DProps) {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // 狀態管理
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // --- 關鍵修正：智慧喚醒機制 ---
  useEffect(() => {
    const graph = fgRef.current;
    if (!graph) return;

    try {
        // 1. 獲取當前的物理模擬能量 (Alpha)
        // 如果圖表剛載入，Alpha 會是 1.0 (正在爆炸擴散)，這時候我們絕對不要干擾它！
        // 只有當 Alpha 很小 (例如 < 0.1，表示已經快靜止了)，我們才需要去喚醒它重繪顏色。
        const currentAlpha = typeof graph.d3Alpha === 'function' ? graph.d3Alpha() : 0;

        if (currentAlpha < 0.1) {
            if (typeof graph.d3AlphaTarget === 'function') graph.d3AlphaTarget(0);
            if (typeof graph.d3Alpha === 'function') graph.d3Alpha(0.05).restart();
        }
    } catch (e) {
        console.warn("ForceGraph engine not ready yet:", e);
    }
  }, [selectedNodeId, highlightNodes]); 
  // --------------------------------

  const handleNodeClick = useCallback((node: any) => {
    if (onNodeSelect) {
        onNodeSelect(node);
    }

    const newHighlightNodes = new Set();
    const newHighlightLinks = new Set();

    newHighlightNodes.add(node.id);
    setSelectedNodeId(node.id);

    if (data.links) {
      data.links.forEach((link: any) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        if (sourceId === node.id) {
            newHighlightNodes.add(targetId);
            newHighlightLinks.add(link);
        } else if (targetId === node.id) {
            newHighlightNodes.add(sourceId);
            newHighlightLinks.add(link);
        }
      });
    }

    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  }, [data, onNodeSelect]);

  const handleBackgroundClick = useCallback(() => {
    if (onNodeSelect) {
        onNodeSelect(null);
    }
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setSelectedNodeId(null);
  }, [onNodeSelect]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.width && size.height && (
        <ForceGraph2D
          ref={fgRef}
          width={size.width}
          height={size.height}
          graphData={data}
          nodeAutoColorBy="level"
          
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          
          // 讓圖表冷卻時間適中，確保一開始能排好版
          cooldownTicks={100} 
          
          linkWidth={(link: any) => highlightLinks.has(link) ? 2 : 1}
          linkColor={(link: any) => {
            if (!selectedNodeId) return "#999";
            return highlightLinks.has(link) ? "#FFFFFF" : "#333"; 
          }}

          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const x = node.x;
            const y = node.y;
            
            // 安全檢查：如果座標還沒算出來，就不畫，避免報錯
            if (typeof x !== 'number' || typeof y !== 'number') return;

            const score = typeof node.score === 'number' ? node.score : 1;
            const isCenterNode = node.id === "me" || node.level === 0;
            const radius = isCenterNode ? 20 : (5 + score * 2); // 中心節點更大

            const isSelected = node.id === selectedNodeId;
            const isHighlighted = highlightNodes.has(node.id);

            const baseAlpha = Math.max(0.2, 0.8 - 0.1 * (5 - score));
            let finalAlpha = baseAlpha;

            if (selectedNodeId && !isHighlighted) {
                finalAlpha = 0.1; 
            } else if (selectedNodeId && isHighlighted) {
                finalAlpha = 1;
            }

            ctx.save();
            
            if (isSelected) {
                ctx.beginPath();
                ctx.lineWidth = 2 / globalScale;
                ctx.strokeStyle = '#FFFFFF';
                const boxSize = radius * 2.5; 
                ctx.strokeRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = getColorByLevel(node.level || 0);
            ctx.globalAlpha = finalAlpha;
            ctx.fill();
            
            ctx.globalAlpha = selectedNodeId && !isHighlighted ? 0.1 : 1;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            const label = node.name || '';
            ctx.fillText(label, x, y - radius - 4);

            ctx.restore();
          }}
          backgroundColor="#00000000"
        />
      )}
    </div>
  );
}

export default function GrowthTree({ data, onNodeSelect }: SkillTree2DProps) {
  return <SkillTree2D data={data} onNodeSelect={onNodeSelect} />;
}