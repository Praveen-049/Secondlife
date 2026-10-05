export function getAuthErrorMessage(error,action='login'){
 const message=(error?.message??'').toLowerCase();
 const code=(error?.code??'').toLowerCase();
 if(action==='update'){
  if(code==='pgrst205'||message.includes('relation')&&message.includes('profiles'))return 'Profile storage is not set up yet. Run the SecondLife profiles SQL migration in your Supabase project.';
  if(code==='pgrst204'||message.includes('column')&&message.includes('profiles'))return 'The profiles table is out of date. Re-run the latest SecondLife profiles SQL migration.';
  if(code==='42501'||message.includes('row-level security')||message.includes('permission denied'))return 'Supabase blocked this profile update. Check that the profiles RLS policies from the setup SQL are installed.';
  if(code==='23514'||code==='23502')return 'The profiles table schema does not match this app. Re-run the latest SecondLife profiles SQL migration.';
 }
 if(!navigator.onLine||message.includes('network')||message.includes('fetch'))return 'Unable to connect right now. Please try again.';
 if(message.includes('email not confirmed')||code.includes('email_not_confirmed'))return 'Please verify your email before signing in.';
 if(action==='login'&&(message.includes('invalid login credentials')||message.includes('invalid_credentials')||code==='invalid_credentials'))return 'Email or password is incorrect.';
 if(message.includes('password')&&(message.includes('weak')||message.includes('at least')||message.includes('characters')))return 'Password must contain at least 8 characters.';
 if(action==='register'&&(message.includes('already registered')||message.includes('already exists')))return 'Unable to create an account with these details. Try signing in or resetting your password.';
 if(action==='register')return 'We could not create your account. Please check your details and try again.';
 if(action==='reset')return 'We could not send the reset email right now. Please try again.';
 if(action==='update')return 'We could not update your profile right now. Please try again.';
 return 'Something went wrong. Please try again.';
}