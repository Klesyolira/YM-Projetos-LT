async function loadProject(slug){
 const base=`projects/${slug}/`;
 const conf=await fetch(base+"project.json").then(r=>r.json());
 document.title=conf.name;

 let html=Storage.get("project_html_"+slug);
 if(!html){
  html=await fetch(base+conf.entry).then(r=>r.text());
 }

 document.getElementById("app").innerHTML=html;
 runScripts();
}

function runScripts(){
 document.querySelectorAll("#app script").forEach(s=>{
  const n=document.createElement("script");
  if(s.src)n.src=s.src;
  else n.textContent=s.textContent;
  document.body.appendChild(n);
  s.remove();
 });
}
