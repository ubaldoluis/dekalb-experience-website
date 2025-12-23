/**
 * Product filtering logic with conditional Maíz/Colza logic
 */

import type { Producto, FilterState, TipoSemilla, UsoMaiz, ZonaGeografica, ProteccionCultivo } from '../types';

/**
 * Filter products based on filter state
 * CRITICAL: Conditional logic for Maíz vs Colza
 */
export function filterProducts(products: Producto[], filterState: FilterState): Producto[] {
  let filtered = [...products];

  // Debug: Log filter state
  console.log('🔍 filterProducts - Filter State:', JSON.stringify(filterState, null, 2));
  console.log('🔍 filterProducts - Products count:', products.length);

  // Always filter by tipoSemilla if selected
  if (filterState.tipoSemilla) {
    console.log('🔍 Filtering by tipoSemilla:', filterState.tipoSemilla);
    filtered = filtered.filter(
      (product) => {
        const matches = product.tipo_semilla === filterState.tipoSemilla;
        console.log(`  Product ${product.nombre}: tipo_semilla=${product.tipo_semilla}, matches=${matches}`);
        return matches;
      }
    );
    console.log('🔍 After tipoSemilla filter:', filtered.length);
  }

  // If Maíz is selected, apply uso and zona filters
  if (filterState.tipoSemilla === 'maiz') {
    if (filterState.uso) {
      filtered = filtered.filter(
        (product) => product.uso === filterState.uso
      );
    }

    if (filterState.zona) {
      filtered = filtered.filter((product) => {
        const zones = Array.isArray(product.zona)
          ? product.zona
          : product.zona
          ? [product.zona]
          : [];
        return zones.includes(filterState.zona as ZonaGeografica);
      });
    }
  }

  // If Colza is selected, uso and zona are ignored (not applicable)

  // Always filter by proteccion (unless "todos")
  if (filterState.proteccion && filterState.proteccion !== 'todos') {
    filtered = filtered.filter(
      (product) => product.proteccion === filterState.proteccion
    );
  }

  // Sort by orden if available
  filtered.sort((a, b) => {
    const ordenA = a.orden ?? 999;
    const ordenB = b.orden ?? 999;
    return ordenA - ordenB;
  });

  return filtered;
}

/**
 * Get default filter state
 */
export function getDefaultFilterState(): FilterState {
  return {
    proteccion: 'todos',
  };
}

/**
 * Check if filter state is valid
 */
export function isValidFilterState(state: FilterState): boolean {
  // If tipoSemilla is colza, uso and zona should not be set
  if (state.tipoSemilla === 'colza') {
    return !state.uso && !state.zona;
  }
  return true;
}

/**
 * Sync filter state with URL search params
 */
export function filterStateToSearchParams(state: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  
  if (state.tipoSemilla) {
    params.set('tipo', state.tipoSemilla);
  }
  if (state.uso) {
    params.set('uso', state.uso);
  }
  if (state.zona) {
    params.set('zona', state.zona);
  }
  if (state.proteccion && state.proteccion !== 'todos') {
    params.set('proteccion', state.proteccion);
  }
  
  return params;
}

/**
 * Parse filter state from URL search params
 */
export function searchParamsToFilterState(params: URLSearchParams): FilterState {
  const state: FilterState = {
    proteccion: (params.get('proteccion') as ProteccionCultivo) || 'todos',
  };

  const tipoParam = params.get('tipo');
  console.log('🔍 searchParamsToFilterState - tipo param:', tipoParam);
  if (tipoParam === 'maiz' || tipoParam === 'colza') {
    state.tipoSemilla = tipoParam as TipoSemilla;
    console.log('🔍 searchParamsToFilterState - tipoSemilla set to:', state.tipoSemilla);
  }

  const usoParam = params.get('uso');
  if (usoParam && (usoParam === 'grano' || usoParam === 'silo' || usoParam === 'preceon')) {
    state.uso = usoParam as UsoMaiz;
  }

  const zonaParam = params.get('zona');
  if (zonaParam) {
    state.zona = zonaParam as ZonaGeografica;
  }

  console.log('🔍 searchParamsToFilterState - Final state:', JSON.stringify(state, null, 2));
  return state;
}

