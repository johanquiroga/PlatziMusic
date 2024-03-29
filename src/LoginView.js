/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ImageBackground,
  Image
} from 'react-native';

import FBSDK, {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk';

import { Actions } from 'react-native-router-flux';

import firebase, { firebaseAuth } from "./firebase";

const { FacebookAuthProvider } = firebase.auth;

export default class LoginView extends Component<{}> {

  state = {
    credentials: null
  }

  componentWillMount() {
    this.authenticateUser()
  }

  authenticateUser = () => {
    AccessToken.getCurrentAccessToken().then((data) => {
      const { accessToken } = data
      const credential = FacebookAuthProvider.credential(accessToken)
      firebaseAuth.signInWithCredential(credential).then((credentials) => {
        Actions.home()
      }, function(error) {
        console.log("Sign In Error", error);
      });
    })
  }

  handleLoginFinished = (error, result) => {
    if (error) {
      console.error(result.error);
    } else if (result.isCancelled) {
      alert("login is cancelled.");
    } else {
      this.authenticateUser()
    }
  }

  handleButtonPress = () => {
    Actions.home()
  }

  render() {
    return (
      <ImageBackground source={require('./img/background.jpg')} style={styles.container}>
      <Image style={styles.logo} source={require('./img/logo.png')} />
        <Text style={styles.welcome}>
          Bienvenidos a PlatziMusic
        </Text>
        <LoginButton
          readPermissions={["public_profile", "email"]}
          onLoginFinished={this.handleLoginFinished}
          onLogoutFinished={() => alert("logout.")}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    backgroundColor: 'transparent',
    color: 'white'
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  }
});
