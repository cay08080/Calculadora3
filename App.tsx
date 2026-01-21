
import React, { useState, useMemo } from 'react';
import { LoadItem, VehicleType, Config, CalculationResult } from './types.ts';
import { VEHICLE_CONFIGS } from './constants.ts';
import { LoadingEngine } from './services/LoadingEngine.ts';
import { BeamSelector } from './components/BeamSelector.tsx';
import { LoadDashboard } from './components/LoadDashboard.tsx';
import { TruckView } from './components/TruckView.tsx';
import { LayerDetails } from './components/LayerDetails.tsx';
import { LoadReport } from './components/LoadReport.tsx';
import { 
  Trash2, 
  Settings, 
  Building2,
  LayoutGrid,
  ShieldX,
  Info,
  AlertCircle,
  Zap,
  RefreshCw,
  Search,
  ArrowUp,
  ClipboardList
} from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<LoadItem[]>([]);
  const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.CARRETA);
  const [woodHeight, setWoodHeight] = useState(8.5);
  const [gap, setGap] = useState<number | null>(0);
  const [enableHeightLimit, setEnableHeightLimit] = useState(true);
  const [maxHeightLimit, setMaxHeightLimit] = useState(350);
  
  const [calculatedResult, setCalculatedResult] = useState<CalculationResult | null>(null);
  const [isStale, setIsStale] = useState(false);

  const config: Config = useMemo(() => ({
    vehicleType: vehicle,
    maxWidth: VEHICLE_CONFIGS[vehicle],
    woodHeight,
    fixedGap: gap,
    enableHeightLimit,
    maxHeightLimit
  }), [vehicle, woodHeight, gap, enableHeightLimit, maxHeightLimit]);

  const handleAddItem = (item: LoadItem) => {
    setItems(prev => [...prev, item]);
    setIsStale(true);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setIsStale(true);
  };

  const handleClear = () => {
    if (window.confirm("Deseja realmente limpar toda a composição da carga?")) {
      setItems([]);
      setCalculatedResult(null);
      setIsStale(false);
    }
  };

  const handleCalculate = () => {
    const result = LoadingEngine.calculate(items, config);
    setCalculatedResult(result);
    setIsStale(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc] selection:bg-blue-100">
      <header className="bg-[#0033a0] text-white py-5 px-8 shadow-xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b border-white/10 print:hidden">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="bg-white p-2.5 rounded-lg shadow-inner flex items-center justify-center">
               <Building2 className="text-[#0033a0]" size={28} />
            </div>
            <div className="border-l border-white/20 pl-5">
              <h1 className="text-2xl font-black tracking-tighter leading-none">GERDAU</h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-80 mt-1.5">Logística de Perfis</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-60">
              <LayoutGrid size={14} />
              <span>Plataforma de Precisão v5.2</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto mt-10 px-8 print:mt-0 print:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8 print:hidden">
            <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-slate-400 mb-0 flex items-center gap-3 uppercase tracking-[0.2em]">
                  <Settings size={18} className="text-blue-600" />
                  Parâmetros de Carga
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-wider">Veículo Transportador</label>
                  <select 
                    value={vehicle}
                    onChange={(e) => {
                      setVehicle(e.target.value as VehicleType);
                      setIsStale(true);
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  >
                    <option value={VehicleType.CARRETA}>🚚 CARRETA (240cm)</option>
                    <option value={VehicleType.VAGAO_2M40}>🚃 VAGÃO (240cm)</option>
                    <option value={VehicleType.VAGAO_2M70}>🚃 VAGÃO (270cm)</option>
                    <option value={VehicleType.VAGAO_3M}>🚃 VAGÃO (300cm)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-wider">Madeira Base (cm)</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      value={woodHeight} 
                      onChange={(e) => {
                        setWoodHeight(Number(e.target.value));
                        setIsStale(true);
                      }} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-wider">Espaçamento (cm)</label>
                    <input 
                      type="number" 
                      value={gap || 0} 
                      onChange={(e) => {
                        setGap(e.target.value ? Number(e.target.value) : 0);
                        setIsStale(true);
                      }} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none" 
                      placeholder="0" 
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={enableHeightLimit}
                          onChange={(e) => {
                            setEnableHeightLimit(e.target.checked);
                            setIsStale(true);
                          }}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${enableHeightLimit ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${enableHeightLimit ? 'translate-x-5' : ''}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Restrição de Altura</span>
                    </label>
                    {enableHeightLimit && (
                      <div className="flex items-center gap-2">
                         <ArrowUp size={12} className="text-blue-500" />
                         <span className="text-[10px] font-black text-blue-600 uppercase">3.5m Ativo</span>
                      </div>
                    )}
                  </div>
                  <div className={`transition-all ${enableHeightLimit ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={maxHeightLimit} 
                        onChange={(e) => {
                          setMaxHeightLimit(Number(e.target.value));
                          setIsStale(true);
                        }} 
                        className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none" 
                      />
                      <span className="text-[10px] font-black text-slate-400 uppercase">cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <BeamSelector onAdd={handleAddItem} />

            <button
              disabled={items.length === 0}
              onClick={handleCalculate}
              className={`w-full py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95
                ${items.length === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 
                  isStale ? 'bg-emerald-600 text-white shadow-emerald-200 animate-pulse' : 'bg-[#0033a0] text-white shadow-blue-200 hover:brightness-110'}`}
            >
              {isStale ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
              {calculatedResult ? 'Refazer Cálculo Sistêmico' : 'Gerar Plano de Engenharia'}
            </button>

            {calculatedResult && (
              <div className="space-y-6">
                {calculatedResult.errors.map((e, idx) => (
                  <div key={idx} className="bg-red-600 p-8 rounded-3xl text-white space-y-4 shadow-xl border-2 border-white/20">
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em]">
                      <ShieldX size={22} className="animate-bounce" />
                      RECUSA DE CARGA
                    </div>
                    <p className="text-[11px] font-black leading-relaxed">{e}</p>
                  </div>
                ))}
                
                {calculatedResult.warnings.map((w, idx) => (
                  <div key={idx} className="bg-amber-600 p-8 rounded-3xl text-white space-y-4 shadow-xl border-2 border-white/20">
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em]">
                      <AlertCircle size={22} className="animate-pulse" />
                      REVISÃO TÉCNICA
                    </div>
                    <p className="text-[11px] font-bold leading-relaxed">{w}</p>
                  </div>
                ))}

                <div className="bg-slate-800 p-8 rounded-3xl text-white space-y-4 shadow-lg">
                  <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] opacity-50">
                    <Info size={16} />
                    Logs de Engenharia
                  </div>
                  <ul className="space-y-3">
                    {calculatedResult.engineeringNotes.map((note, idx) => (
                      <li key={idx} className="text-[10px] font-medium opacity-80 border-l border-white/20 pl-4">{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-12">
            {calculatedResult ? (
              <>
                <div className={isStale ? 'opacity-40 grayscale pointer-events-none transition-all blur-[2px]' : 'transition-all'}>
                  <LoadDashboard result={calculatedResult} maxWidth={config.maxWidth} spacing={gap || 0} />
                  <TruckView layers={calculatedResult.layers} maxWidth={config.maxWidth} spacing={gap || 0} />
                  <div className="mt-12">
                    <LayerDetails layers={calculatedResult.layers} />
                  </div>
                  <div className="mt-12">
                    <LoadReport result={calculatedResult} config={config} />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[56px] py-64 text-center flex flex-col items-center gap-10 print:hidden">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
                  <Search size={48} className="text-slate-200" />
                </div>
                <div>
                  <h4 className="font-black text-3xl text-slate-300 uppercase tracking-tighter">Engenharia em Espera</h4>
                  <p className="text-slate-400 text-sm font-medium mt-3 max-w-sm mx-auto leading-relaxed">
                    Ajuste o espaçamento obrigatório e inclua os materiais para visualização técnica.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden print:hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <ClipboardList className="text-blue-600" size={20} />
                  Lista de Feixes
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] shadow-lg shadow-blue-100">{items.length}</span>
                </h3>
                {items.length > 0 && (
                  <button onClick={handleClear} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-2 group transition-all">
                    <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                    Limpar
                  </button>
                )}
              </div>
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {items.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-slate-100">
                      <tr>
                        <th className="px-10 py-6">Bitola</th>
                        <th className="px-10 py-6">Comprimento</th>
                        <th className="px-10 py-6 text-center">Entrega</th>
                        <th className="px-10 py-6 text-center">Qtd</th>
                        <th className="px-10 py-6 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                          <td className="px-10 py-7">
                            <div className="font-black text-slate-700 tracking-tighter">{item.bitola}</div>
                          </td>
                          <td className="px-10 py-7">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                              {item.length} Metros
                            </span>
                          </td>
                          <td className="px-10 py-7 text-center font-black text-slate-500">P{item.priority}</td>
                          <td className="px-10 py-7 text-center font-black text-xl text-slate-800 tracking-tighter">{item.quantity}</td>
                          <td className="px-10 py-7 text-right">
                            <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-600 transition-all p-3">
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-32 text-center flex flex-col items-center gap-4">
                    <ClipboardList className="text-slate-200" size={40} />
                    <p className="text-slate-300 font-black uppercase text-[11px] tracking-[0.4em]">Inventário Vazio</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
