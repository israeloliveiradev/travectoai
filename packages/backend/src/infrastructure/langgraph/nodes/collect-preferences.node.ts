import { TravectoStateType } from '../travecto-graph-state.js';

export async function collectPreferencesNode(
  state: TravectoStateType
): Promise<Partial<TravectoStateType>> {
  const prefs = state.preferences;
  if (!prefs) {
    throw new Error('Preferências de viagem não fornecidas para o nó collect_preferences.');
  }

  const log = `[collect_preferences] Destino validado: ${prefs.destination} | Dias: ${prefs.days} | Orçamento: ${prefs.budget.format()} (${prefs.budget.tier}) | Estilo: ${prefs.style.type} (${prefs.style.pace})`;

  return {
    currentStep: 'collect_preferences',
    stepLogs: [log],
  };
}

