$(function(){

    //position of the ristrict sign
    $(".ristrict").each(function(){
        $(this).css({
            position: "relative",
            top: "28px",
            left: $(this).parent().find("input").innerWidth() - 38.5,
            color: "red"
        });
    });

    //position of icons 
    $(".fas, .far").each(function() {
        $(this).css({
            position: "relative",
            top: "28px",
            left: "10px",
            opacity: .6
        });
    });

    //on focus and on blur for inputs
    var oldPlace;
    $("input[data-type = 'typing']").on({
        focus: function() {
            $(this).css({
                borderWidth: "1px",
                outline: "#3F3F61",    
            });
            oldPlace = $(this).attr("placeholder");
            $(this).removeAttr("placeholder");
            $('<span></span>', {
                text: oldPlace,
                class: "reference",
                style: "color: #3F3F61;z-index:999;position:absolute;top: 8px;left:8px;background:#fff"
            }).prependTo($(this).parent());
            $(".reference").wrap("<div class='referenceUp' style='position:relative'></div>")
        },
        blur: function() {
            $(this).css({
                borderWidth: "0 0 1px 1px",
                outline: "#B3B2BB",    
            });
            $(this).attr("placeholder", oldPlace);
            $(this).parent().find(".referenceUp").remove();
        }
    });


    //the file upload input (Special Case)
    $(".data .ristrict").css({
        position: "absolute",
        left: $(".data .ristrict").parent().innerWidth() - 22,
    });

    $(".data .fas").css({
        position: "absolute",
        left: $(".data .fas").parent().innerWidth() - 15,
        top: "30px",
        zIndex: 1,
    });

    $("input[type='file']").on("change", function(){
        $(".data span:first-child").css({color: "#B3B2BB", fontWeight: "normal"}).text($(this).val().slice(12)); // to remove the c://fakepath from the input value and return the rest of value and insert it in th span text
        if ($(this).val().length < 1) {
            $(".data span:first-child").text("Upload your ID Photo");
        }
    });

    //the emails suggestion for email input 
    var emailsArray = ["gmail.com", "yahoo.com", "hotmail.com", "mcafee.com"],
        list = "";
    $(".email").on("keyup", "input", function(e) { //Must be keyup event to can handle the (up,down,esc) keys and must be keypress for the enter key to can handle it
        var key  = e.keyCode,
            keyUp    = 38,
            keyDown  = 40,
            keyEnter = 13,
            keyEsc   = 27;
        
        list = ""; //for clearing the list every time you enter a character, then after checking, fill the list again.
        
        //for any key unless the up,down,esc,enter keys
        if(key != keyUp && key != keyDown && key != keyEnter && key != keyEsc) {

            if(! $(this).next().is('.emailslist')) { //check that there is not a ul next to the email div to not repeat it every time you keyup
                $("<ul class='emailslist'></ul>").insertAfter($(this));
            }    
            var inputValue = $(this).val();
            for(var i = 0; i < emailsArray.length; i++) {
                if(inputValue.indexOf("@") != -1) {
                    var newValue = inputValue.substring(0, inputValue.indexOf("@"));
                    list += "<li>" + newValue + "@" + emailsArray[i] + "</li>";
                } else {
                    list += "<li>" + inputValue + "@" + emailsArray[i] + "</li>";
                }
            }
            
            $(".emailslist").html(list); // must be html(), not append() or prepend()
            $(".emailslist li").eq(0).addClass("selected");
            
            //check if the value of the input is nothing in case of using backspace to delete the input value  
            if($(this).val().length === 0) {
                $(".emailslist").fadeOut(500, function(){
                    $(".emailslist").remove();
                }); 
            }
        
        //for the up key
        } else if (key == keyUp){
            console.log($(".email").children().length);
            var myListUp = $(".email").find("ul");
            if(myListUp.find(".selected").is(":first-child")) {
                myListUp.find(":eq(-1)").addClass("selected").siblings().removeClass("selected");
            } else {
                myListUp.find(".selected").prev().addClass("selected").siblings().removeClass("selected");
            }
        
        //for the esc key
        } else if (key == keyEsc) {
            $(".email").find("ul").fadeOut(500, function(){
                $(".email").find("ul").remove();
            });

        //for the down key
        } else if (key == keyDown) {
            var myListDown = $(".email").find("ul");
            if(myListDown.find(".selected").is(":last-child")) {
                myListDown.find(":eq(0)").addClass("selected").siblings().removeClass("selected");
            } else {
                myListDown.find(".selected").next().addClass("selected").siblings().removeClass("selected");
            }

        }   
    });

    //for the enter key >> must using the keypress event (outside the keyup function)
    $(".email input").keypress(function myEnterPress(e) {
        if(e.keyCode == 13) {
            var listText = $(".email").find("ul").find(".selected").text();
            $(".email input").val(listText);
            $(".email").find("ul").fadeOut(500, function(){
                $(".email").find("ul").remove();
            });

            e.preventDefault(); //prevent the enter key default >> submit the form
        }
    });

    //for clicking on any list at the emails list
    $("body").on({
        
        click: function() {
            var liText = $(this).text();
            $("input[type='email']").val(liText);
            $(".emailslist").fadeOut(500, function(){
                $(".emailslist").remove();
            });
            $("input[type='email']").focus();
        }
    }, ".emailslist li");

    //on blur the email input
    $(".email input").on("blur", function() {
        $(".email").find("ul").fadeOut(500, function(){
            $(".email").find("ul").remove();
        });
    });

    //check the password confirmation
    var password = $(".pass input"),
        confirmPassword = $(".confirmpass input");

    function check() {
        if(password.val() === confirmPassword.val() && password.val().length > 0 && $(confirmPassword).val().length > 0) {
            confirmPassword.next("span").text("Confirmed").removeClass("unconfirmed").addClass("confirmed").fadeIn(500);

        } else if (password.val() != confirmPassword.val() && password.val().length > 0 && $(confirmPassword).val().length > 0) {
            confirmPassword.next("span").text("unConfirmed").removeClass("confirmed").addClass("unconfirmed").fadeIn(500);
        } else {
            $(confirmPassword).next("span").fadeOut(500);
        }

        if (password.val().length > 0) {
            $(".pass .ristrict").text("").append('<i class="fas fa-eye-slash"></i>');
        } else {
            $(".pass .ristrict i").fadeOut();
            $(".pass .ristrict").text("*");
        } 

        if (confirmPassword.val().length > 0 ) {
            $(".confirmpass .ristrict").text("").append('<i class="fas fa-eye-slash"></i>');
        } else {
            $(".confirmpass .ristrict i").fadeOut();
            $(".confirmpass .ristrict").text("*");
        }
    }

    //trigger the check function when oninput the password input and the confirm password input
    document.querySelector(".confirmpass input").addEventListener("input", check);
    document.querySelector(".pass input").addEventListener("input", check);

    //show & hide password 
    $(".password").on("click", ".fa-eye-slash",function() {
        var passwordInput = $(this).parent().next("input");
        var typeAttr = $(this).parent().next("input").attr("type");
        if(typeAttr == "password") {
            passwordInput.attr("type", "text")
        } else {
            passwordInput.attr("type", "password")
        }
    });


    
    /* (OPTION 1) >> IF you want to check all the inputs and the conditions together at the same time and show you all achieved errors together >> {use the function below with its validation function}*/

    //check validation form when submiting
    var x,y,z,a,b,c,d,e,f,g,h,i;
    $(".form").submit(function() {
        validation();
        if (x == 0 || y == 0 || z == 0 || a == 0 || b == 0 || c == 0 || d == 0 || e == 0 || f == 0 || g == 0 || h == 0 || i == 0) {
         return false; 
       } else {
         return true;
       }
    });
        
    //The Validation function (Master Function)
    function validation() {
        var     firstNameInput       = document.querySelector(".firstname input"),
                lastNameInput        = document.querySelector(".lastname input"),
                userNameInput        = document.querySelector(".username input"),
                emailInput           = document.querySelector(".email input"),
                passwordInput        = document.querySelector(".pass input"),
                confirmpasswordInput = document.querySelector(".confirmpass input"),
                telInput             = document.querySelector(".tel input"),
                uploadInput          = document.querySelector(".data input"),
                maleInput            = document.querySelector(".male input"),
                femaleInput          = document.querySelector(".female input"),
                checkTermsInput      = document.querySelector(".terms input");
        

        var     firstNameInputValue       = firstNameInput.value.trim(),
                lastNameInputValue        = lastNameInput.value.trim(),
                userNameInputValue        = userNameInput.value.trim(),
                emailInputValue           = emailInput.value.trim(),
                passwordInputValue        = passwordInput.value.trim(),
                confirmpasswordInputValue = confirmpasswordInput.value.trim(),
                telInputValue             = telInput.value.trim();
                

        if (firstNameInputValue === "") {
            typingInputsError(firstNameInput, "Must Fill this Input");
            x = 0;

        } else if (firstNameInputValue.length > 0 && !(isName(firstNameInputValue))) {
            typingInputsError(firstNameInput, 
                `Name Must not contain any Special Charachters except:
                (.),('),(-)
                Note: Space is allowed`);
                x = 0;
        } else {
            x = 1;
        }



        if (lastNameInputValue === "") {
            typingInputsError(lastNameInput, "Must Fill this Input");
            y = 0;

        } else if (lastNameInputValue.length > 0 && !(isName(lastNameInputValue))) {
            typingInputsError(lastNameInput,
                `Name Must not contain any Special Charachters except:
                (.),('),(-)
                Note: WhiteSpace is allowed`);
                y = 0;
        } else {
            y = 1;
        }



        if (userNameInputValue === "") {
            typingInputsError(userNameInput, "Must Fill this Input");
            z = 0;

        } else if (userNameInputValue.length > 0 && !(isUserName(userNameInputValue))) {
            typingInputsError(userNameInput,
                `Your username Must not contain Special Characters except:
                (-),(_),(.)
                Note: Uppercase Alphabetical Character is not allowed.
                Note: username Must be between (4-20) chars only.
                Note: Whitespace is not allowed.`);
                z = 0;
        } else {
            z = 1;
        }


    
        if (emailInputValue === "") {
            typingInputsError(emailInput, "Must Fill this Input");
            a = 0;

        } else if(!(isEmail(emailInputValue))) {
            a = 0;
        } else {
            a = 1;
        }



        if (passwordInputValue === "") {
            typingInputsError(passwordInput, "Must Fill this Input");
            b = 0;
        } else {
            b = 1;
        }



        if(confirmpasswordInputValue === "") {
            typingInputsError(confirmpasswordInput, "Must Fill this Input");
            c = 0;
        } else {
            c = 1;
        }



        if(passwordInputValue != confirmpasswordInputValue) {
            typingInputsError(confirmpasswordInput, "Passwords doesn't match correctly");
            $(".confirmation").hide();
            d = 0;
        } else {
            d = 1;
        }
        
        
        
        if (passwordInputValue == confirmpasswordInputValue && passwordInputValue.length > 0 && confirmpasswordInputValue.length > 0 &&!(isPassword(confirmpasswordInputValue))) {
            typingInputsError(confirmpasswordInput,
                `Your Password Must contain at least:
                >> one lowercase and uppercase alphabetical Character.
                >> one numeric character.
                Note: any Special Characters are not allowed.
                Note: the Password Must be Eight Characters or longer.`);

             $(".confirmation").hide();
             e = 0;
        } else {
             e = 1;
        }



        if(!(isNumber(telInputValue)) && telInputValue.length > 0) {
            typingInputsError(telInput, "Invalid Number!!, Be sure to set (+) sign before the number country code like: 010+ ,and don't beyond the limit of your phone number length");
            f = 0;
        } else {
            f = 1;
        }


        
        if(uploadInput.value.length < 1) {
            var uploadSpan = uploadInput.parentElement.firstElementChild;
            uploadSpan.style.cssText = 'color: red; font-weight: bold';
            g = 0;
        } else {
            g = 1;
        }


        if(!(maleInput.checked || femaleInput.checked)) {
            checkedInputsError(maleInput, "Select your Gender");
            h = 0;
        } else {
            h = 1;
        }


        if(!(checkTermsInput.checked)) {
            checkedInputsError(checkTermsInput, "Agree to our Terms");
            i = 0;
        } else {
            i = 1;
        }

    }




    /* (OPTION 2) >> IF you want to check every input of the all inputs and every condition of all conditions and show you every achieved error Separately In Order >> {use the function below with its validation function}*/

    /*
    //check validation form when submiting
    $(".form").submit(function() {
        if (validation()) {
        return; 
       } else {
        return false;
       }
   });
   
   //The Validation function (Master Function)
   function validation() {
       var     firstNameInput       = document.querySelector(".firstname input"),
               lastNameInput        = document.querySelector(".lastname input"),
               userNameInput        = document.querySelector(".username input"),
               emailInput           = document.querySelector(".email input"),
               passwordInput        = document.querySelector(".pass input"),
               confirmpasswordInput = document.querySelector(".confirmpass input"),
               telInput             = document.querySelector(".tel input"),
               uploadInput          = document.querySelector(".data input"),
               maleInput            = document.querySelector(".male input"),
               femaleInput          = document.querySelector(".female input"),
               checkTermsInput      = document.querySelector(".terms input");
       

       var     firstNameInputValue       = firstNameInput.value.trim(),
               lastNameInputValue        = lastNameInput.value.trim(),
               userNameInputValue        = userNameInput.value.trim(),
               emailInputValue           = emailInput.value.trim(),
               passwordInputValue        = passwordInput.value.trim(),
               confirmpasswordInputValue = confirmpasswordInput.value.trim(),
               telInputValue             = telInput.value.trim();
               

       if (firstNameInputValue === "") {
           typingInputsError(firstNameInput, "Must Fill this Input");
           return false;

       } else if (firstNameInputValue.length > 0 && !(isName(firstNameInputValue))) {
           typingInputsError(firstNameInput, 
               `Name Must not contain any Special Charachters except:
               (.),('),(-)
               Note: Space is allowed`);
               return false;
        }


       if (lastNameInputValue === "") {
           typingInputsError(lastNameInput, "Must Fill this Input");
           return false;

       } else if (lastNameInputValue.length > 0 && !(isName(lastNameInputValue))) {
           typingInputsError(lastNameInput,
               `Name Must not contain any Special Charachters except:
               (.),('),(-)
               Note: WhiteSpace is allowed`);
               return false;
        }


       if (userNameInputValue === "") {
           typingInputsError(userNameInput, "Must Fill this Input");
           return false;

       } else if (userNameInputValue.length > 0 && !(isUserName(userNameInputValue))) {
           typingInputsError(userNameInput,
               `Your username Must not contain Special Characters except:
               (-),(_),(.)
               Note: Uppercase Alphabetical Character is not allowed.
               Note: username Must be between (4-20) chars only.
               Note: Whitespace is not allowed.`);
               return false;
       }


       if (emailInputValue === "") {
           typingInputsError(emailInput, "Must Fill this Input");
           return false;

       } else if(!(isEmail(emailInputValue))) {
           return false;
       }


       if (passwordInputValue === "") {
           typingInputsError(passwordInput, "Must Fill this Input");
           return false;
       }


       if(confirmpasswordInputValue === "") {
           typingInputsError(confirmpasswordInput, "Must Fill this Input");
           return false;
       }


       if(passwordInputValue != confirmpasswordInputValue) {
           typingInputsError(confirmpasswordInput, "Passwords doesn't match correctly");
           $(".confirmation").hide();
           return false;
       }
       
       
       if (passwordInputValue == confirmpasswordInputValue && passwordInputValue.length > 0 && confirmpasswordInputValue.length > 0 &&!(isPassword(confirmpasswordInputValue))) {
           typingInputsError(confirmpasswordInput,
               `Your Password Must contain at least:
               >> one lowercase and uppercase alphabetical Character.
               >> one numeric character.
               Note: any Special Characters are not allowed.
               Note: the Password Must be Eight Characters or longer.`);

            $(".confirmation").hide();
            return false;
       }


       if(!(isNumber(telInputValue)) && telInputValue.length > 0) {
           typingInputsError(telInput, "Invalid Number!!, Be sure to set (+) sign before the number country code like: 010+ ,and don't beyond the limit of your phone number length");
           return false;
       }


       if(uploadInput.value.length < 1) {
           var uploadSpan = uploadInput.parentElement.firstElementChild;
           uploadSpan.style.cssText = 'color: red; font-weight: bold';
           uploadInput.onchange = function () {
               uploadSpan.style.cssText = 'color: #B3B2BB; font-weight: normal';   
           }
           return false;
       }


       if(!(maleInput.checked || femaleInput.checked)) {
           checkedInputsError(maleInput, "Select your Gender");
           return false;
       }


       if(!(checkTermsInput.checked)) {
           checkedInputsError(checkTermsInput, "Agree to our Terms");
           return false;
       }

       return true; // if all condition above NOT return false ,so the validation() function go to this value that equal to (true) and check this value in the Master (if else) condition in the above function for $(".form").submit 

   }
   */


    //typingInputsError function
    function  typingInputsError(input, error) {
        var theParent       = input.parentElement,
            theErrorSpan    = theParent.querySelector(".error");


        theErrorSpan.innerText = error;
        input.style.cssText = "border-color: red red red red; border-width: 1px 1px 1px 1px";
        

        function deleteError() {
            theErrorSpan.innerText = "";
            input.style.borderColor = "#B3B2BB";
            input.style.borderWidth = "1px 1px 1px 1px";
        }

        input.onfocus = function() {
            deleteError();
        }

        input.oninput = function() {
            deleteError();
        }

        $(".pass input").focus(function() {
            $(".confirmpass .error").text("");
        });
        
    }


    
    //checkedInputsError function
    function  checkedInputsError(input,error) {
        var theParent   = input.parentElement,
            theErrorSpan    = theParent.querySelector(".error");

        theErrorSpan.innerText = error;
        theErrorSpan.style.display = "block";

        input.onchange = function() {
            theErrorSpan.innerText = "";
        }
    }



    //The Regular Expressions
    function isName(name) {
        var myNameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð .'-]+$/u; //international names with super sweet unicode
        return  myNameRegex.test(name);
    }

    function isUserName(username) {
        var myUserName = /^([a-z0-9]|[-._](?![-._])){4,20}$/;
        return  myUserName.test(username);
    }

    function isEmail(email) {
        var myEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // note that this reg exp. doesn't accept any of these chars in the input value >> (! # $ % & ‘ * + – / = ? ^ ` . { | } ~) , otherwise there are different types of email Regexps that accept these previous chars.. you can search for them  
        return myEmailRegex.test(String(email).toLowerCase());
    }

    function isPassword(pass) {
        var myPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return myPasswordRegex.test(pass);
    }

    function isNumber (number) {
        var myNumberRegex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/
        return myNumberRegex.test(number);
    }
});

