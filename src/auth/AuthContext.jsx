import React,{createContext,useContext,useState} from 'react';
import {demoProfileId} from '../data/demoStore';

const AuthContext=createContext(null);
const STORAGE_KEY='secondlife-demo-session';

function readStoredSession(){
 if(typeof window==='undefined')return null;
 for(const storage of [window.localStorage,window.sessionStorage]){
  try{
   const value=storage.getItem(STORAGE_KEY);
   if(value){
    const profile=JSON.parse(value);
    if(!['project_maker','seller','organization'].includes(profile.role)){storage.removeItem(STORAGE_KEY);continue}
    const displayName=profile.role==='organization'?(profile.organization_name||profile.full_name):profile.full_name;
    return {profile,user:{id:profile.id,email:profile.email??null,user_metadata:{full_name:profile.full_name,organization_name:profile.organization_name},created_at:profile.created_at},session:{demo:true},displayName};
   }
  }catch{
   storage.removeItem(STORAGE_KEY);
  }
 }
 return null;
}

export function AuthProvider({children}){
 const [storedSession,setStoredSession]=useState(readStoredSession);
 const [profile,setProfile]=useState(()=>storedSession?.profile??null);
 const user=storedSession?.user??null;
 const session=storedSession?.session??null;
 const loading=false;

 function signInDemo({role,fullName,organizationName='',organizationType='',location='',email='',remember}){
  const safeName=fullName.trim();
  const safeOrganization=organizationName.trim();
  if(!['project_maker','seller','organization'].includes(role))return {error:new Error('Choose a valid SecondLife account type.')};
  if(role==='organization'&&!safeOrganization)return {error:new Error('Enter your organization name.')};
  if(role!=='organization'&&!safeName)return {error:new Error('Enter your full name.')};
  const identityName=role==='organization'?safeOrganization:safeName;
  const id=demoProfileId(role,identityName);
  const nextProfile={id,full_name:safeName||safeOrganization,organization_name:role==='organization'?safeOrganization:null,organization_type:role==='organization'?organizationType:null,location:location.trim(),email:email.trim()||null,role,avatar_url:null,onboarding_completed:true,created_at:new Date().toISOString()};
  const serialized=JSON.stringify(nextProfile);
  const preferred=remember?window.localStorage:window.sessionStorage;
  const other=remember?window.sessionStorage:window.localStorage;
  other.removeItem(STORAGE_KEY);
  preferred.setItem(STORAGE_KEY,serialized);
    const nextSession={profile:nextProfile,user:{id,email:nextProfile.email,user_metadata:{full_name:nextProfile.full_name,organization_name:nextProfile.organization_name},created_at:nextProfile.created_at},session:{demo:true},displayName:identityName};
  setProfile(nextProfile);
  setStoredSession(nextSession);
  return {error:null};
 }

 async function signOut(){
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
  setStoredSession(null);
  setProfile(null);
  return {error:null};
 }

 async function refreshProfile(){return profile}

 async function updateProfile(updates){
  if(!user)return null;
  const nextProfile={...profile,...updates};
  const serialized=JSON.stringify(nextProfile);
  const storage=window.localStorage.getItem(STORAGE_KEY)!==null?window.localStorage:window.sessionStorage;
  storage.setItem(STORAGE_KEY,serialized);
  setProfile(nextProfile);
    setStoredSession(current=>({...current,profile:nextProfile,user:{...current.user,user_metadata:{...current.user.user_metadata,full_name:nextProfile.full_name,organization_name:nextProfile.organization_name}}}));
  return nextProfile;
 }

 return <AuthContext.Provider value={{user,session,profile,profileLoadError:null,loading,signOut,refreshProfile,signInDemo,updateProfile,isSupabaseConfigured:false}}>{children}</AuthContext.Provider>;
}

export function useAuth(){
 const context=useContext(AuthContext);
 if(!context)throw new Error('useAuth must be used within AuthProvider.');
 return context;
}
