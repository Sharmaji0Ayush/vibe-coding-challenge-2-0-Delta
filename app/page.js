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
  UserCheck,
  Flame,
  Zap,
  Target
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
    <div className="min-h-screen bg-[#0b0f19] text-amber-50 font-sans pb-16 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-amber-500/10 bg-[#070a12]/90 sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20 text-slate-950">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                DUMKA SPORTS DESK <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              </h1>
              <p className="text-xs text-amber-200/60 font-medium">Digital Practice &amp; Trial Readiness System</p>
            </div>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex bg-[#121827] p-1.5 rounded-2xl border border-amber-500/10 shadow-inner">
            <button
              onClick={() => setActiveRole('COACH')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeRole === 'COACH' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-amber-200/60 hover:text-amber-100 hover:bg-amber-500/5'
              }`}
            >
              <Users className="w-4 h-4" /> Coach Desk
            </button>
            <button
              onClick={() => setActiveRole('SCOUT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeRole === 'SCOUT' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-amber-200/60 hover:text-amber-100 hover:bg-amber-500/5'
              }`}
            >
              <Search className="w-4 h-4" /> Scout Radar
            </button>
            <button
              onClick={() => setActiveRole('PLAYER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeRole === 'PLAYER' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-amber-200/60 hover:text-amber-100 hover:bg-amber-500/5'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Player View
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* VIEW 1: COACH DESK */}
        {activeRole === 'COACH' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-[#121827] border border-amber-500/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-500" /> Register Player
                </h2>
                <form onSubmit={handleAddPlayer} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-amber-200/60 block mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Marandi"
                      value={newPlayer.name}
                      onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      className="w-full bg-[#0b0f19] border border-amber-500/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-amber-200/60 block mb-1.5 uppercase tracking-wider">Age</label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={newPlayer.age}
                        onChange={e => setNewPlayer({ ...newPlayer, age: e.target.value })}
                        className="w-full bg-[#0b0f19] border border-amber-500/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-amber-200/60 block mb-1.5 uppercase tracking-wider">Sport</label>
                      <select
                        value={newPlayer.sport}
                        onChange={e => setNewPlayer({ ...newPlayer, sport: e.target.value })}
                        className="w-full bg-[#0b0f19] border border-amber-500/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                      >
                        <option value="Archery">Archery</option>
                        <option value="Football">Football</option>
                        <option value="Hockey">Hockey</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/15 flex items-center justify-center gap-2 mt-2"
                  >
                    <PlusCircle className="w-4 h-4 stroke-[2.5]" /> Add Player to Roster
                  </button>
                </form>
              </div>

              <div className="bg-[#121827] border border-amber-500/10 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" /> Start Practice Session
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {['Archery', 'Football', 'Hockey'].map(sport => (
                    <button
                      key={sport}
                      onClick={() => handleOpenSession(sport)}
                      className="bg-[#0b0f19] hover:bg-amber-500/10 border border-amber-500/15 hover:border-amber-500/40 p-4 rounded-2xl text-center transition-all group"
                    >
                      <span className="text-xs font-bold text-amber-100 group-hover:text-amber-400 block mb-1">{sport}</span>
                      <span className="text-[10px] text-amber-200/40 font-semibold uppercase">Open Desk</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {activeSession ? (
                <div className="bg-[#121827] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-500/10">
                    <div>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        Active Session Unlocked
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">{activeSession.sport} Attendance Sheet</h3>
                      <p className="text-xs text-amber-200/60 font-medium">Date: {activeSession.date}</p>
                    </div>
                    <button
                      onClick={handleLockSession}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-500/5"
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
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isPresent ? 'bg-[#0b0f19] border-amber-500/15' : 'bg-red-500/5 border-red-500/20'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-white text-sm block">{player.name}</span>
                            <span className="text-xs text-amber-200/50">Age: {player.age} • {player.sport}</span>
                          </div>
                          <button
                            onClick={() => handleToggleAttendance(player.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                              isPresent
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
                <div className="bg-[#121827] border border-amber-500/10 rounded-3xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" /> Log Match Performance &amp; Scores
                  </h2>
                  <form onSubmit={handleRecordMatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-amber-200/60 block mb-1.5 uppercase tracking-wider">Match Date</label>
                        <input
                          type="date"
                          value={newMatch.date}
                          onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
                          className="w-full bg-[#0b0f19] border border-amber-500/15 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-amber-200/60 block mb-1.5 uppercase tracking-wider">Sport</label>
                        <select
                          value={newMatch.sport}
                          onChange={e => setNewMatch({ ...newMatch, sport: e.target.value, scores: {} })}
                          className="w-full bg-[#0b0f19] border border-amber-500/15 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                        >
                          <option value="Archery">Archery</option>
                          <option value="Football">Football</option>
                          <option value="Hockey">Hockey</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-amber-200/60 block mb-1.5 uppercase tracking-wider">Opponent Team</label>
                        <input
                          type="text"
                          placeholder="e.g. Ranchi Club"
                          value={newMatch.opponent}
                          onChange={e => setNewMatch({ ...newMatch, opponent: e.target.value })}
                          className="w-full bg-[#0b0f19] border border-amber-500/15 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-amber-500/10">
                      <label className="text-xs font-semibold text-amber-200/80 block mb-3 uppercase tracking-wider">Player Scores for this Match:</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {players.filter(p => p.sport === newMatch.sport).map(p => (
                          <div key={p.id} className="flex items-center justify-between bg-[#0b0f19] p-3 rounded-2xl border border-amber-500/15">
                            <span className="text-xs text-amber-100 font-semibold">{p.name}</span>
                            <input
                              type="number"
                              placeholder="Score"
                              value={newMatch.scores[p.id] || ''}
                              onChange={e => setNewMatch({
                                ...newMatch,
                                scores: { ...newMatch.scores, [p.id]: e.target.value }
                              })}
                              className="w-24 bg-[#121827] border border-amber-500/20 rounded-xl px-3 py-1.5 text-xs text-right text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/15 mt-2"
                    >
                      Save Match Scorecard
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-[#121827] border border-amber-500/10 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4">Academy Roster Status</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0b0f19] text-amber-200/60 uppercase font-bold border-b border-amber-500/10">
                      <tr>
                        <th className="p-3.5">Player</th>
                        <th className="p-3.5">Sport</th>
                        <th className="p-3.5">Attendance</th>
                        <th className="p-3.5">Matches</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10">
                      {calculatedData.map(p => (
                        <tr key={p.id} className="hover:bg-amber-500/5 transition-colors">
                          <td className="p-3.5 font-bold text-white">{p.name}</td>
                          <td className="p-3.5 text-amber-200/60 font-medium">{p.sport}</td>
                          <td className="p-3.5">
                            <span className="text-amber-400 font-black">{p.attendancePercentage}%</span> ({p.attendedSessions}/{p.totalSessions})
                          </td>
                          <td className="p-3.5 font-semibold text-slate-300">{p.matchesPlayed} matches</td>
                          <td className="p-3.5">
                            {p.isReady ? (
                              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-black text-[10px] tracking-wider">
                                READY FOR TRIAL
                              </span>
                            ) : (
                              <span className="bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-full font-semibold text-[10px]">
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

        {/* VIEW 2: SCOUT RADAR */}
        {activeRole === 'SCOUT' && (
          <div className="space-y-6">
            <div className="bg-[#121827] border border-amber-500/10 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-500/10 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                    <h2 className="text-2xl font-bold text-white">Scout Talent Radar</h2>
                  </div>
                  <p className="text-xs text-amber-200/60 mt-1">
                    Strict Privacy Protection: Displays ONLY players meeting trial threshold (&ge; 75% Attendance &amp; &ge; 2 Matches).
                  </p>
                </div>

                <div className="flex gap-2">
                  {['All', 'Archery', 'Football', 'Hockey'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSportFilter(s)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        sportFilter === s ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-[#0b0f19] text-amber-200/60 hover:text-white border border-amber-500/10'
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
                    <div key={player.id} className="bg-[#0b0f19] border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl group hover:border-amber-500/60 transition-all">
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
                        Verified Candidate
                      </div>
                      <h3 className="text-xl font-black text-white">{player.name}</h3>
                      <p className="text-xs text-amber-400 font-bold mt-0.5">{player.sport} • {player.academy}</p>

                      <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-amber-500/10">
                        <div className="bg-[#121827] p-3.5 rounded-2xl border border-amber-500/10">
                          <span className="text-[10px] text-amber-200/50 uppercase font-bold block mb-1">Attendance</span>
                          <span className="text-xl font-black text-amber-400">{player.attendancePercentage}%</span>
                        </div>
                        <div className="bg-[#121827] p-3.5 rounded-2xl border border-amber-500/10">
                          <span className="text-[10px] text-amber-200/50 uppercase font-bold block mb-1">Matches</span>
                          <span className="text-xl font-black text-white">{player.matchesPlayed}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-amber-500/10 flex justify-between items-center text-xs">
                        <span className="text-amber-200/60 font-medium">Trial Qualification</span>
                        <span className="text-amber-400 font-black flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {readyPlayers.filter(p => sportFilter === 'All' || p.sport === sportFilter).length === 0 && (
                <div className="text-center py-16 text-amber-200/40">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-amber-500/40" />
                  <p className="text-sm font-semibold">No players currently meet the strict trial readiness threshold.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PLAYER PORTAL */}
        {activeRole === 'PLAYER' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#121827] p-4 rounded-3xl border border-amber-500/10 flex items-center justify-between shadow-lg">
              <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider">Simulate Logged-in Player:</span>
              <select
                value={selectedPlayerId}
                onChange={e => setSelectedPlayerId(e.target.value)}
                className="bg-[#0b0f19] border border-amber-500/20 rounded-2xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sport})</option>
                ))}
              </select>
            </div>

            <div className="bg-[#121827] border border-amber-500/15 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-amber-500/10 pb-6">
                <div>
                  <span className="bg-[#0b0f19] text-amber-400 border border-amber-500/20 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    Personal Dashboard
                  </span>
                  <h2 className="text-3xl font-black text-white mt-3">{selectedPlayerData.name}</h2>
                  <p className="text-xs text-amber-200/60 font-semibold mt-1">{selectedPlayerData.sport} • {selectedPlayerData.academy}</p>
                </div>
                {selectedPlayerData.isReady ? (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20">
                    <Award className="w-4 h-4 stroke-[2.5]" /> Trial Ready
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4" /> In Progress
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#0b0f19] p-5 rounded-2xl border border-amber-500/10">
                  <span className="text-xs text-amber-200/50 uppercase font-bold block mb-1">Attendance Record</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400">{selectedPlayerData.attendancePercentage}%</span>
                    <span className="text-xs text-amber-200/40">({selectedPlayerData.attendedSessions}/{selectedPlayerData.totalSessions} sessions)</span>
                  </div>
                </div>

                <div className="bg-[#0b0f19] p-5 rounded-2xl border border-amber-500/10">
                  <span className="text-xs text-amber-200/50 uppercase font-bold block mb-1">Matches Played</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{selectedPlayerData.matchesPlayed}</span>
                    <span className="text-xs text-amber-200/40">matches</span>
                  </div>
                </div>

                <div className="bg-[#0b0f19] p-5 rounded-2xl border border-amber-500/10">
                  <span className="text-xs text-amber-200/50 uppercase font-bold block mb-1">Readiness Criteria</span>
                  <div className="text-xs font-bold mt-2 space-y-1">
                    <p className={selectedPlayerData.attendancePercentage >= 75 ? 'text-amber-400' : 'text-amber-200/40'}>
                      • Attendance &ge; 75% ({selectedPlayerData.attendancePercentage >= 75 ? 'Met' : 'Unmet'})
                    </p>
                    <p className={selectedPlayerData.matchesPlayed >= 2 ? 'text-amber-400' : 'text-amber-200/40'}>
                      • Matches &ge; 2 ({selectedPlayerData.matchesPlayed >= 2 ? 'Met' : 'Unmet'})
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-500/10">
                <h3 className="text-sm font-bold text-white mb-4">My Recorded Match Scores</h3>
                <div className="space-y-3">
                  {matches
                    .filter(m => m.scores[selectedPlayerData.id] !== undefined)
                    .map(m => (
                      <div key={m.id} className="flex justify-between items-center bg-[#0b0f19] p-4 rounded-2xl border border-amber-500/10">
                        <div>
                          <span className="text-xs font-bold text-white block">vs. {m.opponent}</span>
                          <span className="text-[10px] text-amber-200/50 font-medium">{m.date} • {m.sport}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-amber-200/40 uppercase font-bold block">Score</span>
                          <span className="text-base font-black text-amber-400">{m.scores[selectedPlayerData.id]}</span>
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