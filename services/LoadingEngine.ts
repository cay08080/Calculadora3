import { 
  Beam, 
  LoadItem, 
  Config, 
  CalculationResult, 
  ProcessedSlot, 
  Layer 
} from '../types.ts';
import { BEAM_CATALOG } from '../constants.ts';

export class LoadingEngine {
  private static MAX_SHIM_HEIGHT = 15; 

  static calculate(items: LoadItem[], config: Config): CalculationResult {
    if (items.length === 0) {
      return { layers: [], totalWeight: 0, totalHeight: 0, maxWidthUsed: 0, errors: [], warnings: [], engineeringNotes: [] };
    }

    const engineeringNotes: string[] = ["Iniciando processamento de física de carga v7.2"];
    const warnings: string[] = [];
    const errors: string[] = [];
    const mandatorySpacing = config.fixedGap || 0;

    let pool = this.flattenItemsToSlots(items);
    
    // Ordenação primária por prioridade (LIFO)
    pool.sort((a, b) => b.priority - a.priority);

    let layers = this.buildLayers(pool, config, mandatorySpacing);

    // REGRA DE OURO: Estabilização de Pirâmide (Base >= Topo)
    // Varredura reversa (do topo para a base) para garantir que a largura se propague para baixo
    for (let i = layers.length - 2; i >= 0; i--) {
      const currentLayer = layers[i];
      const layerAbove = layers[i + 1];

      if (layerAbove.totalWidth > currentLayer.totalWidth) {
        const diff = layerAbove.totalWidth - currentLayer.totalWidth;
        currentLayer.totalWidth = layerAbove.totalWidth;
        engineeringNotes.push(`Nível ${currentLayer.index + 1}: Base expandida em ${diff.toFixed(0)}cm para estabilizar o Nível ${layerAbove.index + 1}.`);
      }
    }

    let totalWeight = 0;
    let totalHeight = 0;
    let maxWidthUsed = 0;

    layers.forEach((layer) => {
      totalWeight += layer.slots.reduce((s, slot) => s + slot.weight, 0);
      totalHeight += layer.maxHeight + config.woodHeight;
      if (layer.totalWidth > maxWidthUsed) maxWidthUsed = layer.totalWidth;
    });

    // Validação de Limite de Altura
    if (config.enableHeightLimit && totalHeight > config.maxHeightLimit) {
      errors.push(`BLOQUEIO DE SEGURANÇA: Carga acima do limite de altura (${totalHeight.toFixed(1)}cm > ${config.maxHeightLimit}cm)! Favor fazer a recusa.`);
    }

    return {
      layers,
      totalWeight,
      totalHeight,
      maxWidthUsed,
      errors,
      warnings,
      engineeringNotes
    };
  }

  private static buildLayers(pool: ProcessedSlot[], config: Config, spacing: number): Layer[] {
    let layers: Layer[] = [];
    let remainingPool = [...pool];

    while (remainingPool.length > 0) {
      let currentLayerSlots: ProcessedSlot[] = [];
      let currentWidth = 0;
      let i = 0;

      while (i < remainingPool.length) {
        const slot = remainingPool[i];
        const requiredWidth = currentLayerSlots.length === 0 ? slot.width : spacing + slot.width;
        
        const fitsWidth = (currentWidth + requiredWidth) <= config.maxWidth;
        
        let fitsHeight = true;
        if (currentLayerSlots.length > 0) {
          const maxHeight = Math.max(...currentLayerSlots.map(s => s.height), slot.height);
          const minHeight = Math.min(...currentLayerSlots.map(s => s.height), slot.height);
          if (maxHeight - minHeight > this.MAX_SHIM_HEIGHT) fitsHeight = false;
        }

        if (fitsWidth && fitsHeight) {
          currentLayerSlots.push(slot);
          currentWidth += requiredWidth;
          remainingPool.splice(i, 1);
        } else {
          i++;
        }
      }

      if (currentLayerSlots.length > 0) {
        layers.push(this.createLayer(layers.length, currentLayerSlots, spacing));
      } else {
        const item = remainingPool.shift()!;
        layers.push(this.createLayer(layers.length, [item], spacing));
      }
    }
    return layers;
  }

  private static flattenItemsToSlots(items: LoadItem[]): ProcessedSlot[] {
    const slots: ProcessedSlot[] = [];
    items.filter(i => i.length === 12).forEach(item => {
      const beam = BEAM_CATALOG.find(b => b.id === item.beamId)!;
      for (let i = 0; i < item.quantity; i++) {
        slots.push({
          width: beam.width, height: beam.height, weight: beam.weight12m, priority: item.priority,
          isPaired: false, beams: [{ bitola: beam.bitola, length: 12, weight: beam.weight12m }]
        });
      }
    });
    const items6m = items.filter(i => i.length === 6);
    const grouped6m: Record<string, LoadItem[]> = {};
    items6m.forEach(item => {
      const key = `${item.priority}_${item.beamId}`;
      if (!grouped6m[key]) grouped6m[key] = [];
      grouped6m[key].push(item);
    });
    for (const key in grouped6m) {
      const group = grouped6m[key];
      const beam = BEAM_CATALOG.find(b => b.id === group[0].beamId)!;
      let totalQty = group.reduce((sum, item) => sum + item.quantity, 0);
      while (totalQty >= 2) {
        slots.push({
          width: beam.width, height: beam.height, weight: beam.weight12m, priority: group[0].priority,
          isPaired: true, beams: [
            { bitola: beam.bitola, length: 6, weight: beam.weight12m / 2 },
            { bitola: beam.bitola, length: 6, weight: beam.weight12m / 2 }
          ]
        });
        totalQty -= 2;
      }
      if (totalQty === 1) {
        slots.push({
          width: beam.width, height: beam.height, weight: beam.weight12m / 2, priority: group[0].priority,
          isPaired: false, beams: [{ bitola: beam.bitola, length: 6, weight: beam.weight12m / 2 }]
        });
      }
    }
    return slots;
  }

  private static createLayer(index: number, slots: ProcessedSlot[], spacing: number): Layer {
    const itemsWidth = slots.reduce((acc, s) => acc + s.width, 0);
    const gapsWidth = Math.max(0, slots.length - 1) * spacing;
    const totalWidth = itemsWidth + gapsWidth;
    
    const heights = slots.map(s => s.height);
    const maxHeight = Math.max(...heights);
    const minHeight = Math.min(...heights);
    return { index, slots, totalWidth, maxHeight, minHeight, heightDiff: maxHeight - minHeight,
      priority: slots.length > 0 ? Math.min(...slots.map(s => s.priority)) : 1
    };
  }
}