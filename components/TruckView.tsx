
import React from 'react';
import { Layer, ProcessedSlot } from '../types.ts';
import { ArrowLeftRight, Ruler } from 'lucide-react';

interface Props {
  layers: Layer[];
  maxWidth: number;
  spacing: number;
}

export const TruckView: React.FC<Props> = ({ layers, maxWidth, spacing }) => {
  const scaleX = 2.8;

  return (
    <div className="space-y-12">
      <div className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tighter">Vista Transversal (Corte A-A)</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Geometria Técnica Gerdau — Estabilização de Pirâmide</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-amber-50 px-4 py-2 rounded-full border border-amber-100 flex items-center gap-2">
               <Ruler size={14} className="text-amber-600" />
               <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Base Estabilizada</span>
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2">
               <ArrowLeftRight size={14} className="text-indigo-600" />
               <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Espaçamento {spacing}cm</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto pb-48 flex flex-col items-center custom-scrollbar">
          <div 
            style={{ width: `${maxWidth * scaleX}px` }} 
            className="flex justify-between text-[10px] text-slate-600 font-black mb-6 border-b-2 border-slate-300 pb-2 uppercase tracking-tighter"
          >
            <span>-{maxWidth/2}</span>
            <span>Eixo (0)</span>
            <span>+{maxWidth/2}</span>
          </div>

          {/* Carroceria / Body do Caminhão - pb-0 para encostar a carga no fundo */}
          <div 
            style={{ width: `${maxWidth * scaleX}px` }} 
            className="border-x-[14px] border-b-[28px] border-slate-400 relative bg-[#fcfdfe] min-h-[500px] flex flex-col-reverse items-center px-8 pt-8 pb-0 shadow-inner"
          >
            {layers.map((layer, lIdx) => (
              <div key={lIdx} className="flex flex-col items-center shrink-0 w-full">
                <div style={{ width: `${layer.totalWidth * scaleX}px` }} className="flex justify-center items-end">
                  {layer.slots.map((slot, sIdx) => {
                    const shimHeight = layer.maxHeight - slot.height;
                    return (
                      <React.Fragment key={sIdx}>
                        <div className="flex flex-col items-center">
                          {/* Calçamento Superior - Pontas Retas */}
                          {shimHeight > 0 && (
                            <div 
                              style={{ 
                                width: `${(slot.width * 0.9) * scaleX}px`, 
                                height: `${shimHeight * scaleX}px` 
                              }}
                              className="bg-[#3d2414] border border-black/40 shadow-inner flex items-center justify-center relative z-10"
                            >
                              <span className="text-[7px] font-black text-white uppercase">
                                +{shimHeight.toFixed(1)}
                              </span>
                            </div>
                          )}

                          {/* Feixe Principal - Cinza Metálico / Pontas Retas (sem arredondamento) */}
                          <div 
                            style={{ 
                              width: `${slot.width * scaleX}px`, 
                              height: `${slot.height * scaleX}px` 
                            }}
                            className="relative border-[2.5px] border-slate-600 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 flex flex-col items-center justify-center shrink-0 shadow-md z-20"
                          >
                            <div className="flex flex-col items-center justify-center p-1">
                              <span className="text-[8px] font-black text-black leading-none mb-0.5 truncate w-full text-center">
                                {slot.beams[0].bitola}
                              </span>
                              <span className="text-[7px] font-black text-black/70 uppercase tracking-tighter">P{slot.priority}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Indicador de Espaçamento - Texto em Preto */}
                        {sIdx < layer.slots.length - 1 && (
                          <div 
                            style={{ width: `${spacing * scaleX}px` }}
                            className="flex flex-col items-center justify-center relative h-1"
                          >
                            <div className="w-full border-b border-indigo-500/40 border-dashed"></div>
                            <span className="absolute -top-4 text-[7px] font-black text-black whitespace-nowrap bg-white/80 px-1 z-20">
                              {spacing}cm
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Madeiramento Base da Camada - Reto */}
                <div 
                  style={{ width: `${layer.totalWidth * scaleX}px` }}
                  className="h-4 bg-[#54301d] border-y border-black/30 z-0"
                ></div>
              </div>
            ))}
            
            {/* Rodas Rebaixadas - Imediatamente abaixo do chassi */}
            <div className="absolute -bottom-40 left-12 w-16 h-32 bg-[#0a0a0a] border-x-[10px] border-slate-900 shadow-2xl flex flex-col justify-between py-8">
               {[...Array(6)].map((_, i) => <div key={i} className="h-[1.5px] w-full bg-slate-800/20"></div>)}
            </div>
            <div className="absolute -bottom-40 left-36 w-16 h-32 bg-[#0a0a0a] border-x-[10px] border-slate-900 shadow-2xl flex flex-col justify-between py-8">
               {[...Array(6)].map((_, i) => <div key={i} className="h-[1.5px] w-full bg-slate-800/20"></div>)}
            </div>
            <div className="absolute -bottom-40 right-12 w-16 h-32 bg-[#0a0a0a] border-x-[10px] border-slate-900 shadow-2xl flex flex-col justify-between py-8">
               {[...Array(6)].map((_, i) => <div key={i} className="h-[1.5px] w-full bg-slate-800/20"></div>)}
            </div>
            <div className="absolute -bottom-40 right-36 w-16 h-32 bg-[#0a0a0a] border-x-[10px] border-slate-900 shadow-2xl flex flex-col justify-between py-8">
               {[...Array(6)].map((_, i) => <div key={i} className="h-[1.5px] w-full bg-slate-800/20"></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Planta de Carga (Superior) - Pontas Retas (sem arredondamento) */}
      <div className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100">
        <h3 className="text-lg font-black text-slate-800 tracking-tighter mb-10">Planta de Carga (Superior)</h3>
        <div className="relative w-full overflow-x-auto pb-6 custom-scrollbar">
          <div 
            style={{ width: '900px', minHeight: '450px' }}
            className="mx-auto border-[22px] border-slate-200 relative bg-[#f8fafc] p-10 flex flex-col gap-6 shadow-inner"
          >
            {layers.slice().reverse().map((layer, lIdx) => (
              <div key={lIdx} className="flex flex-col gap-3 bg-white/40 p-6 border border-slate-200 items-center relative">
                <div className="flex items-center justify-between w-full px-2">
                  <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">NÍVEL {layers.length - layer.index}</span>
                  <span className="text-[9px] font-black text-black/70 uppercase">Base Estabilizada: {layer.totalWidth.toFixed(0)}cm</span>
                </div>
                
                <div className="flex flex-col gap-1 w-full items-center">
                  {layer.slots.map((slot, sIdx) => {
                    const hasShim = layer.maxHeight - slot.height > 0;
                    const shimVal = layer.maxHeight - slot.height;
                    return (
                      <React.Fragment key={sIdx}>
                        <div 
                          className={`flex gap-2 shrink-0 h-12 w-full justify-center relative ${hasShim ? 'ring-2 ring-amber-600/20' : ''}`}
                          style={{ maxWidth: `${(slot.width / maxWidth) * 100}%` }}
                        >
                          {slot.isPaired ? (
                            <>
                              <div className="h-full w-1/2 bg-gradient-to-r from-slate-300 to-slate-400 border-[2.5px] border-slate-600 flex items-center justify-center px-2 relative">
                                <span className="text-[8px] text-black font-black truncate">{slot.beams[0].bitola}</span>
                              </div>
                              <div className="h-full w-1/2 bg-gradient-to-r from-slate-300 to-slate-400 border-[2.5px] border-slate-600 flex items-center justify-center px-2 relative">
                                <span className="text-[8px] text-black font-black truncate">{slot.beams[1]?.bitola || slot.beams[0].bitola}</span>
                              </div>
                            </>
                          ) : (
                            <div className="h-full w-full bg-gradient-to-r from-slate-400 to-slate-500 border-[2.5px] border-slate-600 flex items-center justify-center px-4 relative">
                              <span className="text-[9px] text-black font-black tracking-widest uppercase truncate">{slot.beams[0].bitola}</span>
                              {hasShim && (
                                <div className="absolute top-1 right-1 bg-amber-600 text-white px-2 py-0.5 text-[6px] font-black uppercase">
                                  CALÇO {shimVal.toFixed(0)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {sIdx < layer.slots.length - 1 && (
                          <div className="w-full flex items-center justify-center h-2 opacity-50">
                             <div className="w-full border-t border-indigo-600 border-dashed"></div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
