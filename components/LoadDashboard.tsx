
import React from 'react';
import { CalculationResult } from '../types.ts';
import { Weight, Maximize2, MoveVertical, ShieldCheck, ShieldAlert, ArrowLeftRight } from 'lucide-react';

interface Props {
  result: CalculationResult;
  maxWidth: number;
  spacing: number;
}

export const LoadDashboard: React.FC<Props> = ({ result, maxWidth, spacing }) => {
  const utilization = (result.maxWidthUsed / maxWidth) * 100;
  const isSafe = result.errors.length === 0 && result.layers.length > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Weight size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Massa</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{(result.totalWeight * 1000).toLocaleString('pt-BR')} <span className="text-sm font-bold text-slate-400">kg</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{result.totalWeight.toFixed(3)} toneladas</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Maximize2 size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Largura</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{result.maxWidthUsed.toFixed(0)} <span className="text-sm font-bold text-slate-400">cm</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Uso: {utilization.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <MoveVertical size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Altura</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{result.totalHeight.toFixed(1)} <span className="text-sm font-bold text-slate-400">cm</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{result.layers.length} níveis</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ArrowLeftRight size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Espaçamento</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{spacing.toFixed(0)} <span className="text-sm font-bold text-slate-400">cm</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Restrição lateral</p>
        </div>
      </div>
    </div>
  );
};
