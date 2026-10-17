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
    
//Validate email
    let email = document.getElementById("email").value.trim();
    if (email === "") {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }
//Make sure email includes @
    if(!email.includes("@")){
        document.getElementById("err-emailsign").style.display = "block";
        isValid=false;
    }

//Validate flavor
    let flavor = document.getElementById("flavor").value;
    if(flavor == "none"){
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }
//Validate cone
    let methodSelected = false;
    let methodButtons = document.getElementsByName("method");
    for (let i=0; i<methodButtons.length; i++){
        if(methodButtons[i].checked){
            methodSelected = true;
        }
    }
   if (!methodSelected) {
     document.getElementById("err-method").style.display = "block";
    isValid = false;
    } else{
        document.getElementById("err-method").style.display = "none";
    }
    //Do not submit the form if the data is in-valid
    return isValid;

};

    function clearErrors() {
        let errors = document.getElementsByClassName("err");
        for (let i=0; i<errors.length; i++) {
            errors[i].style.display = "none";
        }
    }


        
    

