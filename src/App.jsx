import React,{useState} from 'react';
import {ArrowLeft,ArrowRight,Building2,Check,CircuitBoard,Eye,EyeOff,Leaf,LockKeyhole,Mail,Package,Recycle,ShieldCheck,Sparkles,UserRound,Users,Zap} from 'lucide-react';
import {Link,Navigate,Route,Routes,useLocation,useNavigate,useParams} from 'react-router-dom';
import {AuthProvider,useAuth} from './auth/AuthContext';
import {getAuthErrorMessage} from './lib/authErrors';
import {supabase} from './lib/supabase';
import {WorkspaceApp} from './Workspace';
import {ORGANIZATION_TYPES,ROLE_CONFIG} from './data/demoStore';
import './styles.css';
import './auth.css';
import './auth-routes.css';

const roles=[
 {id:'project_maker',title:'PROJECT MAKER',description:'I need reusable electronic components to build projects.',icon:CircuitBoard},
 {id:'seller',title:'SELLER',description:'I have unused electronic components or devices to sell or donate.',icon:Package},
 {id:'organization',title:'ORGANIZATION',description:'We manage electronic resources and connect them with projects.',icon:Building2}
];

function homeFor(user,profile){return user?`${ROLE_CONFIG[profile?.role]?.base??'/roles'}/dashboard`:'/roles'}

function AuthStory(){return <section className="authStory" aria-label="SecondLife circular electronics platform">
 <div className="authBrand"><div className="authBrandMark"><Recycle size={22}/></div><span>SecondLife</span></div>
 <div className="authStoryBody">
  <div className="authEyebrow"><span/> CIRCULAR ELECTRONICS PLATFORM</div>
  <h1>Give electronics<br/>a second life.</h1>
  <p>Connect unused electronic components with people who can turn them into useful projects.</p>
  <div className="reuseVisual" aria-label="Electronic components connected in a reuse cycle">
   <div className="circuitTrace traceOne"/><div className="circuitTrace traceTwo"/><div className="circuitTrace traceThree"/>
   <span className="circuitNode nodeOne"/><span className="circuitNode nodeTwo"/><span className="circuitNode nodeThree"/>
   <div className="visualChip chipBoard"><Zap size={22}/><span>ESP32</span><small>CONTROL UNIT</small></div>
   <div className="visualChip chipSensor"><Check size={19}/><span>SENSOR</span><small>READY TO REUSE</small></div>
   <div className="visualChip chipDisplay"><div className="displayBars"><i/><i/><i/></div><span>OLED</span><small>DISPLAY MODULE</small></div>
   <div className="reuseCore"><div><Recycle size={34}/></div><span>REUSE<br/>LOOP</span></div>
   <div className="visualCaption"><span className="captionDot"/> COMPONENTS, RECONNECTED</div>
  </div>
 </div>
 <div className="authStoryFoot"><span>Reuse. Build. Reduce e-waste.</span><span className="storyFootMark"><Leaf size={15}/> BUILT FOR A CIRCULAR FUTURE</span></div>
</section>}

function AuthLayout({children}){return <main className="authShell"><AuthStory/><section className="authPanel"><div className="authPanelInner">
 <div className="mobileBrand"><div className="authBrandMark"><Recycle size={21}/></div><span>SecondLife</span></div>
 {children}
 <div className="privacyNote"><ShieldCheck size={16}/><span>Your demo name and profile are saved only in this browser.</span></div>
 </div></section></main>}

function AuthField({label,icon:Icon,children}){return <label className="authField"><span>{label}</span><div className="authInputWrap"><Icon size={18}/>{children}</div></label>}
function PasswordControl({value,onChange,visible,onToggle,autoComplete,placeholder,id}){return <div className="authInputWrap"><LockKeyhole size={18}/><input id={id} type={visible?'text':'password'} autoComplete={autoComplete} placeholder={placeholder} value={value} onChange={onChange} required/><button type="button" className="passwordToggle" aria-label={visible?'Hide password':'Show password'} onClick={onToggle}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>}
function AuthError({children}){return children?<div className="authFeedback errorFeedback" role="alert">{children}</div>:null}
function AuthSuccess({children}){return children?<div className="authFeedback successFeedback" role="status">{children}</div>:null}

