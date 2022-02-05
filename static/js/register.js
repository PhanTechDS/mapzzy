const first = document.querySelector(".cnfpass");
const second = document.querySelector(".reenter");
const reg = document.querySelector(".green-btn");
const alert = document.querySelector(".alert");
const newwr = document.querySelector(".new");

reg.addEventListener("click", function (e) {
  if (first.value == second.value) {
    alert.style.display = "none";
  } else {
    e.preventDefault();
    alert.style.display = "block";
    second.focus();
  }
});
