import React,{ useState, useEffect } from 'react';
import {fire,db } from './fire';
import Login from './containers/Login/Login.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './containers/Dashboard/Dashboard';
import Prodet from './components/Prodet/Prodet';
import UpdateProd from './components/UpdateProd/UpdateProd';
import Products from './containers/Products/Products';
import Users from './containers/Users/Users';
import ProdDescription from './containers/ProdDescription/ProdDescription';

import './App.css';


const App = () => {
  const [user,setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email,password)
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/email-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  }

  const handleSignup = () => {
    clearErrors();
    fire
      .auth()
      .createUserWithEmailAndPassword(email,password)
      .then((user) => {
        db.collection("users").doc(`${user.user.email}`).set({
        admin: false,
        email: user.user.email,
        id: user.user.uid,
        creationTime: new Date(user.user.metadata.creationTime).toLocaleString(),
        lastSignInTime: new Date(user.user.metadata.lastSignInTime).toLocaleString(),
      })
      .then(function() {
    console.log("Document successfully written!");
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });
      })
      .catch(err => {
        switch(err.code){
          case "email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
  }

  const handleLogout = () => {
    fire.auth().signOut();
  }

  const authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      if(user){
        clearInputs();
        console.log(user);
        setUser(user);
        setUserId(user.uid);
        setEmail(user.email);
        db.collection("users").doc(`${user.email}`).update({
        "lastSignInTime": new Date(user.metadata.lastSignInTime).toLocaleString()
      })

      }
      else{
        setUser("");
      }
    })
  }

  useEffect(() => {
    authListener();
  },[])

  return (
    <div className="App">
    {user ? (
      <Router>
          <Switch>
            <Route path='/' exact component={() => <Dashboard handleLogout={handleLogout} />} />
            <Route path='/Prodet' component={Prodet} />
            <Route path='/UpdateProd' component={UpdateProd} />
            <Route path='/products' component={() => <Products handleLogout={handleLogout} userId={userId} email={email}/>} />
            <Route path='/users' component={() => <Users handleLogout={handleLogout} email={email} />} />
            <Route path='/ProdDescription/:id' component={() => <ProdDescription handleLogout={handleLogout} />} />
          </Switch>
        </Router>
    ) : (
      <Login
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleSignup={handleSignup}
      hasAccount={hasAccount}
      setHasAccount={setHasAccount}
      emailError={emailError}
      passwordError={passwordError}
      />
    )}

    </div>
  );
}

export default App;
