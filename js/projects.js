const AG_PROJECTS = [
  {name:"The Courtyard House",location:"Pune, Maharashtra",type:"Residential",area:"2,450 sq.ft.",year:"2025",image:"photo-1600607687939-ce8a6c25118c"},
  {name:"Mira Business Centre",location:"Mumbai, Maharashtra",type:"Commercial",area:"18,000 sq.ft.",year:"2024",image:"photo-1486406146926-c627a92ad1ab"},
  {name:"Casa Verde Villa",location:"Lonavala, Maharashtra",type:"Villa",area:"4,100 sq.ft.",year:"2024",image:"photo-1613977257363-707ba9348227"},
  {name:"The Palm Retreat",location:"Alibaug, Maharashtra",type:"Resort",area:"12,500 sq.ft.",year:"2023",image:"photo-1600607687920-4e2a09cf159d"},
  {name:"Ridgeview Farmhouse",location:"Nashik, Maharashtra",type:"Farmhouse",area:"3,200 sq.ft.",year:"2023",image:"photo-1600566753086-00f18fb6b3ea"},
  {name:"Still House Interiors",location:"Pune, Maharashtra",type:"Interior",area:"1,800 sq.ft.",year:"2025",image:"photo-1600210492486-724fe5c67fb0"},
  {name:"Solstice Residence",location:"Thane, Maharashtra",type:"3D Visualization",area:"2,900 sq.ft.",year:"2024",image:"photo-1600607687644-c7171b42498f"},
  {name:"Garden Lane Homes",location:"Kolhapur, Maharashtra",type:"Residential",area:"6,600 sq.ft.",year:"2023",image:"photo-1600607687920-4e2a09cf159d"}
];
function agImage(id,width=900){return /^(https?:|data:)/.test(id)?id:`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;}
function agEscapeHTML(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function agProjectImage(value,width){
 if(value&&value.startsWith("data:image/")&&/^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(value))return value;
 if(value&&/^https?:\/\//i.test(value)){try{const url=new URL(value);if(url.protocol==="https:"||url.protocol==="http:")return url.href;}catch(error){console.error("Invalid project image URL",error);}}
 if(value&&/^photo-[\w-]+$/.test(value))return agImage(value,width);
 return agImage("photo-1600607687939-ce8a6c25118c",width);
}
function agProjectCard(project){
  return `<div class="col-md-6 col-lg-4 project-item" data-type="${agEscapeHTML(project.type)}"><a class="project-card" href="project-details.html"><div class="project-image"><img src="${agEscapeHTML(agProjectImage(project.image,850))}" alt="${agEscapeHTML(project.name)}" loading="lazy"></div><div class="project-meta"><span>${agEscapeHTML(project.type)}</span><span>${agEscapeHTML(project.year||"")}</span></div><h3>${agEscapeHTML(project.name)}</h3><div class="project-location">${agEscapeHTML(project.location||"")} <span>·</span> ${agEscapeHTML(project.area||"")}</div></a></div>`;
}
document.addEventListener("DOMContentLoaded",()=>{
 const grid=document.querySelector(".project-grid");
 if(!grid)return;
 let customProjects=[];
 try{customProjects=JSON.parse(localStorage.getItem("ag-projects")||"[]");}
 catch(error){console.error("Unable to load custom portfolio entries",error);}
 const projects=[...customProjects,...AG_PROJECTS];
 const featured=grid.dataset.featured==="true";
 grid.innerHTML=(featured?projects.slice(0,3):projects).map(agProjectCard).join("");
 const filterButtons=document.querySelectorAll("[data-project-filter]");
 filterButtons.forEach(button=>button.addEventListener("click",()=>{
  filterButtons.forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  const selected=button.dataset.projectFilter;
  grid.querySelectorAll(".project-item").forEach(card=>card.classList.toggle("d-none",selected!=="All"&&card.dataset.type!==selected));
 }));
});
