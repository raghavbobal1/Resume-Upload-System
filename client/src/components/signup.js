import React, { useState } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom'


function SignUp() {
    const [fullNameReg, setFullNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const BASE_URL = " http://localhost:5001/api/"

    const [error, setError] = useState('');

    let history = useHistory();

    // this sends the data inputed by the user to the backend
    const registerMe = () => {
        Axios.post(BASE_URL + 'signup', {
            fullName: fullNameReg,
            email: emailReg,
            password: passwordReg
        }).then((response) => {
            if(response.data.error){
            console.log(response.data.error)
            return false;
            }else if(response.data.message){
                console.log(response.data.message)
                return true;
            }
        }).catch((error) => {
            console.log(error);
        })
    };

    function validate() {
        let name = document.getElementById("full-name");
        if (name.value === "") {
            setError("Please enter your full name");
            return false;
        }
        if (name.value.length < 4) {
            setError("The name must contain atleast 4 letters");
            return false;
        }
        
        let email = document.getElementById("email");
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){
            setError("Please enter a valid email address");
            return false;
        }

        let password = document.getElementById("password");
        if (password.value === "") {
            setError("Password cannot be empty");
            return false;
        }
        if (password.value.length < 8) {
            setError("Password must contain atleast 8 letters");
            return false;
        }

        else {
            registerMe();
            setError("You have been successfully registered")
            return true;
         }

    }

    const refreshStop = document.getElementById('submitButton');
    if (refreshStop) {
        refreshStop.addEventListener('click', function (e) {
            e.preventDefault();
        });
    }

    const checkEmail = () => {
        Axios.post(BASE_URL + 'check', {
            email: emailReg,
        }).then((response) => {
            console.log(response.data.message)
            setError(response.data.message);
            return false;
        })
    }

    

    return (
        <form>
            <div className="auth-inner">
                <h3>Sign Up</h3>

                <div className="form-group">

                    <label>Full Name</label>
                    <input id="full-name" type="text" className="form-control" placeholder="Full Name"
                        onChange={(e) => {
                            setFullNameReg(e.target.value);
                        }} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input id="email" type="email" className="form-control" placeholder="Email"
                        onChange={(e) => {
                            setEmailReg(e.target.value);
                        }} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input id="password" type="password" className="form-control" placeholder="Password"
                        onChange={(e) => {
                            setPasswordReg(e.target.value);
                        }} />
                </div>
                <button id="submitButton" onClick={() => {checkEmail(); validate(); }} className="btn btn-primary btn-block">Sign up</button>

                <h5>{error}</h5>
            </div>
        </form>
    )


   
}


export default SignUp;
