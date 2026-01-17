function getProjectFromURL(){
 return new URLSearchParams(location.search).get("project")||"lughlt";
}
