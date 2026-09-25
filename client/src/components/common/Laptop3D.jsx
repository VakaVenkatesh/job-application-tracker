import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTrendingUp, FiZap, FiTerminal } from 'react-icons/fi';

export default function Laptop3D() {
  const [rotation, setRotation] = useState({ x: 12, y: -22 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setRotation((prev) => ({
      x: Math.max(-30, Math.min(35, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4,
    }));
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;
    setRotation((prev) => ({
      x: Math.max(-30, Math.min(35, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4,
    }));
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div
      className="relative w-full max-w-[580px] h-[460px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{ perspective: 1200 }}
    >
      {/* Ambient background glow behind 3D laptop */}
      <div className="absolute inset-0 bg-radial from-[#00f5a0]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Floating 360 Rotation Control Tooltip */}
      <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-[#0d1615]/80 border border-[#00f5a0]/30 text-[11px] font-mono text-[#00f5a0] flex items-center gap-1.5 backdrop-blur-md z-20 shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
        <span>360° Rotatable • Drag to Rotate</span>
      </div>

      {/* 3D Transform Container */}
      <motion.div
        className="relative w-[440px] h-[300px] transition-transform ease-out"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ================= LAPTOP SCREEN (LID) ================= */}
        <div
          className="absolute -top-[140px] left-[20px] w-[400px] h-[260px] rounded-xl bg-gradient-to-b from-[#162220] via-[#0b1211] to-[#050908] p-3 border-2 border-[#00f5a0]/30 shadow-[0_0_50px_rgba(0,245,160,0.2)] flex flex-col justify-between"
          style={{
            transform: 'rotateX(-15deg) translateZ(30px)',
            transformOrigin: 'bottom center',
            boxShadow: '0 0 35px rgba(0, 245, 160, 0.25), inset 0 0 15px rgba(0, 245, 160, 0.1)',
          }}
        >
          {/* Top Bezel Camera */}
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-[#00f5a0]/80" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20" />
            <span className="text-[9px] font-mono text-gray-500">PRO_JOB_OS v4.2</span>
          </div>

          {/* Screen Content Interface */}
          <div className="flex-1 rounded-lg bg-[#040807] border border-[#00f5a0]/20 p-2.5 flex flex-col gap-2 overflow-hidden shadow-inner">
            {/* Top Hunter Status Bar */}
            <div className="flex items-center justify-between border-b border-[#00f5a0]/15 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40">
                  S-RANK MONARCH
                </span>
                <span className="text-[10px] font-mono text-white font-semibold">LVL 42</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-[#00f5a0] font-mono">
                <FiZap className="w-3 h-3 text-[#00f5a0]" /> 98% Match Rate
              </div>
            </div>

            {/* Pipeline Stage Cards Mini-Preview */}
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
              <div className="p-1.5 rounded bg-[#0b1815] border border-[#00f5a0]/20">
                <p className="text-gray-400 text-[8px]">APPLIED</p>
                <p className="text-[#00f5a0] font-bold text-[11px]">28</p>
              </div>
              <div className="p-1.5 rounded bg-[#0b1815] border border-cyan-500/20">
                <p className="text-gray-400 text-[8px]">ROUNDS</p>
                <p className="text-cyan-400 font-bold text-[11px]">6 Active</p>
              </div>
              <div className="p-1.5 rounded bg-[#0b1815] border border-purple-500/20">
                <p className="text-gray-400 text-[8px]">OFFERS</p>
                <p className="text-purple-400 font-bold text-[11px]">2 Ready</p>
              </div>
            </div>

            {/* Live Job Activity Pulse */}
            <div className="flex-1 flex flex-col gap-1 justify-center bg-[#070d0c] rounded p-2 border border-[#00f5a0]/10">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-white font-medium flex items-center gap-1">
                  <FiTrendingUp className="w-2.5 h-2.5 text-[#00f5a0]" /> Stripe • Staff Engineer
                </span>
                <span className="text-[8px] text-[#00f5a0] bg-[#00f5a0]/10 px-1 rounded">Next: Final Round</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                <div className="bg-[#00f5a0] h-1 rounded-full w-[85%] animate-pulse" />
              </div>
              <p className="text-[8px] text-gray-400 flex items-center gap-1 font-mono">
                <FiCheckCircle className="w-2 h-2 text-[#00f5a0]" /> Match Score 94% • 0 Missing Skills
              </p>
            </div>
          </div>
        </div>

        {/* ================= LAPTOP KEYBOARD BASE ================= */}
        <div
          className="absolute top-[100px] left-0 w-[440px] h-[190px] rounded-2xl bg-gradient-to-b from-[#1a2825] via-[#0f1917] to-[#070c0b] p-4 border-2 border-[#00f5a0]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between"
          style={{
            transform: 'rotateX(65deg) translateZ(0px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(0, 245, 160, 0.15)',
          }}
        >
          {/* Glowing Backlit Keyboard Grid */}
          <div className="grid grid-cols-12 gap-1 p-2 bg-[#060b0a] rounded-lg border border-[#00f5a0]/20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="h-3 rounded-[2px] bg-[#12221e] border border-[#00f5a0]/30 shadow-[0_0_4px_rgba(0,245,160,0.2)] flex items-center justify-center text-[5px] text-[#00f5a0]/70 font-mono"
              >
                •
              </div>
            ))}
            {/* Spacebar */}
            <div className="col-span-6 col-start-4 h-3 rounded-[2px] bg-[#00f5a0]/20 border border-[#00f5a0]/60 shadow-[0_0_8px_rgba(0,245,160,0.5)]" />
          </div>

          {/* Glowing Glass Trackpad */}
          <div className="self-center w-28 h-10 rounded-md bg-[#0a1312] border border-[#00f5a0]/40 shadow-inner flex items-center justify-center">
            <span className="w-4 h-0.5 rounded-full bg-[#00f5a0]/40" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
