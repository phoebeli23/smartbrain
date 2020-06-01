import React from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

const particlesOptions = {
  particles: {
    number: {
      value: 45,
      density: {
        enable: true,
        value_area: 1000
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signIn',
  isSignedIn: false,
  detectionError: '',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }
    })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onPictureSubmit = () => {
    this.setState({ 
      boxes: [], 
      imageUrl: this.state.input,
      detectionError: '',
    });
    fetch('https://agile-harbor-24400.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      }),
    })
      .then(response => response.json())
      .then(response => {
        const numFaces = response['outputs'][0]['data']['regions'].length;
        if (numFaces) {
          fetch('https://agile-harbor-24400.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
              increment: numFaces
            }),
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response))
      })
      .catch(err => {
        this.setState({detectionError: 'No face detected'})
      });
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const boxes = [];
    data['outputs'][0]['data']['regions'].forEach(elem => {
      const bound = elem['region_info']['bounding_box'];
      boxes.push({
        leftCol: bound.left_col * width,
        topRow: bound.top_row * height,
        rightCol: width - (bound.right_col * width),
        bottomRow: height - (bound.bottom_row * height),
      });
    });
    return boxes;
  }

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes })
  }

  onRouteChange = (route) => {
    if (route === 'signIn' || route === 'register') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <ErrorMessage msg={this.state.detectionError}/>
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
          : (
            route === 'signIn'
              ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    );
  }
}

export default App;
