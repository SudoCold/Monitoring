import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Bell, ChevronRight, Clock3, Eye, FileText, LayoutDashboard, Monitor, Play, Settings, ShieldCheck, Users, Wifi, WifiOff, Youtube, Video } from 'lucide-react';
import './styles.css';

const demoEmployees = [
  { id: '1', name: 'Employee 1', status: 'online', activity: 'Reading PDF', app: 'Adobe Acrobat', duration: '01:24:18', score: 94, icon: FileText },
  { id: '2', name: 'Employee 2', status: 'online', activity: 'YouTube', app: 'Google Chrome', duration: '00:37:42', score: 62, icon: Youtube },
  { id: '3', name: 'Employee 3', status: 'online', activity: 'Zoom Meeting', app: 'Zoom', duration: '00:51:09', score: 88, icon: Video },
  { id: '4', name: 'Employee 4', status: 'away', activity: 'Idle', app: 'Windows Desktop', duration: '00:08:21', score: 71, icon: Monitor },
];

function App() {
  const [selected, setSelected] = useState(demoEmployees[0]);
  const [connected, setConnected] = useState(true);
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;
    let channel;
    let client;
    (async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        client = createClient(supabaseUrl, supabaseKey);
        channel = client.channel('monitoring-live').on('postgres_changes', { event: '*', schema: 'public', table: 'activity_events' }, () => setConnected(true)).subscribe();
      } catch { setConnected(false); }
    })();
    return () => { if (channel && client) client.removeChannel(channel); };
  }, [supabaseUrl, supabaseKey]);

  const stats = useMemo(() => ({ online: demoEmployees.filter(e => e.status === 'online').length, active: demoEmployees.filter(e => e.activity !== 'Idle').length, productivity: Math.round(demoEmployees.reduce((a, e) => a + e.score, 0) / demoEmployees.length) }), []);

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Activity size={19}/></div><span>MONITOR</span></div>
      <nav>
        <button className="nav active"><LayoutDashboard size={18}/> Dashboard</button>
        <button className="nav"><Users size={18}/> Employees</button>
        <button className="nav"><Clock3 size={18}/> Activity Log</button>
        <button className="nav"><Eye size={18}/> Screenshots</button>
        <button className="nav"><Bell size={18}/> Alerts <span className="badge">3</span></button>
      </nav>
      <div className="sidebar-bottom">
        <button className="nav" onClick={() => setShowSettings(!showSettings)}><Settings size={18}/> Settings</button>
        <div className="connection"><span className={connected ? 'dot online' : 'dot'}></span><div><strong>{connected ? 'Realtime connected' : 'Disconnected'}</strong><small>Supabase</small></div></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar"><div><p className="eyebrow">WORKSPACE / LIVE</p><h1>Monitoring Dashboard</h1></div><div className="top-actions"><span className="live"><span className="pulse"></span> LIVE</span><button className="icon-btn"><Bell size={18}/></button><div className="avatar">AD</div></div></header>

      <section className="stats">
        <div className="stat-card"><span className="stat-label">EMPLOYEES ONLINE</span><strong>{stats.online}<small> / {demoEmployees.length}</small></strong><span className="positive">+1 today</span></div>
        <div className="stat-card"><span className="stat-label">CURRENTLY ACTIVE</span><strong>{stats.active}</strong><span className="muted">Live activity</span></div>
        <div className="stat-card"><span className="stat-label">PRODUCTIVITY SCORE</span><strong>{stats.productivity}<small>/100</small></strong><span className="positive">+6.2% vs yesterday</span></div>
        <div className="stat-card"><span className="stat-label">EVENTS TODAY</span><strong>1,284</strong><span className="muted">Last event 8s ago</span></div>
      </section>

      <div className="content-grid">
        <section className="panel employees"><div className="panel-head"><div><h2>Live employee activity</h2><p>What your team is doing right now.</p></div><button className="text-btn">View all <ChevronRight size={15}/></button></div>
          <div className="employee-list">{demoEmployees.map(e => { const Icon = e.icon; return <button key={e.id} className={'employee '+(selected.id === e.id ? 'selected':'')} onClick={() => setSelected(e)}><div className="emp-avatar">{e.name.slice(-1)}</div><div className="emp-main"><div className="emp-name"><strong>{e.name}</strong><span className={'status '+e.status}>{e.status}</span></div><div className="activity"><Icon size={15}/><span>{e.activity}</span><em>·</em><span>{e.app}</span></div></div><div className="duration">{e.duration}</div><div className="score"><div className="score-bar"><i style={{width:`${e.score}%`}}></i></div><span>{e.score}%</span></div></button> })}</div>
        </section>

        <section className="panel preview"><div className="panel-head"><div><h2>Activity preview</h2><p>{selected.name} · {selected.activity}</p></div><button className="view-btn"><Eye size={15}/> View screen</button></div><div className="screen"><div className="screen-top"><span>● {selected.app}</span><span>12:41 PM</span></div><div className="screen-body"><div className="mock-window"><div className="mock-title">{selected.activity}</div><div className="mock-lines"><span></span><span></span><span></span><span></span><span></span></div><div className="mock-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div><div className="screen-footer"><span><Wifi size={14}/> Live screen capture</span><span>Updated 8 seconds ago</span></div></div></section>
      </div>

      <section className="panel timeline"><div className="panel-head"><div><h2>Recent activity</h2><p>Latest events received from desktop monitors.</p></div><button className="filter">Today ▾</button></div><div className="timeline-row"><div className="time">12:41:08</div><div className="timeline-dot"></div><div><strong>Employee 1</strong><span> opened <b>Q3 Financial Report.pdf</b></span></div><span className="event-tag productive">Productive</span></div><div className="timeline-row"><div className="time">12:39:22</div><div className="timeline-dot"></div><div><strong>Employee 3</strong><span> joined a <b>Zoom Meeting</b></span></div><span className="event-tag productive">Work</span></div><div className="timeline-row"><div className="time">12:36:47</div><div className="timeline-dot warn"></div><div><strong>Employee 2</strong><span> watched <b>YouTube</b> for 10 minutes</span></div><span className="event-tag neutral">Non-work</span></div></section>

      {showSettings && <section className="panel settings"><div className="panel-head"><div><h2>Supabase connection</h2><p>Use environment variables in production. These fields are for local testing.</p></div></div><label>Project URL<input value={supabaseUrl} onChange={e=>setSupabaseUrl(e.target.value)} placeholder="https://your-project.supabase.co"/></label><label>Anon public key<input value={supabaseKey} onChange={e=>setSupabaseKey(e.target.value)} placeholder="eyJ..."/></label><div className="security"><ShieldCheck size={17}/> Never expose your Supabase service-role key in the browser.</div></section>}
      <footer>MONITORING SYSTEM <span>·</span> Desktop agent → Supabase → Web dashboard</footer>
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
