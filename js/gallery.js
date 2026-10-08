document.addEventListener("DOMContentLoaded",()=>{
 const modalElement=document.getElementById("imageViewer");
 if(!modalElement)return;
 const modal=new bootstrap.Modal(modalElement);
 const image=modalElement.querySelector("img");
 const title=modalElement.querySelector(".viewer-title");
 document.querySelectorAll("[data-view-image]").forEach(tile=>tile.addEventListener("click",()=>{
  image.src=tile.dataset.viewImage;image.alt=tile.dataset.title||"Architecture project image";
  title.textContent=tile.dataset.title||"";modal.show();
 }));
});
