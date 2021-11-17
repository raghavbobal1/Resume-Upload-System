import React, { useEffect, useState, useContext } from 'react'
import '../styles/main-styles.css';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, Link, useHistory } from 'react-router-dom'
import AuthApi from "./AuthApi";
import { NavDropdown } from 'react-bootstrap';
import Cookies from 'js-cookie';
import Tablee from './table'
import { MDBInput, MDBCol } from "mdbreact";


//this
function ApplicantDetails() {
  const MAX_NUM_CODE = 1000;
  const [fullName, setFullName] = useState('');
  const BASE_URL = "http://localhost:5001/api/"
  const [students, setStudents] = useState([]);
  const [search, setSearch ] = useState('');
  const [filter, setFilter ] = useState(!false);

const getStud = () =>{
   
      Axios.get("http://localhost:5001/students").then((response) => {
        setStudents(response.data);
        console.log(response.data);
      });
    
};
useEffect(() =>{
   getStud();
}, []);
 
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get(BASE_URL +"login").then((response) => {
      console.log(response.data.data + "res data")
      if (response.data.loggedIn === true) {
        setFullName(response.data.user[0].fullName);
      }
    })
  }, []);

  useEffect(() => {
    const data = window.localStorage.getItem('LOGGEDIN');
    Auth.updateStatus(JSON.parse(Auth.isAuthenticated));
}, [])

useEffect(() => {
    window.localStorage.setItem('LOGGEDIN',JSON.stringify(Auth.isAuthenticated))
}, []);


  const Auth = React.useContext(AuthApi)

  const handleLogOut = () => {
    Auth.updateStatus(false);
    window.localStorage.removeItem('LOGGEDIN');
  }

  const handleOnClick = () => {
    Auth.updateStatus(false);
    Cookies.remove("user");
  }
  const readCookie = () => {
    const user = Cookies.get("user");
    if (user) {
      // setAuth(true);
    }
  }
  useEffect(() => {
    readCookie();
  }, [])
  
  const filterNames = students.filter(name =>{
    return (name.fullName.toLowerCase().includes(search.toLowerCase())
    || name.skill1.toLowerCase().includes(search.toLocaleLowerCase())
    || name.skill2.toLowerCase().includes(search.toLocaleLowerCase())
    || name.skill3.toLowerCase().includes(search.toLocaleLowerCase()) 
    || name.availability.toLowerCase().includes(search.toLocaleLowerCase())
    || name.status.toLowerCase().includes(search.toLocaleLowerCase())  
    )
    
  });

  return (

    <div>
      <nav className="navbar navbar-expand navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={'/'}>Home</Link>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">

                <NavDropdown title= {fullName} className="navDropDown" style={{ color: "black" }}>
                  <NavDropdown.Item>
                    <Link onClick={handleLogOut} to={'/'} className="nav-link">Logout</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </li>
            </ul>      
        </div>
      </nav>

    <div className="searchdiv">
      <MDBCol md="6"> 
      <MDBInput hint="Search" className="searchbar" type="text" containerClass="mt-0" onChange={(e) => {
        setSearch(e.target.value);
        console.log(e.target.value);
      }}
     />
     </MDBCol>
     </div>
    
     <h3 style={{ textAlign: "center"}}>Details of all the applicants</h3>
      <Tablee filterNames ={filterNames} />        
      </div>

   
  );
}

export default withRouter(ApplicantDetails);