let cookies = document.cookie;
let x = getCookie("isLoggedin");

if (x == 'true') {
    document.querySelector('#loginSignup').innerHTML = "<a class='nav-link' id = 'loginSignup' href='/userDetails'>Logged In</a>";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    console.log(forms);
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

// A function to change change the className of the current element
//used in userDetail.ejs page
function changeCurrent(className){
    const elements = document.getElementsByClassName('current');

    for(let ele of elements){
        // console.log(ele);
        ele.classList.remove('current');
        ele.classList.add('notCurrent');
    }
    const currentElement = document.getElementsByClassName(className);
    // console.log(currentElement);

    for(let ele of currentElement){
        // console.log()
        ele.classList.remove('notCurrent');
        ele.classList.add('current');
    }
}

function removePrevForm(){
    //remove the form from the frontend first
    const oldForm = document.getElementsByClassName('register-form');

    for(let i of oldForm){
        i.remove();
    }
}

