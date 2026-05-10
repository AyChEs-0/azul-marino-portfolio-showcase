import { useState } from 'react';
import { useTournament } from '../../hooks/useTournament';
import { getTeamAverageAge } from '../../utils/teamGenerator';
import { TeamColor } from '../../types';

const COLOR_STYLES: Record<TeamColor, { bg: string; text: string; light: string }> = {
  red:    { bg: 'bg-red-500',    text: 'text-red-500',    light: 'bg-red-50' },
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-500',   light: 'bg-blue-50' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-500',   light: 'bg-pink-50' },
  cyan:   { bg: 'bg-cyan-500',   text: 'text-cyan-500',   light: 'bg-cyan-50' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-50' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50' },
};

export { COLOR_STYLES };

export default function Teams() {
  const { state, actions } = useTournament();
  const [teamSize, setTeamSize] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [manualEdit, setManualEdit] = useState(false);

  const numTeams = Math.floor(state.players.length / teamSize);
  const canGenerate = numTeams >= 2;
  const hasTeams = state.teams.length > 0;

  function startEdit(id: string, name: string) {
    setEditingId(id);
    setEditName(name);
  }

  function saveEdit(id: string) {
    if (editName.trim()) actions.renameTeam(id, editName.trim());
    setEditingId(null);
  }

  function handleGenerate() {
    if (hasTeams && !confirmRegen) { setConfirmRegen(true); return; }
    actions.generateTeams(teamSize);
    setConfirmRegen(false);
    setManualEdit(false);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ir-dark">🧩 Equipos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Los equipos se generan automáticamente equilibrando las edades de los jugadores.
        </p>
      </div>

      {/* Controls bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Jugadores por equipo:</label>
              <div className="flex gap-1.5">
                {[3, 4, 5, 6, 7, 8].map(n => (
                  <button
                    key={n}
                    onClick={() => { setTeamSize(n); setConfirmRegen(false); }}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      teamSize === n
                        ? 'bg-ir-blue text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-ir-light hover:text-ir-dark'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {canGenerate
                ? `${state.players.length} jugadores → ${numTeams} equipos de ${teamSize}`
                : `Necesitas al menos ${teamSize * 2} jugadores para ${teamSize}vs${teamSize} (tienes ${state.players.length})`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {confirmRegen && (
              <p className="text-sm text-amber-600 font-medium">¿Regenerar y perder los equipos actuales?</p>
            )}
            <div className="flex gap-2 flex-wrap justify-end">
              {confirmRegen && (
                <button
                  onClick={() => setConfirmRegen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  canGenerate
                    ? confirmRegen
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-ir-blue text-white hover:bg-ir-dark'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>🎲</span>
                {hasTeams ? (confirmRegen ? 'Sí, regenerar' : 'Regenerar') : 'Generar Equipos'}
              </button>
              {hasTeams && (
                <button
                  onClick={() => setManualEdit(v => !v)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    manualEdit
                      ? 'bg-ir-dark text-white'
                      : 'border-2 border-ir-dark text-ir-dark hover:bg-ir-light'
                  }`}
                >
                  <span>{manualEdit ? '✓' : '✏️'}</span>
                  {manualEdit ? 'Guardar cambios' : 'Editar manualmente'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {manualEdit && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
          <span>✏️</span>
          <span><strong>Modo edición activo</strong> — usa el desplegable junto a cada jugador para moverlo a otro equipo.</span>
        </div>
      )}

      {!hasTeams ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-3">🧩</div>
          <h3 className="font-bold text-gray-700 text-lg">Sin equipos generados</h3>
          <p className="text-gray-400 text-sm mt-1">
            {canGenerate ? 'Pulsa "Generar Equipos" para crear los equipos' : `Primero registra al menos ${teamSize * 2} jugadores`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.teams.map(team => {
            const colors = COLOR_STYLES[team.color];
            const players = state.players.filter(p => team.playerIds.includes(p.id));
            const avgAge = getTeamAverageAge(team, state.players);
            const isRenamingThis = editingId === team.id;
            const otherTeams = state.teams.filter(t => t.id !== team.id);

            return (
              <div key={team.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
                {/* Team header */}
                <div className={`${colors.bg} p-4 text-white`}>
                  <div className="flex items-center justify-between gap-2">
                    {isRenamingThis ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          className="bg-white/20 text-white placeholder-white/60 border border-white/40 rounded-lg px-3 py-1 text-base font-bold flex-1 focus:outline-none focus:ring-2 focus:ring-white/50"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEdit(team.id)}
                          autoFocus
                        />
                        <button onClick={() => saveEdit(team.id)} className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 text-sm font-bold transition-colors">✓</button>
                        <button onClick={() => setEditingId(null)} className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 text-sm transition-colors">✕</button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-black text-xl">{team.name}</h3>
                        <button
                          onClick={() => startEdit(team.id, team.name)}
                          className="bg-white/20 hover:bg-white/30 rounded-lg p-1.5 transition-colors"
                          title="Renombrar equipo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    {players.length} jugadores · Media: {avgAge} años
                  </p>
                </div>

                {/* Players list */}
                <div className="divide-y divide-gray-50">
                  {players
                    .sort((a, b) => b.age - a.age)
                    .map((player, idx) => (
                      <div key={player.id} className={`flex items-center gap-3 px-4 py-2.5 ${manualEdit ? 'bg-amber-50/40' : ''}`}>
                        <span className={`w-6 h-6 rounded-full ${colors.light} ${colors.text} text-xs font-black flex items-center justify-center flex-shrink-0`}>
                          {idx + 1}
                        </span>
                        <span className="flex-1 font-medium text-gray-800 text-sm truncate">{player.name}</span>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {player.age}a
                        </span>
                        {manualEdit && otherTeams.length > 0 && (
                          <select
                            defaultValue=""
                            onChange={e => {
                              if (e.target.value) {
                                actions.movePlayer(player.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs border border-amber-300 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                            title="Mover a equipo"
                          >
                            <option value="" disabled>Mover →</option>
                            {otherTeams.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  {players.length === 0 && (
                    <div className="px-4 py-4 text-center text-gray-400 text-sm">Sin jugadores asignados</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasTeams && (
        <div className="bg-ir-light rounded-xl p-4 text-sm text-ir-dark">
          <strong>📊 Método:</strong> Los jugadores se ordenan por edad y se distribuyen en rondas alternas (draft en serpiente), garantizando que ningún equipo concentre los más jóvenes ni los más mayores.
        </div>
      )}
    </div>
  );
}
