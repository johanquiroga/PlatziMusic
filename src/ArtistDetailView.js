/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import ArtistBox from './ArtistBox';
import CommentList from './CommentList';

import { getArtist } from './ApiClient';

import { firebaseAuth, firebaseDatabase } from './firebase';

export default class ArtistDetailView extends Component<{}> {
  state = {
    comments: []
  }

  componentDidMount() {
    this.getArtistCommentsRef().on('child_added', this.addComment);
  }

  componentWillUnmount() {
    this.getArtistCommentsRef().off('child_added', this.addComment);
  }

  addComment = (data) => {
    const comment = data.val()
    this.setState({
      comments: this.state.comments.concat(comment)
    })
  }

  handleSend = () => {
    const { uid, photoURL } = firebaseAuth.currentUser
    const { text } = this.state
    const artistCommentsRef = this.getArtistCommentsRef()

    var newCommentRef = artistCommentsRef.push();
    newCommentRef.set({
      text,
      userPhoto: photoURL,
      uid,
    });

    this.setState({ text: '' });
  }

  getArtistCommentsRef = () => {
    const { id } = this.props.artist

    return firebaseDatabase.ref(`comments/${id}`)
  }

  handleChangeText = (text) => this.setState({text})

  render() {
    const { artist } = this.props
    const { comments } = this.state

    return (
      <View style={styles.container}>
        <ArtistBox artist={artist} />
        <CommentList comments={comments} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.text}
            placeholder="Opina sobre este artista!"
            onChangeText={this.handleChangeText}
          />
          <TouchableOpacity onPress={this.handleSend}>
            <Icon name="ios-send-outline" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  inputContainer: {
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    paddingHorizontal: 15,
    marginVertical: 10
  }
});
