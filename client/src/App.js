import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ApplicantDetails from './components/applicantdetails'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/home';
import Nav from './components/nav';
import Login from './components/login';
import SignUp from './components/signup';
import FilterQrhelper from './components/filter-qrhelper';
import AuthApi from './components/AuthApi';
import { Redirect } from 'react-router';
import { useContext, useState, useEffect } from 'react';


function App() {

  let [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateStatus = (status) => {
    setIsAuthenticated(status);
  }

  return (
    <AuthApi.Provider value={{ isAuthenticated, updateStatus }}>
      <Router>
        <div>
          <Nav />
          <div className="auth-wrapper">
              <Routes />
          </div>
        </div>
      </Router>
    </AuthApi.Provider>
  )
};

//This function restricts anyone to visit the qr-helper component without logging in
const ProtectedRoute = ({ isAuthenticated , component: Component, ...rest }) => {

  useEffect(() => {
    console.log(isAuthenticated)
  }, [])

  return (
    <Route
      {...rest}
      render={() => {
        if (isAuthenticated || localStorage.getItem("LOGGEDIN")) {
          return <Component />;
        } else {
          return (
            <Redirect to={{ pathname: '/login' }} />
          );
        }
      }}
    />
  );
}



//This contains all the routes for different components

const Routes = () => {
  const { isAuthenticated, updateStatus } = useContext(AuthApi);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <ProtectedRoute exact path="/applicantdetails" isAuthenticated={isAuthenticated} component={ApplicantDetails} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={SignUp} />
      <ProtectedRoute exact path="/filter-qrhelper" isAuthenticated={isAuthenticated} component={FilterQrhelper} />
      <Route component={NotFound} />
    </Switch>

  )
}
//export default()=> <div></div>
export default App;
// for unknown component
function NotFound() {

  return (
    <div>
      <h1 style={{textAlign:"center"}}>Error 404: Page not found.</h1>
    </div>
  )
}