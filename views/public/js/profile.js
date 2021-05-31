document.querySelector("#validatedCustomFile").onchange = function (evt) {
  const tgt = evt.target || window.event.srcElement,
    files = tgt.files;
  const bigImage = "avatar_user";
  const smallImage = "avatar-circle";
  // FileReader support
  if (FileReader && files && files.length) {
    const fr = new FileReader();
    fr.onload = function () {
      console.log(fr);
      document.getElementById(bigImage).src = fr.result;
      document.getElementsByClassName(smallImage)[0].src = fr.result;
    };
    fr.readAsDataURL(files[0]);
  }

  // Not supported
  else {
    // fallback -- perhaps submit the input to an iframe and temporarily store
    // them on the server until the user's session ends.
  }
};

const btnChangePass = document.querySelector(".change-pass");
const btnSave = document.querySelector(".luu");
const txtPass = document.querySelector(".form-pass");
const txtPass2 = document.querySelector(".form-pass2");

btnChangePass.addEventListener("click", () => {
  txtPass2.classList.toggle("hidden");
  txtPass.classList.toggle("hidden");
});
//   btnSave.addEventListener("click", e => {
//     e.preventDefault();
//     txtPass.classList.toggle("hidden");
//     // txtPass.classList.toggle("hidden");
//   });

const frmUpdateInfo=document.querySelector("#frmUpdateInfo");
var check=false;
frmUpdateInfo.addEventListener("submit",function(e){
    e.preventDefault();
    const password =document.querySelector("#password");
    const re_password =document.querySelector("#re_password");

    if(password.value===re_password.value)
    {
      frmUpdateInfo.submit();
    }
    else
    {
      alert("Repassword is incorrect");

    }
  


})