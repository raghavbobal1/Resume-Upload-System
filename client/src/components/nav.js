import { Link } from "react-router-dom"

//This file contains the code for nav-bar

function Nav() {

  return (
    <nav className="navbar navbar-expand navbar-light fixed-top">
      <div className="container">

        <Link className="navbar-brand" to={'/'}>Home</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={'/login'} className="nav-link">Login</Link>
            </li>
          </ul>


        </div>
      </div>

    </nav>


  )
}



export default Nav;