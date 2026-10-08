document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("#quoteForm");
 if(!form)return;
 const file=form.querySelector('input[type="file"]');
 file.addEventListener("change",()=>{
  const max=10*1024*1024;
  if(file.files[0]&&file.files[0].size>max){file.setCustomValidity("Please choose a file smaller than 10 MB.");file.reportValidity();file.value="";}
  else file.setCustomValidity("");
 });
});
