import { useState, useRef } from 'react';
import { useTournament } from '../../hooks/useTournament';

interface CsvRow { name: string; age: number }

function parseCSV(text: string): { rows: CsvRow[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  const rows: CsvRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    // Skip header line if it contains "nombre" or "name"
    if (i === 0 && /nombre|name|jugador|player/i.test(raw)) continue;

    // Support comma or semicolon separator
    const sep = raw.includes(';') ? ';' : ',';
    const parts = raw.split(sep).map(p => p.trim().replace(/^["']|["']$/g, ''));

    if (parts.length < 2) {
      errors.push(`Línea ${i + 1}: formato incorrecto — "${raw}"`);
      continue;
    }

    const name = parts[0];
    const age = parseInt(parts[1]);

    if (!name) { errors.push(`Línea ${i + 1}: nombre vacío`); continue; }
    if (isNaN(age) || age < 5 || age > 80) { errors.push(`Línea ${i + 1}: edad inválida ("${parts[1]}")`); continue; }

    rows.push({ name, age });
  }

  return { rows, errors };
}

function CsvImport({ onImport }: { onImport: (rows: CsvRow[]) => { imported: number; skipped: number } }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<CsvRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleText(value: string) {
    setText(value);
    setResult(null);
    if (value.trim()) {
      const { rows, errors } = parseCSV(value);
      setPreview(rows);
      setParseErrors(errors);
    } else {
      setPreview([]);
      setParseErrors([]);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleText(ev.target?.result as string ?? '');
    reader.readAsText(file, 'UTF-8');
  }

  function handleImport() {
    const res = onImport(preview);
    setResult(res);
    setPreview([]);
    setParseErrors([]);
    setText('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleClose() {
    setOpen(false);
    setText('');
    setPreview([]);
    setParseErrors([]);
    setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 bg-ir-light rounded-xl flex items-center justify-center text-lg">📂</span>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">Importar desde CSV</p>
            <p className="text-xs text-gray-400">Sube un archivo o pega el contenido</p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-6 space-y-4">
          <div className="bg-ir-light rounded-xl p-3 text-xs text-ir-dark font-mono">
            <p className="font-bold mb-1 font-sans">Formato esperado (nombre,edad):</p>
            <p>nombre,edad</p>
            <p>Juan García,25</p>
            <p>María López,30</p>
            <p className="font-sans text-ir-dark/70 mt-1">También acepta punto y coma ( ; ) como separador.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subir archivo .csv</label>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-ir-blue file:text-white hover:file:bg-ir-dark cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O pega el contenido aquí</label>
            <textarea
              value={text}
              onChange={e => handleText(e.target.value)}
              placeholder={'nombre,edad\nJuan García,25\nMaría López,30'}
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ir-blue resize-none"
            />
          </div>

          {parseErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-red-600">⚠️ Líneas con error (se omitirán):</p>
              {parseErrors.map((e, i) => <p key={i} className="text-xs text-red-500">{e}</p>)}
            </div>
          )}

          {preview.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2">
                <span className="text-xs font-bold text-gray-600">Vista previa — {preview.length} jugadores</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                {preview.map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="font-medium text-gray-800">{row.name}</span>
                    <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{row.age} años</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
              ✅ <strong>{result.imported}</strong> jugadores importados
              {result.skipped > 0 && <span className="text-gray-500"> · {result.skipped} omitidos (nombre duplicado)</span>}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={preview.length === 0}
              className="bg-ir-blue text-white font-bold px-5 py-2.5 rounded-xl hover:bg-ir-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              ⬆ Importar {preview.length > 0 ? `${preview.length} jugadores` : ''}
            </button>
            <button onClick={handleClose} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Players() {
  const { state, actions } = useTournament();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    const ageNum = parseInt(age);

    if (!trimmed) return setError('El nombre es obligatorio.');
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 80) return setError('Introduce una edad válida (5–80).');
    if (state.players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      return setError('Ya existe un jugador con ese nombre.');
    }

    actions.addPlayer(trimmed, ageNum);
    setName('');
    setAge('');
  }

  function handleCSVImport(rows: CsvRow[]) {
    let imported = 0;
    let skipped = 0;
    for (const row of rows) {
      const exists = state.players.some(p => p.name.toLowerCase() === row.name.toLowerCase());
      if (exists) { skipped++; continue; }
      actions.addPlayer(row.name, row.age);
      imported++;
    }
    return { imported, skipped };
  }

  const filtered = state.players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedByAge = [...filtered].sort((a, b) => a.age - b.age);
  const avgAge = state.players.length
    ? Math.round(state.players.reduce((s, p) => s + p.age, 0) / state.players.length)
    : 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ir-dark">👥 Jugadores</h1>
        <p className="text-gray-500 text-sm mt-1">
          Registra los participantes del torneo. Elige el tamaño de equipo en la sección Equipos.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4">Añadir jugador</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ir-blue focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Edad"
            value={age}
            min={5}
            max={80}
            onChange={e => setAge(e.target.value)}
            className="w-24 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ir-blue focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-ir-blue text-white font-bold px-6 py-2.5 rounded-xl hover:bg-ir-dark transition-colors flex items-center gap-2 justify-center"
          >
            <span>+</span> Añadir
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <CsvImport onImport={handleCSVImport} />

      {state.players.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: state.players.length, icon: '👥' },
            { label: 'Edad media', value: `${avgAge} años`, icon: '📊' },
            { label: 'Equipos posibles', value: Math.floor(state.players.length / 5), icon: '🧩' },
          ].map(s => (
            <div key={s.label} className="bg-ir-light rounded-xl p-3 text-center">
              <div className="text-lg">{s.icon}</div>
              <div className="font-black text-ir-dark text-lg">{s.value}</div>
              <div className="text-xs text-ir-dark/70">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {state.players.length > 0 && (
        <input
          type="text"
          placeholder="🔍 Buscar jugador..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ir-blue focus:border-transparent bg-white"
        />
      )}

      {state.players.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-3">👤</div>
          <h3 className="font-bold text-gray-700 text-lg">Sin jugadores aún</h3>
          <p className="text-gray-400 text-sm mt-1">Añade jugadores manualmente o importa un CSV</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-700 text-sm">{filtered.length} jugador{filtered.length !== 1 ? 'es' : ''}</span>
            <span className="text-xs text-gray-400">ordenados por edad</span>
          </div>
          <div className="divide-y divide-gray-50">
            {sortedByAge
              .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
              .map((player, i) => {
                const team = player.teamId ? state.teams.find(t => t.id === player.teamId) : null;
                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-full bg-ir-light text-ir-dark text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{player.name}</p>
                      {team && (
                        <p className="text-xs text-ir-blue font-medium">{team.name}</p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {player.age} años
                    </span>
                    <button
                      onClick={() => actions.removePlayer(player.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
                      title="Eliminar jugador"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {state.players.length > 0 && state.players.length < 6 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>💡 Tip:</strong> Añade al menos {6 - state.players.length} jugador{6 - state.players.length !== 1 ? 'es' : ''} más para poder generar equipos.
        </div>
      )}
    </div>
  );
}
