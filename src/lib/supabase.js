import {createClient} from '@supabase/supabase-js';

export const isSupabaseConfigured=Boolean(import.meta.env.VITE_SUPABASE_URL&&import.meta.env.VITE_SUPABASE_ANON_KEY);
let rememberSession=true;

const authStorage={
 async getItem(key){return window.localStorage.getItem(key)??window.sessionStorage.getItem(key)},
 async setItem(key,value){
  const preferred=rememberSession?window.localStorage:window.sessionStorage;
  const alternate=rememberSession?window.sessionStorage:window.localStorage;
  alternate.removeItem(key);
  preferred.setItem(key,value);
 },
 async removeItem(key){window.localStorage.removeItem(key);window.sessionStorage.removeItem(key)}
};

export function setRememberSession(value){rememberSession=value}
export const supabase=isSupabaseConfigured?createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY,{auth:{storage:authStorage}}):null;