import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import AuthApi from "./AuthApi";
import Cookies from 'js-cookie';


function Login() {

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    const [email, setEmailLogin] = useState('');
    const [password, setPasswordLogin] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    let { isAuthenticated, updateStatus } = useContext(AuthApi);
    const BASE_URL = " http://localhost:5001/api/"
    //This  statement is very important as it allows us to use the cookies
    Axios.defaults.withCredentials = true;

    let history = useHistory('');

    const readCookie = () => {
        const user = Cookies.get("user");
        if (user) {
            // setAuth(true);
        }
    }
    useEffect(() => {
        readCookie();
    }, []);

    
  

    //function for login button
    const login_btn = () => {

        Axios.post(BASE_URL+'login', {
            email: email,
            password: password,
        }).then((response) => {

            console.log(response, "Errorrr");

            if (response.data.message) {

                setLoginStatus(response.data.message);

            } else {
                updateStatus(true);
                Cookies.set("user", "logInTrue");
                if (response.data.loggedIn === true) {
                    setLoginStatus("Welcome" + ", " + response.data.user[0].fullName);
                }
                history.push("/applicantdetails");

            }
        });
    };

    //used to welcome the user which proves that the cookies are working
    useEffect(() => {
        Axios.get(BASE_URL+"login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoginStatus("Welcome" + ", " + response.data.user[0].fullName);
            }
        })
    }, []);

    return (
        <div className="auth-inner">
            <form onSubmit={handleSubmit}>
                <h3>Login</h3>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Email"
                        onChange={(e) => {
                            setEmailLogin(e.target.value);
                        }} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password"
                        onChange={(e) => {
                            setPasswordLogin(e.target.value);
                        }} />
                </div>
                <button onClick={login_btn} className="btn btn-primary btn-block">Login</button>
                <h5>{loginStatus}</h5>
            </form>
        </div>

    )
}
export default Login;