'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Award, 
  Lock, 
  Search, 
  Calendar, 
  Trophy, 
  ShieldCheck, 
  ShieldAlert,
  UserPlus,
  PlusCircle,
  Activity,
  UserCheck
} from 'lucide-react';

const INITIAL_PLAYERS = [
  { id: '1', name: 'Ramesh Marandi', age: 17, sport: 'Archery', academy: 'Dumka Sports Academy' },
  { id: '2', name: 'Sunita Hembrom', age: 16, sport: 'Archery', academy: 'Dumka Sports Academy' },
  { id: '3', name: 'Amit Soren', age: 18, sport: 'Football', academy: 'Dumka Sports Academy' },
  { id: '4', name: 'Priya Tudu', age: 15, sport: 'Football', academy: 'Dumka Sports Academy' },
  { id: '5', name: 'Vikram Baski', age: 17, sport: 'Hockey', academy: 'Dumka Sports Academy' },
];

const INITIAL_SESSIONS = [
  {
    id: 's1',
    date: '2026-10-25',
    sport: 'Archery',
    status: 'LOCKED',
    attendance: { '1': 'PRESENT', '2': 'PRESENT' }
  },
  {
    id: 's2',
    date: '2026-10-28',
    sport: 'Archery',
    status: 'LOCKED',
    attendance: { '1': 'PRESENT', '2': 'ABSENT' }
  },
  {
    id: 's3',
    date: '2026-10-30',
    sport: 'Archery',
    status: 'LOCKED',
    attendance: { '1': 'PRESENT', '2': 'PRESENT' }
  },
  {
    id: 's4',
    date: '2026-10-26',
    sport: 'Football',
    status: 'LOCKED',
    attendance: { '3': 'PRESENT', '4': 'PRESENT' }
  }
];

const INITIAL_MATCHES = [
  {
    id: 'm1',
    date: '2026-10-27',
    sport: 'Archery',
    opponent: 'Ranchi Archery Club',
    scores: { '1': 285, '2': 270 }
  },
  {
    id: 'm2',
    date: '2026-10-31',
    sport: 'Archery',
    opponent: 'Jamshedpur Sports Hub',
    scores: { '1': 290 }
  }
];

