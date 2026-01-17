const Auth={
 users:[
  {user:"admin",pass:"admin",role:"public"},
  {user:"LughLT",pass:"lugh123",role:"user"}
 ],
 login(u,p){
  const f=this.users.find(x=>x.user===u&&x.pass===p);
  if(!f)return false;
  localStorage.setItem("session_user",f.user);
  localStorage.setItem("session_role",f.role);
  localStorage.removeItem("isAdmin");
  return true;
 },
 logout(){localStorage.clear();},
 isLogged(){return !!localStorage.getItem("session_user");},
 isAdmin(){return localStorage.getItem("isAdmin")==="1";},
 elevate(pin){
  if(pin==="4866"&&this.isLogged()){
   localStorage.setItem("isAdmin","1");
   return true;
  }
  return false;
 },
 currentUser(){return localStorage.getItem("session_user");}
};
