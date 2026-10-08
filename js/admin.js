const AG_ADMIN_KEY="ag-admin-session";
const AG_DEMO_USER="admin";
const AG_DEMO_PASSWORD="AGdemo2026!";
function agRead(key){
 try{return JSON.parse(localStorage.getItem(key)||"[]");}
 catch(error){console.error(`Unable to read ${key}`,error);return [];}
}
function agWrite(key,value){
 try{localStorage.setItem(key,JSON.stringify(value));return true;}
 catch(error){console.error(`Unable to save ${key}`,error);alert("Could not save. Browser storage may be full.");return false;}
}
function agEscape(value){
 return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function agProtectPage(){
 if(!location.pathname.endsWith("login.html")&&localStorage.getItem(AG_ADMIN_KEY)!=="true")location.href="login.html";
}
function agAdminLogin(event){
 event.preventDefault();
 const form=event.currentTarget;
 if(form.elements.username.value===AG_DEMO_USER&&form.elements.password.value===AG_DEMO_PASSWORD){
  localStorage.setItem(AG_ADMIN_KEY,"true");location.href="dashboard.html";
 }else form.querySelector(".login-error").textContent="The username or password is incorrect.";
}
function agLogout(){localStorage.removeItem(AG_ADMIN_KEY);location.href="login.html";}
function agShowAdminData(){
 const quotes=agRead("ag-quote-requests"),messages=agRead("ag-contact-messages"),projects=agRead("ag-projects"),services=agRead("ag-services");
 document.querySelectorAll("[data-admin-count]").forEach(el=>{
  const count=({quotes,messages,projects,services})[el.dataset.adminCount];
  el.textContent=count?.length||0;
 });
 document.querySelectorAll("[data-admin-records]").forEach(container=>{
  const kind=container.dataset.adminRecords,records=kind==="quotes"?quotes:messages;
  if(!records.length){container.innerHTML='<p class="muted-copy mb-0">No submissions stored in this browser yet.</p>';return;}
  const columns=kind==="quotes"?["fullName","email","projectType","location","submittedAt"]:["name","email","subject","message","submittedAt"];
  container.innerHTML=`<div class="table-responsive"><table class="table align-middle"><thead><tr>${columns.map(c=>`<th>${agEscape(c.replace(/[A-Z]/g,x=>" "+x.toLowerCase()))}</th>`).join("")}</tr></thead><tbody>${records.map(row=>`<tr>${columns.map(c=>`<td>${agEscape(row[c]&&typeof row[c]==="object"?row[c].name||JSON.stringify(row[c]):row[c]||"—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
 });
 agRenderCollection("projects");agRenderCollection("services");
}
function agRenderCollection(kind){
 const container=document.querySelector(`[data-admin-list="${kind}"]`);
 if(!container)return;
 const records=agRead(`ag-${kind}`);
 if(!records.length){container.innerHTML='<p class="muted-copy mb-0">No custom records saved yet.</p>';return;}
 const fields=kind==="projects"?["name","type","location","area","year"]:["name","description"];
 container.innerHTML=`<div class="table-responsive"><table class="table align-middle"><thead><tr>${fields.map(field=>`<th>${agEscape(field)}</th>`).join("")}<th>Actions</th></tr></thead><tbody>${records.map(record=>`<tr>${fields.map(field=>`<td>${agEscape(record[field]||"—")}</td>`).join("")}<td><button class="btn btn-sm btn-outline-dark me-1" type="button" data-record-edit="${agEscape(record.id)}" data-kind="${kind}">Edit</button><button class="btn btn-sm btn-outline-danger" type="button" data-record-delete="${agEscape(record.id)}" data-kind="${kind}">Delete</button></td></tr>`).join("")}</tbody></table></div>`;
}
function agResetEditor(kind){
 const form=document.querySelector(kind==="projects"?"#adminProjectForm":"#adminServiceForm");
 if(!form)return;
 form.reset();form.elements.id.value="";
 document.querySelector(`#${kind==="projects"?"projectFormTitle":"serviceFormTitle"}`).textContent=`Add ${kind==="projects"?"project":"service"}`;
 document.querySelector(`#cancel${kind==="projects"?"Project":"Service"}Edit`).classList.add("d-none");
}
function agBeginEdit(kind,id){
 const record=agRead(`ag-${kind}`).find(item=>item.id===id);
 const form=document.querySelector(kind==="projects"?"#adminProjectForm":"#adminServiceForm");
 if(!record||!form)return;
 for(const [key,value] of Object.entries(record))if(form.elements[key]&&form.elements[key].type!=="file")form.elements[key].value=value;
 document.querySelector(`#${kind==="projects"?"projectFormTitle":"serviceFormTitle"}`).textContent=`Edit ${kind==="projects"?"project":"service"}`;
 document.querySelector(`#cancel${kind==="projects"?"Project":"Service"}Edit`).classList.remove("d-none");
 form.scrollIntoView({behavior:"smooth",block:"start"});
}
function agDeleteRecord(kind,id){
 if(!confirm(`Delete this ${kind==="projects"?"project":"service"}?`))return;
 const records=agRead(`ag-${kind}`).filter(item=>item.id!==id);
 if(agWrite(`ag-${kind}`,records))agShowAdminData();
}
async function agSaveProject(form,event){
 event.preventDefault();
 const records=agRead("ag-projects"),id=form.elements.id.value;
 let image=form.elements.imageUrl.value.trim();
 const file=form.elements.imageFile.files[0];
 if(file){
  if(file.size>1024*1024){alert("Please choose an image smaller than 1 MB.");return;}
  if(!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)){alert("Please select a PNG, JPG, WebP or GIF image.");return;}
  try{image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});}
  catch(error){console.error("Unable to read project image",error);alert("The selected image could not be read.");return;}
 }
 const previous=records.find(item=>item.id===id);
 const record={id:id||`project-${Date.now()}`,name:form.elements.name.value.trim(),type:form.elements.type.value,location:form.elements.location.value.trim(),area:form.elements.area.value.trim(),year:form.elements.year.value,image:image||previous?.image||""};
 const next=id?records.map(item=>item.id===id?record:item):[record,...records];
 if(agWrite("ag-projects",next)){form.reset();agResetEditor("projects");agShowAdminData();}
}
function agSaveService(form,event){
 event.preventDefault();
 const records=agRead("ag-services"),id=form.elements.id.value;
 const record={id:id||`service-${Date.now()}`,name:form.elements.name.value.trim(),description:form.elements.description.value.trim()};
 const next=id?records.map(item=>item.id===id?record:item):[record,...records];
 if(agWrite("ag-services",next)){form.reset();agResetEditor("services");agShowAdminData();}
}
document.addEventListener("DOMContentLoaded",()=>{
 if(document.body.dataset.adminProtected==="true")agProtectPage();
 const login=document.querySelector("#adminLogin");if(login)login.addEventListener("submit",agAdminLogin);
 document.querySelectorAll("[data-admin-logout]").forEach(button=>button.addEventListener("click",event=>{event.preventDefault();agLogout();}));
 const projectForm=document.querySelector("#adminProjectForm");
 if(projectForm)projectForm.addEventListener("submit",event=>agSaveProject(projectForm,event));
 const serviceForm=document.querySelector("#adminServiceForm");
 if(serviceForm)serviceForm.addEventListener("submit",event=>agSaveService(serviceForm,event));
 document.querySelector("#cancelProjectEdit")?.addEventListener("click",()=>agResetEditor("projects"));
 document.querySelector("#cancelServiceEdit")?.addEventListener("click",()=>agResetEditor("services"));
 document.addEventListener("click",event=>{
  const button=event.target.closest("[data-record-edit],[data-record-delete]");
  if(!button)return;
  const kind=button.dataset.kind,id=button.dataset.recordEdit||button.dataset.recordDelete;
  if(button.dataset.recordEdit)agBeginEdit(kind,id);else agDeleteRecord(kind,id);
 });
 agShowAdminData();
});
