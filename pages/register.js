const first = document.querySelector(".cnfpass")
const second = document.querySelector(".reenter")
const reg = document.querySelector(".green-btn")
const alert = document.querySelector(".alert")
const newwr = document.querySelector(".new")

reg.addEventListener("click",function(){
    console.log(first.value)
    console.log(second.value)

    if(first.value == second.value){
        alert.style.display="none"
    }
    else{
        alert.style.display="block"
        second.focus()
    }
})

