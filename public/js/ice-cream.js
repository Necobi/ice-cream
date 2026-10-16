//alert("Hello, ice cream!");
//alert("hello");
document.getElementById("ice-cream-form").onsubmit = () => {
//alert("hi");
    let isValid = true;

    // Clear all errors
    clearErrors();

// Validate first name
    let name = document.getElementById("name").value.trim();
    if (name === "") {
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }
    

    let email = document.getElementById("email").value.trim();
    if (email === "") {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    if(!email.includes("@")){
        document.getElementById("err-emailsign").style.display = "block";
        isValid=false;
    }

    let flavor = document.getElementById("flavor").value;
    if(flavor == "none"){
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }

    let methodSelected = false;
    let methodButtons = document.getElementsByName("method");
    for (let i=0; i<methodButtons.length; i++){
        if(methodButtons[i].checked){
            methodSelected = true;
        }
    }

     document.getElementById("err-method").style.display = "block";
    isValid = false;
};

    function clearErrors() {
        let errors = document.getElementsByClassName("err");
        for (let i=0; i<errors.length; i++) {
            errors[i].style.display = "none";
        }
    }

        
    

