import React, { useEffect, useRef, useState } from 'react';

export default function KnowledgeGraph({ memoryNodes = [] }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Keep nodes in a ref to persist across frames without re-rendering the canvas React component
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, isDown: false, draggedNode: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth || 600);
    let height = (canvas.height = 360);

    // Color definitions
    const goldColor = '#D4AF37';
    const amberColor = '#FFD95A';
    const dimColor = 'rgba(255, 255, 255, 0.4)';

    // Helper: generate nodes from memoryNodes prop
    const syncNodes = () => {
      const currentNodes = nodesRef.current;
      const newNodes = [];

      // Always create a central Core node
      newNodes.push({
        id: 'core-database-node',
        tag: 'Vector DB Core',
        content: 'InnovationHub Shared Associative Vector Memory Core.',
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        radius: 16,
        isCore: true,
        color: goldColor,
        pulse: 0
      });

      // Synchronize props to canvas nodes
      memoryNodes.forEach((dbNode, idx) => {
        // Look for existing node to preserve position
        const existing = currentNodes.find(n => n.propId === dbNode.id);
        if (existing) {
          newNodes.push(existing);
        } else {
          // Arrange in a circle around center initially
          const angle = (idx / memoryNodes.length) * Math.PI * 2;
          const dist = 100 + Math.random() * 40;
          newNodes.push({
            id: `node-${dbNode.id}`,
            propId: dbNode.id,
            tag: dbNode.tag || 'memory-node',
            content: dbNode.content,
            x: width / 2 + Math.cos(angle) * dist,
            y: height / 2 + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: 8,
            isCore: false,
            color: idx % 2 === 0 ? amberColor : '#FFFFFF',
            pulse: Math.random() * Math.PI
          });
        }
      });

      nodesRef.current = newNodes;
    };

    syncNodes();

    // Physics constants
    const kRepulsion = 1200; // force pushing nodes apart
    const kGravity = 0.015;    // force pulling nodes to center
    const friction = 0.95;

    const tick = () => {
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // 1. Calculate repulsion forces (all-pairs)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 150) {
            // Push away
            const force = kRepulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!n1.isCore && n1 !== mouse.draggedNode) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (!n2.isCore && n2 !== mouse.draggedNode) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }
      }

      // 2. Gravity and bounds updates
      nodes.forEach((node) => {
        if (node.isCore) {
          // Lock core in center
          node.x = width / 2;
          node.y = height / 2;
          node.pulse += 0.05;
          return;
        }

        if (node === mouse.draggedNode) return;

        // Pull to center
        const dx = width / 2 - node.x;
        const dy = height / 2 - node.y;
        node.vx += dx * kGravity;
        node.vy += dy * kGravity;

        // Apply velocities
        node.vx *= friction;
        node.vy *= friction;
        node.x += node.vx;
        node.y += node.vy;

        // Contain in screen
        const margin = 20;
        if (node.x < margin) { node.x = margin; node.vx *= -0.5; }
        if (node.x > width - margin) { node.x = width - margin; node.vx *= -0.5; }
        if (node.y < margin) { node.y = margin; node.vy *= -0.5; }
        if (node.y > height - margin) { node.y = height - margin; node.vy *= -0.5; }

        node.pulse += 0.02;
      });

      // 3. Clear and draw
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines first (behind nodes)
      const core = nodes.find(n => n.isCore);
      if (core) {
        nodes.forEach((node) => {
          if (node.isCore) return;

          // Draw spring line to Core
          ctx.beginPath();
          ctx.moveTo(core.x, core.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = selectedNode?.id === node.id ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = selectedNode?.id === node.id ? 2.0 : 1.0;
          ctx.stroke();
        });
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        const drawRadius = node.radius + (node.isCore ? Math.sin(node.pulse) * 1.5 : Math.sin(node.pulse) * 0.4);
        ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
        
        ctx.fillStyle = node.color;
        
        // Glow effect
        ctx.shadowBlur = node.isCore ? 20 : 10;
        ctx.shadowColor = node.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw tag text
        ctx.font = 'bold 9px var(--font-sans)';
        ctx.fillStyle = node.isCore ? goldColor : '#AAAAAA';
        ctx.textAlign = 'center';
        ctx.fillText(node.tag, node.x, node.y - node.radius - 6);
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Mouse handlers for dragging nodes
    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current.isDown = true;
      mouseRef.current.x = mx;
      mouseRef.current.y = my;

      // Find closest node to click
      let closest = null;
      let minDist = 25; // hit radius
      nodesRef.current.forEach((node) => {
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          closest = node;
          minDist = dist;
        }
      });

      if (closest) {
        mouseRef.current.draggedNode = closest;
        setSelectedNode(closest);
      } else {
        setSelectedNode(null);
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current.x = mx;
      mouseRef.current.y = my;

      if (mouseRef.current.isDown && mouseRef.current.draggedNode) {
        if (!mouseRef.current.draggedNode.isCore) {
          mouseRef.current.draggedNode.x = mx;
          mouseRef.current.draggedNode.y = my;
        }
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      mouseRef.current.draggedNode = null;
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.clientWidth || 600;
      syncNodes();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [memoryNodes, selectedNode]);

  return (
    <div className="space-y-4">
      {/* Knowledge canvas workspace */}
      <div className="w-full bg-[#070707] border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="block cursor-grab active:cursor-grabbing" />
        
        {/* Floating Ambient Info Tag */}
        <div className="absolute top-4 left-4 pointer-events-none select-none text-[9px] uppercase font-mono text-zinc-500 font-bold bg-[#0F0F10] border border-white/5 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          Interactive Nodes Active (Drag Nodes to Interact)
        </div>
      </div>

      {/* Selected Node Detailed Inspector */}
      {selectedNode ? (
        <div className="p-4 bg-[#0F0F10] border border-[#D4AF37]/20 rounded-2xl animate-fade-in space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
            <span className="text-[#D4AF37]">{selectedNode.isCore ? 'System Core' : 'Memory Payload'}</span>
            <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
              Tag: {selectedNode.tag}
            </span>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed font-medium">
            {selectedNode.content}
          </p>
        </div>
      ) : (
        <div className="p-4 bg-zinc-950/40 border border-dashed border-zinc-900 rounded-2xl text-center">
          <span className="text-[10px] uppercase font-mono text-zinc-650 tracking-wider font-bold">
            Select a vector node inside the graph to inspect memory dimensions
          </span>
        </div>
      )}
    </div>
  );
}