export default function DumkaSportsDesk() {
  const [activeRole, setActiveRole] = useState('COACH');
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  
  const [selectedPlayerId, setSelectedPlayerId] = useState('1');
  const [sportFilter, setSportFilter] = useState('All');

  const [newPlayer, setNewPlayer] = useState({ name: '', age: '', sport: 'Archery' });
  const [activeSession, setActiveSession] = useState(null);
  const [newMatch, setNewMatch] = useState({ date: '', sport: 'Archery', opponent: '', scores: {} });

  const calculatedData = useMemo(() => {
    return players.map(player => {
      const lockedSessions = sessions.filter(
        s => s.sport === player.sport && s.status === 'LOCKED'
      );
      const totalSessions = lockedSessions.length;

      const attendedSessions = lockedSessions.filter(
        s => s.attendance[player.id] === 'PRESENT'
      ).length;

      const attendancePercentage = totalSessions > 0 
        ? Math.round((attendedSessions / totalSessions) * 100) 
        : 0;

      const matchesPlayed = matches.filter(
        m => m.sport === player.sport && m.scores[player.id] !== undefined
      ).length;

      const isReady = attendancePercentage >= 75 && matchesPlayed >= 2;

      return {
        ...player,
        totalSessions,
        attendedSessions,
        attendancePercentage,
        matchesPlayed,
        isReady
      };
    });
  }, [players, sessions, matches]);

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.age) return;
    const created = {
      id: Date.now().toString(),
      name: newPlayer.name,
      age: parseInt(newPlayer.age),
      sport: newPlayer.sport,
      academy: 'Dumka Sports Academy'
    };
    setPlayers([...players, created]);
    setNewPlayer({ name: '', age: '', sport: 'Archery' });
  };

  const handleOpenSession = (sport) => {
    const today = new Date().toISOString().split('T')[0];
    const initialAtt = {};
    players.filter(p => p.sport === sport).forEach(p => {
      initialAtt[p.id] = 'PRESENT';
    });
    setActiveSession({
      date: today,
      sport,
      attendance: initialAtt
    });
  };

  const handleToggleAttendance = (playerId) => {
    if (!activeSession) return;
    const current = activeSession.attendance[playerId] || 'PRESENT';
    const updated = current === 'PRESENT' ? 'ABSENT' : 'PRESENT';
    setActiveSession({
      ...activeSession,
      attendance: { ...activeSession.attendance, [playerId]: updated }
    });
  };

  const handleLockSession = () => {
    if (!activeSession) return;
    const newSessionRecord = {
      id: 's_' + Date.now(),
      date: activeSession.date,
      sport: activeSession.sport,
      status: 'LOCKED',
      attendance: activeSession.attendance
    };
    setSessions([...sessions, newSessionRecord]);
    setActiveSession(null);
  };

  const handleRecordMatch = (e) => {
    e.preventDefault();
    if (!newMatch.opponent || !newMatch.date) return;
    
    const validScores = {};
    Object.keys(newMatch.scores).forEach(pId => {
      if (newMatch.scores[pId] !== '' && newMatch.scores[pId] !== undefined) {
        validScores[pId] = Number(newMatch.scores[pId]);
      }
    });

    const matchRecord = {
      id: 'm_' + Date.now(),
      date: newMatch.date,
      sport: newMatch.sport,
      opponent: newMatch.opponent,
      scores: validScores
    };

    setMatches([...matches, matchRecord]);
    setNewMatch({ date: '', sport: 'Archery', opponent: '', scores: {} });
  };

  const readyPlayers = calculatedData.filter(p => p.isReady);
  const selectedPlayerData = calculatedData.find(p => p.id === selectedPlayerId) || calculatedData[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Dumka Sports Academy Desk
              </h1>
              <p className="text-xs text-slate-400">Digital Practice &amp; Trial Readiness System</p>
            </div>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveRole('COACH')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeRole === 'COACH' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Coach Desk
            </button>
            <button
              onClick={() => setActiveRole('SCOUT')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeRole === 'SCOUT' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" /> Scout Radar
            </button>
            <button
              onClick={() => setActiveRole('PLAYER')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeRole === 'PLAYER' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Player View
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {activeRole === 'COACH' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" /> Register Player
                </h2>
                <form onSubmit={handleAddPlayer} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Marandi"
                      value={newPlayer.name}
                      onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={newPlayer.age}
                        onChange={e => setNewPlayer({ ...newPlayer, age: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Sport</label>
                      <select
                        value={newPlayer.sport}
                        onChange={e => setNewPlayer({ ...newPlayer, sport: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Archery">Archery</option>
                        <option value="Football">Football</option>
                        <option value="Hockey">Hockey</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Player to Roster
                  </button>
                </form>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" /> Start Practice Session
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {['Archery', 'Football', 'Hockey'].map(sport => (
                    <button
                      key={sport}
                      onClick={() => handleOpenSession(sport)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl text-center transition-all group"
                    >
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-emerald-400 block">{sport}</span>
                      <span className="text-[10px] text-slate-500">Open Desk</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {activeSession ? (
                <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                    <div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Active Session Unlocked
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">{activeSession.sport} Attendance Sheet</h3>
                      <p className="text-xs text-slate-400">Date: {activeSession.date}</p>
                    </div>
                    <button
                      onClick={handleLockSession}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all"
                    >
                      <Lock className="w-4 h-4" /> Lock &amp; Save Session
                    </button>
                  </div>

                  <div className="space-y-3">
                    {players.filter(p => p.sport === activeSession.sport).map(player => {
                      const status = activeSession.attendance[player.id] || 'PRESENT';
                      const isPresent = status === 'PRESENT';
                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            isPresent ? 'bg-slate-900/60 border-slate-800' : 'bg-red-500/5 border-red-500/20'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-white text-sm block">{player.name}</span>
                            <span className="text-xs text-slate-400">Age: {player.age} • {player.sport}</span>
                          </div>
                          <button
                            onClick={() => handleToggleAttendance(player.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                              isPresent
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {isPresent ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {isPresent ? 'PRESENT' : 'ABSENT'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-400" /> Log Match Performance &amp; Scores
                  </h2>
                  <form onSubmit={handleRecordMatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Match Date</label>
                        <input
                          type="date"
                          value={newMatch.date}
                          onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Sport</label>
                        <select
                          value={newMatch.sport}
                          onChange={e => setNewMatch({ ...newMatch, sport: e.target.value, scores: {} })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Archery">Archery</option>
                          <option value="Football">Football</option>
                          <option value="Hockey">Hockey</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Opponent Team</label>
                        <input
                          type="text"
                          placeholder="e.g. Ranchi Club"
                          value={newMatch.opponent}
                          onChange={e => setNewMatch({ ...newMatch, opponent: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-3">Player Scores for this Match:</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {players.filter(p => p.sport === newMatch.sport).map(p => (
                          <div key={p.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-300 font-medium">{p.name}</span>
                            <input
                              type="number"
                              placeholder="Score"
                              value={newMatch.scores[p.id] || ''}
                              onChange={e => setNewMatch({
                                ...newMatch,
                                scores: { ...newMatch.scores, [p.id]: e.target.value }
                              })}
                              className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-right text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10"
                    >
                      Save Match Scorecard
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Academy Roster Status</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Player</th>
                        <th className="p-3">Sport</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3">Matches</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {calculatedData.map(p => (
                        <tr key={p.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-semibold text-white">{p.name}</td>
                          <td className="p-3 text-slate-400">{p.sport}</td>
                          <td className="p-3">
                            <span className="text-emerald-400 font-bold">{p.attendancePercentage}%</span> ({p.attendedSessions}/{p.totalSessions})
                          </td>
                          <td className="p-3 font-medium text-slate-300">{p.matchesPlayed} matches</td>
                          <td className="p-3">
                            {p.isReady ? (
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                READY FOR TRIAL
                              </span>
                            ) : (
                              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium text-[10px]">
                                NOT READY
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'SCOUT' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Scout Talent Radar</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Strict Privacy Protection: Displays ONLY players meeting the trial threshold (&ge; 75% Attendance &amp; &ge; 2 Matches).
                  </p>
                </div>

                <div className="flex gap-2">
                  {['All', 'Archery', 'Football', 'Hockey'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSportFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        sportFilter === s ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {readyPlayers
                  .filter(p => sportFilter === 'All' || p.sport === sportFilter)
                  .map(player => (
                    <div key={player.id} className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[9px] px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                        Verified Candidate
                      </div>
                      <h3 className="text-lg font-bold text-white">{player.name}</h3>
                      <p className="text-xs text-emerald-400 font-semibold">{player.sport} • {player.academy}</p>

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Attendance Rate</span>
                          <span className="text-lg font-black text-emerald-400">{player.attendancePercentage}%</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Matches Completed</span>
                          <span className="text-lg font-black text-white">{player.matchesPlayed}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Trial Qualification</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {readyPlayers.filter(p => sportFilter === 'All' || p.sport === sportFilter).length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-medium">No players currently meet the strict trial readiness threshold.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeRole === 'PLAYER' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Simulate Logged-in Player:</span>
              <select
                value={selectedPlayerId}
                onChange={e => setSelectedPlayerId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sport})</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex justify-between items-start border-b border-slate-800 pb-6">
                <div>
                  <span className="bg-slate-900 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-800">
                    Personal Dashboard
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">{selectedPlayerData.name}</h2>
                  <p className="text-xs text-slate-400">{selectedPlayerData.sport} • {selectedPlayerData.academy}</p>
                </div>
                {selectedPlayerData.isReady ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Award className="w-4 h-4" /> Trial Ready
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4" /> In Progress
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Attendance Record</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">{selectedPlayerData.attendancePercentage}%</span>
                    <span className="text-xs text-slate-500">({selectedPlayerData.attendedSessions}/{selectedPlayerData.totalSessions} sessions)</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Matches Played</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{selectedPlayerData.matchesPlayed}</span>
                    <span className="text-xs text-slate-500">matches</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Readiness Criteria</span>
                  <div className="text-xs font-semibold mt-1">
                    <p className={selectedPlayerData.attendancePercentage >= 75 ? 'text-emerald-400' : 'text-slate-500'}>
                      • Attendance &ge; 75% ({selectedPlayerData.attendancePercentage >= 75 ? 'Met' : 'Unmet'})
                    </p>
                    <p className={selectedPlayerData.matchesPlayed >= 2 ? 'text-emerald-400' : 'text-slate-500'}>
                      • Matches &ge; 2 ({selectedPlayerData.matchesPlayed >= 2 ? 'Met' : 'Unmet'})
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4">My Recorded Match Scores</h3>
                <div className="space-y-3">
                  {matches
                    .filter(m => m.scores[selectedPlayerData.id] !== undefined)
                    .map(m => (
                      <div key={m.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-xs font-bold text-white block">vs. {m.opponent}</span>
                          <span className="text-[10px] text-slate-400">{m.date} • {m.sport}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Score</span>
                          <span className="text-base font-black text-emerald-400">{m.scores[selectedPlayerData.id]}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
