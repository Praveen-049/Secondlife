import React, {useState} from 'react';
import {ArrowRight, Box, ChevronDown, CircleCheck, Leaf, LogOut, Plus, Recycle, Search, Sparkles, TrendingUp, UserRound, Zap} from 'lucide-react';
import {useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from './auth/AuthContext';
import './styles.css';
import './auth.css';

const components=[
 {name:'ESP32 DevKit',qty:2,condition:'Good',type:'Microcontroller'},
 {name:'MPU6050',qty:1,condition:'Excellent',type:'Sensor'},
 {name:'0.96 OLED',qty:1,condition:'Good',type:'Display'},
 {name:'SG90 Servo',qty:2,condition:'Fair',type:'Actuator'},
 {name:'RFID RC522',qty:1,condition:'Good',type:'Module'}
];
const projects=[
 {name:'Smart Security Lock',score:94,available:'5/5',cost:320,savings:270,waste:210,missing:0,tag:'Best match'},
 {name:'Motion Alert System',score:89,available:'4/5',cost:180,savings:210,waste:165,missing:1,tag:'High match'},
 {name:'Smart Plant Monitor',score:82,available:'4/6',cost:240,savings:190,waste:180,missing:2,tag:'Good match'}
];
export function DashboardApp(){
 const location=useLocation();
 const navigate=useNavigate();
 const {profile,user,signOut}=useAuth();
 const view=({'/dashboard':'dashboard','/components':'components','/projects':'projects','/impact':'impact'})[location.pathname]??'dashboard';
 const [profileMenuOpen,setProfileMenuOpen]=useState(false);
 const [showAdd,setShowAdd]=useState(false);
 const [signingOut,setSigningOut]=useState(false);
 const [signOutError,setSignOutError]=useState('');
 const nav=[['dashboard','Dashboard','/dashboard'],['components','My Components','/components'],['projects','Find Projects','/projects'],['impact','Impact','/impact']];
 const setView=nextView=>navigate(nextView==='dashboard'?'/dashboard':`/${nextView}`);
 const displayName=profile?.full_name||user?.user_metadata?.full_name||user?.email||'SecondLife user';
 const initials=displayName.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase();
 async function handleSignOut(){
    setSigningOut(true);setSignOutError('');
   try{
    const {error}=await signOut();
    if(error){setSignOutError('Unable to sign out right now. Please try again.');return}
    navigate('/login',{replace:true});
   }catch{setSignOutError('Unable to sign out right now. Please try again.')}
   finally{setSigningOut(false)}
 }
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><div className="brandmark"><Recycle size={22}/></div><div><b>SecondLife</b><span>electronics reuse</span></div></div>
     <div className="nav">{nav.map(([id,label,path])=><button key={id} className={view===id?'active':''} onClick={()=>navigate(path)}>{id==='dashboard'?<TrendingUp size={18}/>:id==='components'?<Box size={18}/>:id==='projects'?<Sparkles size={18}/>:<Leaf size={18}/>}<span>{label}</span></button>)}</div>
    <div className="sidebarBottom"><div className="role"><UserRound size={17}/><div><small>Signed in as</small><strong>{profile?.role==='organization'?'Organization':profile?.role==='seller'?'Seller':'Project Maker'}</strong></div></div></div>
  </aside>
  <main className="main">
    <header><div><div className="eyebrow">CIRCULAR ELECTRONICS PLATFORM</div><h1>{view==='dashboard'?'Build more. Waste less.':nav.find(x=>x[0]===view)?.[1]}</h1></div><div className="profileControl"><button className="profile" aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={()=>setProfileMenuOpen(!profileMenuOpen)}>{profile?.avatar_url?<img src={profile.avatar_url} alt=""/>:<span>{initials}</span>}{displayName}<ChevronDown size={15}/></button>{profileMenuOpen&&<div className="profileMenu" role="menu"><span className="profileEmail">{user?.email||'Demo access'}</span><button role="menuitem" onClick={()=>navigate('/profile')}>Profile settings</button><button role="menuitem" onClick={handleSignOut} disabled={signingOut}><LogOut size={15}/>{signingOut?'Signing out...':'Sign out'}</button>{signOutError&&<span className="profileMenuError" role="alert">{signOutError}</span>}</div>}</div></header>
   {view==='dashboard' && <Dashboard go={setView}/>} 
   {view==='components' && <Components onAdd={()=>setShowAdd(true)}/>} 
   {view==='projects' && <Projects/>}
   {view==='impact' && <Impact/>}
  </main>
  {showAdd && <AddModal close={()=>setShowAdd(false)}/>} 
 </div>
}
function Dashboard({go}){return <>
 <section className="hero"><div><div className="pill"><Sparkles size={14}/> AI-powered reuse matching</div><h2>Turn unused electronics<br/><em>into your next project.</em></h2><p>Tell SecondLife what you want to build. We match your requirements with reusable components and show exactly what you can save.</p><button className="primary" onClick={()=>go('projects')}>Find reusable components <ArrowRight size={18}/></button></div><div className="heroVisual"><div className="orbit o1"></div><div className="orbit o2"></div><div className="core"><Recycle size={52}/><span>REUSE</span></div><div className="chip c1">ESP32</div><div className="chip c2">MPU6050</div><div className="chip c3">OLED</div></div></section>
 <section className="stats"><Stat icon={<Recycle/>} value="12,842" label="components reused"/><Stat icon={<Leaf/>} value="486 kg" label="e-waste diverted"/><Stat icon={<Zap/>} value="327" label="projects enabled"/><Stat icon={<TrendingUp/>} value="₹8.7L" label="estimated savings"/></section>
 <section className="grid2"><div className="panel"><div className="panelHead"><div><h3>Your component inventory</h3><p>5 component types available</p></div><button className="textBtn" onClick={()=>go('components')}>View all <ArrowRight size={15}/></button></div>{components.slice(0,4).map(c=><div className="componentRow" key={c.name}><div className="iconBox"><Box size={18}/></div><div className="grow"><strong>{c.name}</strong><small>{c.type} · {c.condition}</small></div><b>×{c.qty}</b><CircleCheck className="ok" size={17}/></div>)}</div>
 <div className="panel matchPanel"><div className="panelHead"><div><h3>Top project match</h3><p>Based on your inventory</p></div><span className="score">94%</span></div><div className="matchCard"><div className="matchIcon"><Sparkles/></div><div className="grow"><strong>Smart Security Lock</strong><small>5/5 required components available</small></div></div><div className="miniMetrics"><div><b>₹320</b><span>reuse cost</span></div><div><b>₹270</b><span>saved</span></div><div><b>210g</b><span>waste diverted</span></div></div><button className="secondary" onClick={()=>go('projects')}>View match analysis <ArrowRight size={16}/></button></div></section>
 </>}
function Stat({icon,value,label}){return <div className="stat"><div className="statIcon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div></div>}
function Components({onAdd}){return <section><div className="toolbar"><div className="search"><Search size={18}/><input placeholder="Search components..."/></div><button className="primary small" onClick={onAdd}><Plus size={17}/> Add component</button></div><div className="panel"><div className="panelHead"><div><h3>My components</h3><p>Available resources ready for reuse</p></div></div>{components.map(c=><div className="componentRow large" key={c.name}><div className="iconBox"><Box size={19}/></div><div className="grow"><strong>{c.name}</strong><small>{c.type}</small></div><span className="condition">{c.condition}</span><span className="qty">×{c.qty}</span><button className="ghost">Details</button></div>)}</div></section>}
function Projects(){return <section><div className="projectIntro"><div><div className="pill"><Sparkles size={14}/> Intelligent matching</div><h2>Projects you can build</h2><p>Ranked using component availability, compatibility, quantity, budget and feasibility.</p></div><div className="matchBadge"><strong>5</strong><span>components analyzed</span></div></div><div className="projectGrid">{projects.map((p,i)=><div className={'projectCard '+(i===0?'featured':'')} key={p.name}><div className="projectTop"><span className="tag">{p.tag}</span><span className="bigScore">{p.score}%</span></div><h3>{p.name}</h3><p>{p.available} required components available</p><div className="bar"><span style={{width:p.score+'%'}}></span></div><div className="projectMetrics"><div><small>Reuse cost</small><b>₹{p.cost}</b></div><div><small>You save</small><b>₹{p.savings}</b></div><div><small>Waste diverted</small><b>{p.waste}g</b></div></div><button className="secondary">View match analysis <ArrowRight size={16}/></button></div>)}</div></section>}
function Impact(){return <section><div className="impactHero"><Leaf size={28}/><div><div className="eyebrow">YOUR CONTRIBUTION</div><h2>Small parts. Measurable impact.</h2><p>Impact values are estimates based on reused component weight and project activity.</p></div></div><div className="impactGrid"><Stat icon={<Recycle/>} value="37" label="components donated"/><Stat icon={<CircleCheck/>} value="29" label="components reused"/><Stat icon={<Leaf/>} value="2.84 kg" label="estimated e-waste diverted"/><Stat icon={<TrendingUp/>} value="78%" label="reuse success rate"/></div><div className="panel"><div className="panelHead"><div><h3>Reuse activity</h3><p>Recent contribution outcomes</p></div></div><div className="activity"><strong>ESP32 DevKit</strong><span>Used in Smart Plant Monitor</span><b>Delivered · ★★★★★</b></div><div className="activity"><strong>MPU6050</strong><span>Used in Motion Alert System</span><b>In transit</b></div><div className="activity"><strong>RFID RC522</strong><span>Matched to Security Lock project</span><b>Requested</b></div></div></section>}
function AddModal({close}){return <div className="overlay"><div className="modal"><div className="modalHead"><div><h3>Add a component</h3><p>Add reusable electronics to your inventory.</p></div><button className="close" onClick={close}>×</button></div><label>Component name<input placeholder="e.g. Arduino Uno"/></label><div className="two"><label>Category<select><option>Microcontroller</option><option>Sensor</option><option>Display</option><option>Actuator</option><option>Other</option></select></label><label>Quantity<input type="number" defaultValue="1" min="1"/></label></div><label>Condition<select><option>Excellent</option><option>Good</option><option>Fair</option><option>For parts</option></select></label><button className="primary" onClick={close}>Add to inventory</button></div></div>}