function RoleSelectPage(){
 const {user,profile}=useAuth();
 if(user)return <Navigate to={homeFor(user,profile)} replace/>;
 return <AuthLayout><div className="welcomeLabel">A SECOND LIFE FOR EVERY COMPONENT</div><h2>How will you use SecondLife?</h2><p className="authIntro">Choose your role to get to the right tools and marketplace.</p><div className="roleEntryCards">{roles.map(({id,title,description,icon:Icon})=><Link className="roleEntryCard" key={id} to={`/login/${id}`}><div className="roleEntryIcon"><Icon size={20}/></div><span><strong>{title}</strong><small>{description}</small></span><span className="roleEntryAction">Continue as {id==='project_maker'?'Project Maker':id==='seller'?'Seller':'Organization'}<ArrowRight size={15}/></span></Link>)}</div><div className="authSwitch">DEMO DATA · Shared password is 1234</div></AuthLayout>
}

function LoginPage(){
 const navigate=useNavigate();
 const location=useLocation();
 const {role}=useParams();
 const {loading:authLoading,signInDemo,user,profile}=useAuth();
 const [fullName,setFullName]=useState('');
 const [organizationName,setOrganizationName]=useState('');
 const [organizationType,setOrganizationType]=useState('College');
 const [locationName,setLocationName]=useState('');
 const [password,setPassword]=useState('');
 const [visible,setVisible]=useState(false);
 const [remember,setRemember]=useState(true);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 if(!ROLE_CONFIG[role])return <Navigate to="/roles" replace/>;
 if(user)return <Navigate to={homeFor(user,profile)} replace/>;
 if(authLoading)return <LoadingScreen label="Checking your session..."/>;
 function submit(event){
  event.preventDefault();setError('');setNotice('');
   if(role==='organization'&&!organizationName.trim()){setError('Enter your organization name.');return}
  if(role!=='organization'&&!fullName.trim()){setError('Enter your name.');return}
   if(password!=='1234'){setError('The password is incorrect. Use the shared demo password.');return}
   setLoading(true);
  const result=signInDemo({role,fullName,organizationName,organizationType,location:locationName,remember});
   if(result.error){setError(result.error.message);setLoading(false);return}
   navigate(location.state?.from||`${ROLE_CONFIG[role].base}/dashboard`,{replace:true});
 }
 return <AuthLayout>
   <Link className="authBackLink" to="/roles"><ArrowLeft size={15}/>Choose another role</Link>
   <div className="welcomeLabel">{ROLE_CONFIG[role].title} LOGIN</div><h2>Sign in as {ROLE_CONFIG[role].singular}</h2>
   <p className="authIntro">Enter your demo profile details to continue to your {ROLE_CONFIG[role].singular.toLowerCase()} workspace.</p>
  <form className="authForm" onSubmit={submit} noValidate>
    {role==='organization'&&<AuthField label="Organization name" icon={Building2}><input type="text" autoComplete="organization" placeholder="Your organization" value={organizationName} onChange={event=>setOrganizationName(event.target.value)} required/></AuthField>}
    {role==='organization'?<AuthField label="Contact person (optional)" icon={UserRound}><input type="text" autoComplete="name" placeholder="Contact person name" value={fullName} onChange={event=>setFullName(event.target.value)}/></AuthField>:<AuthField label="Full name" icon={UserRound}><input type="text" autoComplete="name" placeholder="Your full name" value={fullName} onChange={event=>setFullName(event.target.value)} required/></AuthField>}
    {role==='organization'&&<label className="authField">Organization type<select className="roleSelect" value={organizationType} onChange={event=>setOrganizationType(event.target.value)}>{ORGANIZATION_TYPES.map(type=><option key={type}>{type}</option>)}</select></label>}
    <AuthField label="Location (optional)" icon={role==='organization'?Building2:UserRound}><input type="text" autoComplete="address-level2" placeholder="City or region" value={locationName} onChange={event=>setLocationName(event.target.value)}/></AuthField>
    <div className="authField"><label htmlFor="demo-password">Password</label><PasswordControl value={password} onChange={event=>setPassword(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="current-password" placeholder="Enter demo password" id="demo-password"/></div>
    <div className="authOptions"><label className="rememberOption"><input type="checkbox" checked={remember} onChange={event=>setRemember(event.target.checked)}/><span className="checkVisual"><Check size={13}/></span>Remember me</label><button type="button" className="authTextButton" onClick={()=>setNotice('Demo accounts use the shared password 1234. Create a new demo profile if you need a different name.')}>Forgot password?</button></div>
   <AuthError>{error}</AuthError>
     {notice&&<AuthSuccess>{notice}</AuthSuccess>}
    <button className="authSubmit" type="submit" disabled={loading||authLoading}>{loading?<><span className="loadingSpinner"/>Signing in...</>:<>Sign in<ArrowRight size={18}/></>}</button>
  </form>
  <div className="authSwitch">Demo access only · Shared password: 1234</div>
  <div className="authSwitch">Need a demo profile? <Link to={`/register/${role}`}>Create account</Link></div>
 </AuthLayout>
}

function DemoRegisterPage(){
 const {role}=useParams();
 const {user,profile,signInDemo}=useAuth();
 const navigate=useNavigate();
 const [fullName,setFullName]=useState('');
 const [organizationName,setOrganizationName]=useState('');
 const [organizationType,setOrganizationType]=useState('College');
 const [email,setEmail]=useState('');
 const [locationName,setLocationName]=useState('');
 const [password,setPassword]=useState('');
 const [confirmation,setConfirmation]=useState('');
 const [visible,setVisible]=useState(false);
 const [remember,setRemember]=useState(true);
 const [error,setError]=useState('');
 const title=ROLE_CONFIG[role]?.singular;
 if(!title)return <Navigate to="/roles" replace/>;
 if(user)return <Navigate to={homeFor(user,profile)} replace/>;
 function submit(event){
  event.preventDefault();setError('');
  if(role==='organization'&&!organizationName.trim()){setError('Enter your organization name.');return}
  if(!fullName.trim()){setError(role==='organization'?'Enter a contact person.':'Enter your full name.');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setError('Enter a valid email address.');return}
  if(!locationName.trim()){setError('Enter your location.');return}
  if(password!==confirmation){setError('Passwords do not match.');return}
  if(password!=='1234'){setError('For this demo, use the shared password 1234.');return}
  const result=signInDemo({role,fullName,organizationName,organizationType,email,location:locationName,remember});
  if(result.error){setError(result.error.message);return}
  navigate(`${ROLE_CONFIG[role].base}/dashboard`,{replace:true});
 }
 return <AuthLayout><Link className="authBackLink" to={`/login/${role}`}><ArrowLeft size={15}/>Back to {title} login</Link><div className="welcomeLabel">{ROLE_CONFIG[role].title} · DEMO PROFILE</div><h2>Create your {title.toLowerCase()} profile</h2><p className="authIntro">This creates a browser-local demo profile. It does not create a Supabase account.</p><form className="authForm registerForm" onSubmit={submit} noValidate>{role==='organization'&&<AuthField label="Organization name" icon={Building2}><input autoComplete="organization" placeholder="Organization name" value={organizationName} onChange={event=>setOrganizationName(event.target.value)} required/></AuthField>}<AuthField label={role==='organization'?'Contact person':'Full name'} icon={UserRound}><input autoComplete="name" placeholder={role==='organization'?'Contact person name':'Full name'} value={fullName} onChange={event=>setFullName(event.target.value)} required/></AuthField><AuthField label="Email" icon={Mail}><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event=>setEmail(event.target.value)} required/></AuthField>{role==='organization'&&<label className="authField">Organization type<select className="roleSelect" value={organizationType} onChange={event=>setOrganizationType(event.target.value)}>{ORGANIZATION_TYPES.map(type=><option key={type}>{type}</option>)}</select></label>}<AuthField label="Location" icon={role==='organization'?Building2:UserRound}><input autoComplete="address-level2" placeholder="City or region" value={locationName} onChange={event=>setLocationName(event.target.value)} required/></AuthField><div className="authField"><label htmlFor="demo-register-password">Password</label><PasswordControl value={password} onChange={event=>setPassword(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="new-password" placeholder="Shared demo password: 1234" id="demo-register-password"/></div><div className="authField"><label htmlFor="demo-register-confirm">Confirm password</label><PasswordControl value={confirmation} onChange={event=>setConfirmation(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="new-password" placeholder="Enter password again" id="demo-register-confirm"/></div><div className="authOptions"><label className="rememberOption"><input type="checkbox" checked={remember} onChange={event=>setRemember(event.target.checked)}/><span className="checkVisual"><Check size={13}/></span>Remember me</label><span className="demoPasswordHint">Demo password: 1234</span></div><AuthError>{error}</AuthError><button className="authSubmit" type="submit">Create demo profile<ArrowRight size={18}/></button></form><div className="authSwitch">Already have a demo profile? <Link to={`/login/${role}`}>Sign in</Link></div></AuthLayout>
}

function RegisterPage(){
 const navigate=useNavigate();
 const [fullName,setFullName]=useState('');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [confirmPassword,setConfirmPassword]=useState('');
 const [role,setRole]=useState('');
 const [visible,setVisible]=useState(false);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [success,setSuccess]=useState('');
 async function submit(event){
  event.preventDefault();setError('');setSuccess('');
  const normalizedEmail=email.trim();
  if(!fullName.trim()){setError('Enter your full name.');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)){setError('Enter a valid email address.');return}
  if(password.length<8){setError('Password must contain at least 8 characters.');return}
  if(password!==confirmPassword){setError('Passwords do not match.');return}
  if(!role){setError('Choose the role that best describes you.');return}
  if(!supabase){setError('Authentication is not configured. Add the Supabase URL and anon key to your local environment.');return}
  setLoading(true);
  try{
   const {data,error:signUpError}=await supabase.auth.signUp({email:normalizedEmail,password,options:{data:{full_name:fullName.trim(),role,onboarding_completed:true},emailRedirectTo:window.location.origin+'/auth/callback'}});
   if(signUpError)throw signUpError;
   if(data.session&&data.user){
    const {error:profileError}=await supabase.from('profiles').upsert({id:data.user.id,full_name:fullName.trim(),email:normalizedEmail,role,avatar_url:null,onboarding_completed:true},{onConflict:'id'});
    if(profileError)throw profileError;
   }
   setSuccess('Account created. Please check your email to verify your account.');
  }catch(authError){setError(getAuthErrorMessage(authError,'register'))}
  finally{setLoading(false)}
 }
 return <AuthLayout>
  <div className="welcomeLabel">GET STARTED</div><h2>Create your account</h2>
  <p className="authIntro">Join a community giving useful electronics another life.</p>
  <form className="authForm registerForm" onSubmit={submit} noValidate>
   <AuthField label="Full name" icon={UserRound}><input type="text" autoComplete="name" placeholder="Your name" value={fullName} onChange={event=>setFullName(event.target.value)} required/></AuthField>
   <AuthField label="Email address" icon={Mail}><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event=>setEmail(event.target.value)} required/></AuthField>
  <div className="authField"><label htmlFor="register-password">Password</label><PasswordControl value={password} onChange={event=>setPassword(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="new-password" placeholder="At least 8 characters" id="register-password"/></div>
  <div className="authField"><label htmlFor="confirm-password">Confirm password</label><PasswordControl value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="new-password" placeholder="Enter your password again" id="confirm-password"/></div>
   <fieldset className="roleChoices"><legend>Your role</legend>{roles.map(({id,title,description,icon:Icon})=><button type="button" key={id} className={`roleChoice ${role===id?'selected':''}`} aria-pressed={role===id} onClick={()=>setRole(id)}><Icon size={18}/><span><strong>{title}</strong><small>{description}</small></span>{role===id&&<Check size={16}/>}</button>)}</fieldset>
   <AuthError>{error}</AuthError><AuthSuccess>{success}</AuthSuccess>
   <button className="authSubmit" type="submit" disabled={loading}>{loading?<><span className="loadingSpinner"/>Creating account...</>:<>Create account<ArrowRight size={18}/></>}</button>
  </form>
  <div className="authSwitch">Already have an account? <Link to="/login">Sign in</Link></div>
 </AuthLayout>
}

function ForgotPasswordPage(){
 const [email,setEmail]=useState('');
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [sent,setSent]=useState(false);
 async function submit(event){
  event.preventDefault();setError('');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setError('Enter a valid email address.');return}
  if(!supabase){setError('Authentication is not configured. Add the Supabase URL and anon key to your local environment.');return}
  setLoading(true);
  try{
   const {error:resetError}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/reset-password'});
   if(resetError)throw resetError;
   setSent(true);
  }catch(authError){setError(getAuthErrorMessage(authError,'reset'))}
  finally{setLoading(false)}
 }
 return <AuthLayout><div className="welcomeLabel">ACCOUNT RECOVERY</div><h2>Reset your password</h2><p className="authIntro">Enter your email and we will send instructions to reset your password.</p>
  <form className="authForm" onSubmit={submit} noValidate><AuthField label="Email address" icon={Mail}><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event=>setEmail(event.target.value)} required/></AuthField><AuthError>{error}</AuthError>{sent&&<AuthSuccess>If an account exists for this email, we've sent instructions to reset your password.</AuthSuccess>}<button className="authSubmit" type="submit" disabled={loading}>{loading?<><span className="loadingSpinner"/>Sending reset link...</>:<>Send reset link<ArrowRight size={18}/></>}</button></form>
  <div className="authSwitch"><Link to="/login">Back to sign in</Link></div>
 </AuthLayout>
}

function ResetPasswordPage(){
 const navigate=useNavigate();
 const {user,signOut}=useAuth();
 const [password,setPassword]=useState('');
 const [confirmPassword,setConfirmPassword]=useState('');
 const [visible,setVisible]=useState(false);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [success,setSuccess]=useState(false);
 async function submit(event){
  event.preventDefault();setError('');
  if(password.length<8){setError('Password must contain at least 8 characters.');return}
  if(password!==confirmPassword){setError('Passwords do not match.');return}
  if(!supabase){setError('Authentication is not configured. Add the Supabase URL and anon key to your local environment.');return}
  if(!user){setError('Open the password reset link from your email to continue.');return}
  setLoading(true);
  try{
   const {error:updateError}=await supabase.auth.updateUser({password});
   if(updateError)throw updateError;
   const {error:signOutError}=await signOut();
   if(signOutError)throw signOutError;
   setSuccess(true);
   window.setTimeout(()=>navigate('/login',{replace:true}),1400);
  }catch(authError){setError(getAuthErrorMessage(authError,'update'))}
  finally{setLoading(false)}
 }
 return <AuthLayout><div className="welcomeLabel">SECURE YOUR ACCOUNT</div><h2>Choose a new password</h2><p className="authIntro">Use at least 8 characters for your new password.</p>
  <form className="authForm" onSubmit={submit} noValidate><div className="authField"><label htmlFor="new-password">New password</label><PasswordControl value={password} onChange={event=>setPassword(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="new-password" placeholder="At least 8 characters" id="new-password"/></div><div className="authField"><label htmlFor="confirm-new-password">Confirm new password</label><PasswordControl value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} visible={visible} onToggle={()=>setVisible(!visible)} autoComplete="new-password" placeholder="Enter your new password again" id="confirm-new-password"/></div><AuthError>{error}</AuthError>{success&&<AuthSuccess>Your password has been updated.</AuthSuccess>}<button className="authSubmit" type="submit" disabled={loading||success}>{loading?<><span className="loadingSpinner"/>Updating password...</>:<>Update password<ArrowRight size={18}/></>}</button></form>
  {!user&&<div className="authSwitch"><Link to="/forgot-password">Request a fresh reset email</Link></div>}
 </AuthLayout>
}

function OnboardingPage(){
 const {user,profile,updateProfile}=useAuth();
 const navigate=useNavigate();
 const [fullName,setFullName]=useState(profile?.full_name||user?.user_metadata?.full_name||'');
 const [role,setRole]=useState(profile?.onboarding_completed?profile.role:'');
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 async function submit(event){
  event.preventDefault();setError('');
  if(!fullName.trim()){setError('Enter your full name.');return}
  if(!role){setError('Choose a role to continue.');return}
  setLoading(true);
  try{
    await updateProfile({full_name:fullName.trim(),role,avatar_url:profile?.avatar_url??null,onboarding_completed:true});
    navigate('/dashboard',{replace:true});
    }catch{setError('We could not update your demo profile. Please try again.')}
  finally{setLoading(false)}
 }
 return <main className="onboardingPage"><section className="onboardingPanel"><div className="authBrand"><div className="authBrandMark"><Recycle size={22}/></div><span>SecondLife</span></div><div className="welcomeLabel">YOUR CIRCULAR JOURNEY STARTS HERE</div><h1>Welcome to SecondLife</h1><p>Tell us a little about yourself so we can shape your experience.</p>
    {profileLoadError&&<AuthError>{getAuthErrorMessage(profileLoadError,'update')}</AuthError>}
    <form className="authForm" onSubmit={submit} noValidate><AuthField label="Full name" icon={UserRound}><input type="text" autoComplete="name" value={fullName} onChange={event=>setFullName(event.target.value)} required/></AuthField><fieldset className="roleChoices"><legend>How will you take part?</legend>{roles.map(({id,title,description,icon:Icon})=><button type="button" key={id} className={`roleChoice ${role===id?'selected':''}`} aria-pressed={role===id} onClick={()=>setRole(id)}><Icon size={19}/><span><strong>{title}</strong><small>{description}</small></span>{role===id&&<Check size={16}/>}</button>)}</fieldset><AuthError>{error}</AuthError><button className="authSubmit" type="submit" disabled={loading}>{loading?<><span className="loadingSpinner"/>Saving profile...</>:<>Continue to SecondLife<ArrowRight size={18}/></>}</button></form>
 </section></main>
}

function ProfilePage(){
 const {user,profile,updateProfile}=useAuth();
 const navigate=useNavigate();
 const [fullName,setFullName]=useState(profile?.full_name??'');
 const [avatarUrl,setAvatarUrl]=useState(profile?.avatar_url??'');
 const [role,setRole]=useState(profile?.role??'project_maker');
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [success,setSuccess]=useState('');
 async function submit(event){
  event.preventDefault();setError('');setSuccess('');
  if(!fullName.trim()){setError('Enter your full name.');return}
  if(avatarUrl&&!/^https?:\/\//i.test(avatarUrl)){setError('Enter a valid avatar URL beginning with http:// or https://.');return}
  setLoading(true);
  try{
    await updateProfile({full_name:fullName.trim(),avatar_url:avatarUrl.trim()||null,role,onboarding_completed:true});
    setSuccess('Your demo profile has been updated.');
    }catch{setError('We could not update your demo profile. Please try again.')}
  finally{setLoading(false)}
 }
 return <main className="accountPage"><header className="accountHeader"><button className="accountBack" onClick={()=>navigate('/dashboard')}><ArrowLeft size={17}/>Dashboard</button><div className="brand"><div className="brandmark"><Recycle size={20}/></div><b>SecondLife</b></div></header><section className="accountContent"><div className="accountEyebrow">DEMO ACCOUNT SETTINGS</div><h1>Your profile</h1><p>Manage the profile details saved in this browser.</p><form className="accountForm" onSubmit={submit} noValidate><div className="avatarPreview">{avatarUrl?<img src={avatarUrl} alt="Profile avatar preview"/>:<span>{fullName.trim().split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase()||<UserRound/>}</span>}</div><label className="accountField">Full name<input autoComplete="name" value={fullName} onChange={event=>setFullName(event.target.value)} required/></label><label className="accountField">Email address<input type="text" value="Demo access (no email)" readOnly disabled/><small>This demo gate does not use an email address.</small></label><label className="accountField">Role<select value={role} onChange={event=>setRole(event.target.value)}>{roles.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="accountField">Avatar URL<input type="url" value={avatarUrl} onChange={event=>setAvatarUrl(event.target.value)} placeholder="https://example.com/avatar.jpg"/></label><div className="accountMeta"><span>Demo profile created</span><strong>{user?.created_at?new Date(user.created_at).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):'Not available'}</strong></div><AuthError>{error}</AuthError><AuthSuccess>{success}</AuthSuccess><button className="authSubmit" type="submit" disabled={loading}>{loading?<><span className="loadingSpinner"/>Saving profile...</>:<>Save changes<ArrowRight size={18}/></>}</button></form></section></main>
}

function WorkspacePage({type}){const navigate=useNavigate();return <main className="accountPage"><header className="accountHeader"><button className="accountBack" onClick={()=>navigate('/dashboard')}><ArrowLeft size={17}/>Dashboard</button><div className="brand"><div className="brandmark"><Recycle size={20}/></div><b>SecondLife</b></div></header><section className="accountContent"><div className="accountEyebrow">CIRCULAR ELECTRONICS PLATFORM</div><h1>{type==='seller'?'Seller workspace':'Organization workspace'}</h1><p>Your account is ready. Continue to your SecondLife dashboard to explore reusable components and project matches.</p><button className="authSubmit" onClick={()=>navigate('/dashboard')}>Open dashboard<ArrowRight size={18}/></button></section></main>}

function LoadingScreen({label='Loading your account...'}){return <main className="authLoading" role="status" aria-live="polite"><span className="loadingSpinner"/>{label}</main>}
function RootRedirect(){const {user,profile,loading}=useAuth();return loading?<LoadingScreen/>:<Navigate to={homeFor(user,profile)} replace/>}
function GuestOnly({children}){const {user,profile,loading}=useAuth();if(loading)return <LoadingScreen label="Checking your session..."/>;if(user)return <Navigate to={homeFor(user,profile)} replace/>;return children}
function ProtectedRoute({children,role}){
 const {user,profile,loading}=useAuth();
 const location=useLocation();
 if(loading)return <LoadingScreen label="Loading your SecondLife account..."/>;
 if(!user)return <Navigate to="/roles" replace state={{from:location.pathname}}/>;
 if(profile?.role!==role)return <Navigate to={homeFor(user,profile)} replace/>;
 return children;
}
function AuthCallback(){
 const {user,profile,loading}=useAuth();
 const location=useLocation();
 if(loading)return <LoadingScreen label="Completing secure sign-in..."/>;
 if(user)return <Navigate to={homeFor(user,profile)} replace/>;
 const callbackError=new URLSearchParams(location.search).get('error_description');
 return <AuthLayout><div className="welcomeLabel">SECURE SIGN-IN</div><h2>Sign-in could not be completed</h2><p className="authIntro">{callbackError?'The sign-in link could not be verified. Please request a new link and try again.':'No active sign-in was found. Your link may have expired.'}</p><div className="authSwitch"><Link to="/login">Return to sign in</Link></div></AuthLayout>;
}

function RouteTree(){return <Routes>
 <Route path="/" element={<RootRedirect/>}/>
 <Route path="/roles" element={<RoleSelectPage/>}/>
 <Route path="/login" element={<Navigate to="/roles" replace/>}/>
 <Route path="/login/:role" element={<GuestOnly><LoginPage/></GuestOnly>}/>
 <Route path="/register/:role" element={<GuestOnly><DemoRegisterPage/></GuestOnly>}/>
 <Route path="/register" element={<Navigate to="/roles" replace/>}/>
 <Route path="/forgot-password" element={<Navigate to="/roles" replace/>}/>
 <Route path="/reset-password" element={<Navigate to="/roles" replace/>}/>
 <Route path="/auth/callback" element={<Navigate to="/roles" replace/>}/>
 <Route path="/project-maker/*" element={<ProtectedRoute role="project_maker"><WorkspaceApp/></ProtectedRoute>}/>
 <Route path="/seller/*" element={<ProtectedRoute role="seller"><WorkspaceApp/></ProtectedRoute>}/>
 <Route path="/organization/*" element={<ProtectedRoute role="organization"><WorkspaceApp/></ProtectedRoute>}/>
 <Route path="/dashboard" element={<RootRedirect/>}/>
 <Route path="/components" element={<RootRedirect/>}/>
 <Route path="/projects" element={<RootRedirect/>}/>
 <Route path="/impact" element={<RootRedirect/>}/>
 <Route path="/profile" element={<RootRedirect/>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}

export default function App(){return <AuthProvider><RouteTree/></AuthProvider>}