import { useState } from 'react';
import { useTournament } from '../../hooks/useTournament';
import { Match, Player } from '../../types';
import { COLOR_STYLES } from './Teams';

function GoalModal({
  title,
  players,
  onSelect,
  onClose,
}: {
  title: string;
  players: Player[];
  onSelect: (p: Player) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="ir-gradient p-4 rounded-t-2xl">
          <h3 className="text-white font-bold text-lg">⚽ ¿Quién marcó?</h3>
          <p className="text-white/70 text-sm">{title}</p>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ir-blue"
            autoFocus
          />
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ir-light transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-ir-blue text-white text-xs font-black flex items-center justify-center">
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.age} años</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">Sin resultados</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, onFinish }: { match: Match; onFinish: () => void }) {
  const { state, actions } = useTournament();
  const [goalModal, setGoalModal] = useState<'home' | 'away' | null>(null);

  const home = state.teams.find(t => t.id === match.homeTeamId);
  const away = state.teams.find(t => t.id === match.awayTeamId);
  if (!home || !away) return null;

  const homePlayers = state.players.filter(p => home.playerIds.includes(p.id));
  const awayPlayers = state.players.filter(p => away.playerIds.includes(p.id));
  const homeColors = COLOR_STYLES[home.color];
  const awayColors = COLOR_STYLES[away.color];

  function handleGoal(side: 'home' | 'away', player: Player) {
    const teamId = side === 'home' ? match.homeTeamId : match.awayTeamId;
    actions.addGoal(match.id, teamId, player.id, player.name);
    setGoalModal(null);
  }

  const homeGoals = match.goals.filter(g => g.teamId === match.homeTeamId);
  const awayGoals = match.goals.filter(g => g.teamId === match.awayTeamId);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="ir-gradient px-5 py-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-white text-sm font-bold">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            EN VIVO
          </span>
          <span className="text-white/60 text-xs">
            {new Date(match.createdAt).toLocaleDateString('es-ES')}
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-center">
              <div className={`w-14 h-14 ${homeColors.bg} rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto shadow-md`}>
                {home.name.charAt(0)}
              </div>
              <p className="font-bold text-gray-800 mt-2 text-sm leading-tight">{home.name}</p>
            </div>

            <div className="text-center">
              <div className="score-display text-6xl font-black text-ir-dark">
                {match.homeScore} <span className="text-gray-300">–</span> {match.awayScore}
              </div>
            </div>

            <div className="text-center">
              <div className={`w-14 h-14 ${awayColors.bg} rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto shadow-md`}>
                {away.name.charAt(0)}
              </div>
              <p className="font-bold text-gray-800 mt-2 text-sm leading-tight">{away.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setGoalModal('home')}
                className={`${homeColors.bg} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm`}
              >
                ⚽ Gol {home.name}
              </button>
              <button
                onClick={() => actions.removeGoal(match.id, match.homeTeamId)}
                disabled={match.homeScore === 0}
                className="border border-gray-200 text-gray-500 py-2 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
              >
                ↩ Deshacer gol
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setGoalModal('away')}
                className={`${awayColors.bg} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm`}
              >
                ⚽ Gol {away.name}
              </button>
              <button
                onClick={() => actions.removeGoal(match.id, match.awayTeamId)}
                disabled={match.awayScore === 0}
                className="border border-gray-200 text-gray-500 py-2 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
              >
                ↩ Deshacer gol
              </button>
            </div>
          </div>

          {match.goals.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Goleadores</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="space-y-1">
                  {homeGoals.map(g => (
                    <div key={g.id} className="flex items-center gap-1.5 text-sm">
                      <span className="text-xs">⚽</span>
                      <span className="text-gray-700">{g.playerName}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {awayGoals.map(g => (
                    <div key={g.id} className="flex items-center gap-1.5 text-sm justify-end">
                      <span className="text-gray-700">{g.playerName}</span>
                      <span className="text-xs">⚽</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onFinish}
            className="w-full mt-5 bg-ir-dark text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
          >
            🏁 Finalizar Partido
          </button>
        </div>
      </div>

      {goalModal && (
        <GoalModal
          title={goalModal === 'home' ? home.name : away.name}
          players={goalModal === 'home' ? homePlayers : awayPlayers}
          onSelect={p => handleGoal(goalModal, p)}
          onClose={() => setGoalModal(null)}
        />
      )}
    </>
  );
}

export default function MatchTracker() {
  const { state, actions } = useTournament();
  const [confirmFixtures, setConfirmFixtures] = useState(false);

  const liveMatch = state.matches.find(m => m.status === 'live');
  const scheduledMatches = state.matches.filter(m => m.status === 'scheduled');
  const finishedMatches = [...state.matches.filter(m => m.status === 'finished')].reverse();

  const hasFixtures = state.matches.length > 0;
  const allDone = hasFixtures && scheduledMatches.length === 0 && !liveMatch;

  const progress = hasFixtures
    ? Math.round((finishedMatches.length / state.matches.length) * 100)
    : 0;

  function handleFinish(matchId: string) {
    if (confirm('¿Dar por finalizado este partido?')) actions.finishMatch(matchId);
  }

  function handleGenerateFixtures() {
    if (hasFixtures && !confirmFixtures) { setConfirmFixtures(true); return; }
    actions.generateFixtures();
    setConfirmFixtures(false);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ir-dark">⚽ Partido</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona el marcador en tiempo real e introduce los goleadores.</p>
      </div>

      {/* League calendar controls */}
      {state.teams.length >= 2 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-gray-800">Calendario Liga</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {hasFixtures
                  ? `${finishedMatches.length} de ${state.matches.length} partidos jugados`
                  : `${state.teams.length} equipos · ${(state.teams.length * (state.teams.length - 1)) / 2} partidos en total`}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {confirmFixtures && (
                <p className="text-sm text-amber-600 font-medium">¿Regenerar y borrar todos los partidos?</p>
              )}
              <div className="flex gap-2 flex-wrap justify-end">
                {confirmFixtures && (
                  <button
                    onClick={() => setConfirmFixtures(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={handleGenerateFixtures}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    confirmFixtures
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-ir-blue text-white hover:bg-ir-dark'
                  }`}
                >
                  <span>📅</span>
                  {hasFixtures ? (confirmFixtures ? 'Sí, regenerar' : 'Regenerar calendario') : 'Generar calendario'}
                </button>
              </div>
            </div>
          </div>
          {hasFixtures && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progreso de la liga</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ir-blue rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {allDone && (
                <p className="text-sm font-bold text-green-600 mt-2 flex items-center gap-1.5">
                  🏆 ¡Liga completada! Revisa la clasificación final.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* No teams */}
      {state.teams.length < 2 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-3">🧩</div>
          <h3 className="font-bold text-gray-700 text-lg">Sin equipos</h3>
          <p className="text-gray-400 text-sm mt-1">Ve a <strong>Equipos</strong> para generar al menos 2 equipos.</p>
        </div>
      )}

      {/* Live match */}
      {liveMatch && (
        <div className="space-y-2">
          <p className="text-sm font-bold text-red-500 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Partido en curso
          </p>
          <MatchCard match={liveMatch} onFinish={() => handleFinish(liveMatch.id)} />
        </div>
      )}

      {/* Scheduled fixtures */}
      {scheduledMatches.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Pendientes ({scheduledMatches.length})</h2>
            {liveMatch && (
              <span className="text-xs text-gray-400">Finaliza el partido en curso primero</span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {scheduledMatches.map(m => {
              const home = state.teams.find(t => t.id === m.homeTeamId);
              const away = state.teams.find(t => t.id === m.awayTeamId);
              const homeColors = home ? COLOR_STYLES[home.color] : null;
              const awayColors = away ? COLOR_STYLES[away.color] : null;
              return (
                <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 flex items-center justify-end gap-2">
                    {homeColors && <span className={`w-3 h-3 rounded-full ${homeColors.bg}`} />}
                    <span className="font-semibold text-gray-700 text-sm">{home?.name}</span>
                  </div>
                  <div className="text-gray-300 font-black text-sm w-8 text-center">vs</div>
                  <div className="flex-1 flex items-center gap-2">
                    {awayColors && <span className={`w-3 h-3 rounded-full ${awayColors.bg}`} />}
                    <span className="font-semibold text-gray-700 text-sm">{away?.name}</span>
                  </div>
                  <button
                    onClick={() => !liveMatch && actions.startMatch(m.id)}
                    disabled={!!liveMatch}
                    className="px-3 py-1.5 rounded-lg bg-ir-blue text-white text-xs font-bold hover:bg-ir-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    ▶ Iniciar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Finished matches */}
      {finishedMatches.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Resultados ({finishedMatches.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {finishedMatches.map(m => {
              const home = state.teams.find(t => t.id === m.homeTeamId);
              const away = state.teams.find(t => t.id === m.awayTeamId);
              const homeColors = home ? COLOR_STYLES[home.color] : null;
              const awayColors = away ? COLOR_STYLES[away.color] : null;
              const homeWon = m.homeScore > m.awayScore;
              const awayWon = m.awayScore > m.homeScore;
              return (
                <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 flex items-center justify-end gap-2">
                    {homeColors && <span className={`w-3 h-3 rounded-full ${homeColors.bg}`} />}
                    <span className={`font-semibold text-sm ${homeWon ? 'text-ir-dark' : 'text-gray-400'}`}>{home?.name}</span>
                  </div>
                  <div className="font-black text-base w-16 text-center text-ir-dark">
                    {m.homeScore} – {m.awayScore}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    {awayColors && <span className={`w-3 h-3 rounded-full ${awayColors.bg}`} />}
                    <span className={`font-semibold text-sm ${awayWon ? 'text-ir-dark' : 'text-gray-400'}`}>{away?.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {state.teams.length >= 2 && !hasFixtures && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-3">📅</div>
          <h3 className="font-bold text-gray-700 text-lg">Sin calendario generado</h3>
          <p className="text-gray-400 text-sm mt-1">Pulsa "Generar calendario" para crear todos los partidos de la liga</p>
        </div>
      )}
    </div>
  );
}
