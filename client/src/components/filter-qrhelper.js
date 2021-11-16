import React, { useEffect, useState, useContext } from 'react'
import '../styles/main-styles.css';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, Link, useHistory } from 'react-router-dom'
import AuthApi from "./AuthApi";
import { NavDropdown } from 'react-bootstrap';
import Cookies from 'js-cookie';

//this
function QrHelper() {
  const [fullName, setFullName] = useState('');
  const BASE_URL = "http://reprolog.net:5001/api/"
  const [drug_code, setName] = useState('');
  const [client_code, setAddress] = useState('');
  const [lot, setLotNum] = useState('');
  const [UniqueCodelist, setuniqueCodeList] = useState([]);
  const [UniqueCodelistDrug, setuniqueCodeListDrug] = useState([]);
  const [UniqueCodelistClient, setuniqueCodeListClient] = useState([]);
  let history = useHistory();

  useEffect(() => {
    fetchListData();
  }, []);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get(BASE_URL+"login").then((response) => {
      if (response.data.loggedIn === true) {
        setFullName(response.data.user[0].fullName);
      }
    })
  }, []);

  const Auth = React.useContext(AuthApi)
  const handleOnClick = () => {
    Cookies.remove("user");
    window.localStorage.removeItem('LOGGEDIN');

    Auth.updateStatus(false);
  }
  const readCookie = () => {
    const user = Cookies.get("userLogin");
    if (user) {
    }
  }
  useEffect(() => {
    readCookie();
  }, [])

  const reprolog_btn = () => {
    history.push("/qr-helper");

  }

  const filter_btn = () => {
    history.push("/filter-qrhelper");

  }



  const fetchListData = () => {
    Axios.get(BASE_URL + 'getdrug').then((response) => {
      setuniqueCodeListDrug(response.data)
    });

    Axios.get(BASE_URL + 'getclient').then((response) => {
      setuniqueCodeListClient(response.data)
    });
  }
  const submitDetails = event => {
    event.preventDefault();
    console.log(drug_code);
    if ((drug_code != '') && (client_code != '')) {
      Axios.get(BASE_URL + 'gethistory', {
        params:
          { drug: drug_code, client: client_code }
      }).then((res) => {
        setuniqueCodeList(res.data)
        // setNewLoad(false)
      }).catch(error => {
        console.log(" not able to get data" + error)
      })
    }
    else {
      Axios.get(BASE_URL + 'gethistorylot', {
        params:
          { lot_num: lot }
      }).then((res) => {
        setuniqueCodeList(res.data)
        // setNewLoad(false)
      }).catch(error => {
        console.log(" not able to get data else" + error)
      })
    }
  }

  return (

    <div>
      <nav className="navbar navbar-expand navbar-light fixed-top">
        <div className="container">

          <Link className="navbar-brand" to={'/'}>Home</Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">

                <NavDropdown title={fullName} className="navDropDown" style={{ color: "black" }}>
                  <NavDropdown.Item>
                    <Link onClick={handleOnClick} to={'/'} className="nav-link">Logout</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </li>
            </ul>
          </div>
        </div>

      </nav>
      <div className="card text-center">
        <div className="card-header">
          <ul className="nav nav-pills card-header-pills">
            <li className="nav-item">
              <a className="nav-link" onClick={reprolog_btn}>Reprolog Main &nbsp; &nbsp; &nbsp;</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" onClick={filter_btn}>Filter and Search</a>
            </li>
          </ul>
        </div>
      </div>
      <br />
      <div className="auth-inner-inner">
      <h3 style={{ textAlign: "center" }}>Please select to filter</h3>
      <div className="form-group col-md-10">
        <label htmlFor="Drug Code"><b>Chemical Indicator</b></label>
        <select className="form-control" value={drug_code}
          onChange={(e) => setName(e.target.value)}>
          <option value="⬇️ Select a Drug ⬇️"> -- Select -- </option>
          {UniqueCodelistDrug.map((val) => <option value={val.drug_code}>{val.drug_namel}</option>)}
        </select>
      </div>
      <div className="form-group col-md-10">
        <label htmlFor="Client Code"><b>Client</b><span></span></label>
        <select className="form-control" value={client_code}
          onChange={(e) => setAddress(e.target.value)}>
          <option value="⬇️ Select a Client ⬇️"> -- Select a client -- </option>
          {UniqueCodelistClient.map((val) => <option value={val.client_code}>{val.client_name}</option>)}
        </select>
      </div>

      <div className="form-group col-md-10">
        <span class="align-text-middle"><h4 style={{ textAlign: "center" }}>Or Search</h4></span>
        <label htmlFor="Client Code"><b>Lot Number</b><span></span></label>
        <input className="form-control" type="text" placeholder="Lot number" value={lot}
          onChange={(e) => setLotNum(e.target.value)} >
        </input>
      </div>
      <br />

      <button className="btn btn-primary btn-block" onClick={(e) => submitDetails(e)}> Search </button>
      <div>
        <br />
        {
          UniqueCodelist.map((val) => {
            console.log(UniqueCodelist);
            return <h3 style={{ textAlign: "center" }}>
              <h6 style={{ color: 'black' }}><u> Last Generated Unique Code :</u></h6>
              {val.unique_code}
            </h3>
          }
          )}
      </div>
      </div>
    </div>
  );
}

export default withRouter(QrHelper);