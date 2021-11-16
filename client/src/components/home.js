import React, { useState } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom'


function Home() {
    const [fullNameReg, setFullNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [phoneReg, setPhoneReg] = useState('');
    const [skill1Reg, setSkill1Reg] = useState('');
    const [skill2Reg, setSkill2Reg] = useState('');
    const [skill3Reg, setSkill3Reg] = useState('');
    const [statusReg, setStatusReg] = useState(null);
    const [availabilityReg, setAvailabilityReg] = useState(null);

    const [fileReg, setFileReg] = useState([])

    const uploadFiles = () =>{
        const formData = new FormData;
        formData.append("file",fileReg);
        formData.append("upload_preset","lfb7cfjz")
       
        Axios.post(
            "https://api.cloudinary.com/v1_1/raghavbobal1/image/upload",
            formData
        ).then((response) => {
            console.log(response);
        });
    };


    const BASE_URL = " http://localhost:5001/api/"

    const [error, setError] = useState('');

    let history = useHistory();

    // this sends the data inputed by the user to the backend
    const registerMe = () => {
        Axios.post(BASE_URL + 'register', {
            fullName: fullNameReg,
            email: emailReg,
            phone: phoneReg,
            skill1: skill1Reg,
            skill2: skill2Reg,
            skill3: skill3Reg,
            status: statusReg,
            availability: availabilityReg
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
        let skill1 = document.getElementById("skill1");
        let skill2 = document.getElementById("skill2");
        let skill3 = document.getElementById("skill3");
        let status = document.getElementById("status");
        let availability =document.getElementById("availability");
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

        let phone = document.getElementById("phone");
        if (phone.value === "") {
            setError("Please enter your phone number");
            return false;
        }
        if (phone.value.length < 10) {
            setError("Please enter a valid 10 digit phone number");
            return false;
        }
        if(skill1.value.length < 1) {
            setError("Please enter 3 skills.");
            return false;
        }
        if(skill2.value.length < 1) {
            setError("Please enter 3 skills.");
            return false;
        }
        if(skill3.value.length < 1) {
            setError("Please enter 3 skills.");
            return false;
        }
        if(status.value === null) {
            setError("Please enter your status.");
            return false;
        }
        if(availability.value === "") {
            setError("Please enter your availability.");
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


    

    return (
        <form>
            <div className="auth-inner">
                <h3>Enter your details</h3>

                <div className="form-group">

                    <label>Full Name</label>
                    <input id="full-name" type="text" className="form-control" placeholder="Example- John Doe"
                        onChange={(e) => {
                            setFullNameReg(e.target.value);
                        }} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input id="email" type="email" className="form-control" placeholder="Example- john.doe@gmail.com"
                        onChange={(e) => {
                            setEmailReg(e.target.value);
                        }} />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input id="phone" type="tel" className="form-control" placeholder="Example- 4161234567" pattern="[0-9]"  minLength="0" maxLength="10" 
                        onChange={(e) => {
                            setPhoneReg(e.target.value);
                        }} />
                </div>

                <div className="form-group">
                    <label>Top 3 Skills and Experience</label>
                    <input id="skill1" type="text" className="form-control" placeholder="Example- React.js(3 years)"
                        onChange={(e) => {
                            setSkill1Reg(e.target.value);
                        }} />
                        <br/>
                    <input id="skill2" type="text" className="form-control" placeholder="Example- Node.js(6 Months)"
                        onChange={(e) => {
                            setSkill2Reg(e.target.value);
                        }} />
                        <br/>
                    <input id="skill3" type="text" className="form-control" placeholder="Example- Java(1 year)"
                        onChange={(e) => {
                            setSkill3Reg(e.target.value);
                        }} />        
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select className="form-control minimal" id="status" value={statusReg} onChange={(e) => setStatusReg(e.target.value)} >
                        <option value="Select">Select your status</option>
                        <option value="Student">Student</option>
                        <option value="Graduate">Graduate</option>
                    </select>
                </div>
        
                <div className="form-group">
                    <label>Availability</label>
                    <select id="availability" className="form-control minimal" value={availabilityReg} onChange={(e) => setAvailabilityReg(e.target.value)}>
                        <option value="Select">Select your availability</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                    </select>
                </div>
                <form action="#">
                <div className="form-group">
                    <label>Upload your Resume</label>
                    <input id="file" type="file" className="form-control" multiple={false} name="file" onChange={(event) => {
                        setFileReg(event.target.files[0]);
                    }} /> 
                </div>
                <button id="submitButton" onClick={() => {uploadFiles(); validate(); }} className="btn btn-primary btn-block">Submit</button>
                </form>
                <h5>{error}</h5>
            </div>
        </form>
    )


   
}


export default Home;
