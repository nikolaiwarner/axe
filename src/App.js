import 'aframe'
import 'aframe-chromakey-material'
import 'aframe-layout-component'
import 'aframe-particle-system-component'
import 'aframe-text-geometry-component'
import {Entity, Scene} from 'aframe-react'
import Artyom from 'artyom.js'
import React, { Component } from 'react'
import './App.css'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomBool = () => !!randomInt(0, 1)

const SpeechToText = new Artyom()

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentCamera: 1,
      hitting: false,
      swinging: false,
      text: 'axe me anything',
      text1: 'axe me ',
      text2: 'anything'
    }
  }

  componentDidMount () {

    // setInterval(() => {
    //   let currentCamera = this.state.currentCamera + 1
    //   if (currentCamera > 4) {
    //     currentCamera = 1
    //   }
    //   this.setState({
    //     currentCamera
    //   })
    // }, 2000)

    this.startVideo()
    this.startDictation()
    this.startQuietTimeline()
  }

  onSomeoneSaysSomething (text) {
    console.log('said: ', text)
    if (text.length < 16) return
    console.log('axing: ', text)
    let text1 = text
    let text2 = ''
    // if (text.length > 1) {
    //   let middle = Math.floor(text.length / 2)
    //   text1 = text.slice(0, middle)
    //   text2 = text.slice(middle)
    // }
    if (!this.state.swinging && !this.state.hitting) {
      this.setState({
        text,
        text1,
        text2,
        swinging: true
      }, () => {
        let swingVideo = document.querySelector('#swing1')
        swingVideo.currentTime = 0
        swingVideo.play()
        let hitDelay = 2000
        setTimeout(() => {
          this.setState({currentCamera: randomInt(3, 4)})
        }, randomInt(0, hitDelay))
        setTimeout(() => {
          this.setState({hitting: true})
          setTimeout(() => {
            this.setState({hitting: false})
          }, randomInt(300, 1500))
          // TODO: animate explosion ......

          // Possibly show alt camera angle
          if (randomBool()) {
            setTimeout(() => {
              this.setState({currentCamera: randomInt(3, 4)})
            }, randomInt(0, 1000))
          }

          // Resume loop
          setTimeout(() => {
            this.setState({swinging: false, hitting: false}, () => {
              this.startQuietTimeline()
            })
          }, randomInt(1000, 3000))
        }, hitDelay)
      })
    }
  }

  startVideo () {
    document.querySelectorAll('video').forEach((video) => { video.play() })
  }

  startDictation () {
    SpeechToText.say('axe')
    window.SpeechToTextDictation = SpeechToText.newDictation({
      continuous: true,
      onResult: this.onSomeoneSaysSomething.bind(this),
      onStart: () => {}
    })
    window.SpeechToTextDictation.start()
  }

  startQuietTimeline () {
    if (!this.state.swinging && !this.state.hitting) {
      this.setState({currentCamera: 1})
      setTimeout(() => {
        if (!this.state.swinging && !this.state.hitting) {
          this.setState({currentCamera: 2})
          setTimeout(() => {
            this.startQuietTimeline()
          }, randomInt(4000, 8000))
        }
      }, randomInt(3000, 8000))
    }
  }

  render () {
    return (
      <div>
        <Scene
          embedded
          vr-mode-ui='enabled: false'
          className='scene'
        >
          <a-assets>
            <a-asset-item id='optimerBoldFont' src='https://rawgit.com/mrdoob/three.js/dev/examples/fonts/optimer_bold.typeface.json' />

            <img id='axeboy1' src='video/temp-face1.jpg' />
            <img id='axeboy2' src='video/temp-face2.jpg' />

            <video id='swing1' src='video/temp-swing2.mp4' autoPlay loop muted playsInline className={'video'} />
          </a-assets>
          <a-sky color='#00FF00' />

          <Entity position={{x: 0, y: 0, z: 0}} rotation={{x: 0, y: 90, z: 0}}>
            <Entity camera={{active: (this.state.currentCamera === 1)}} />
            <Entity
              name={'axeboy1'}
              geometry={{primitive: 'plane', width: 4, height: 8}}
              position={{x: 0, y: 2.5, z: -4}}
              rotation={{x: 0, y: 0, z: 0}}
              material={{src: '#axeboy1'}}
            />
            {this.state.hitting &&
              <Entity
                position={{x: 0, y: -5, z: 0}}
                particle-system={{color: '#FF00FF'}}
                maxAge={2}
              />
            }
          </Entity>

          <Entity position={{x: 0, y: 0, z: 0}} rotation={{x: 0, y: 180, z: 0}}>
            <Entity camera={{active: (this.state.currentCamera === 2)}} />
            <Entity
              id={'axeboy2'}
              name={'axeboy2'}
              geometry={{primitive: 'plane', width: 4, height: 8}}
              position={{x: 0, y: 2.5, z: -4}}
              rotation={{x: 0, y: 0, z: 0}}
              material={{src: '#axeboy2'}}
            />
          </Entity>


          <Entity camera={{active: (this.state.currentCamera === 3)}} position={{x: 0, y: 0, z: 0}} />
          <Entity camera={{active: (this.state.currentCamera === 4)}} position={{x: 0, y: 0, z: -2}} rotation={{x: 0, y: 0, z: -20}} />
          <Entity position={{x: -6, y: 2, z: -15}}>
            <Entity
              name={'axeboyswing1'}
              geometry={{primitive: 'plane', width: 4, height: 8}}
              position={{x: 0, y: 2.5, z: -4}}
              rotation={{x: 0, y: 0, z: 0}}
              material={{src: '#swing1'}}
            />
            <Entity name={'text'} position={{x: 0, y: 1, z: 0}} layout='type: line; plane: xz'>
              <Entity
                name={'text1'}
                text-geometry={`value: ${this.state.text1}`}
                material={'color: #fff'}
              />
              <Entity
                name={'text2'}
                rotation={{x: 0, y: 0, z: 0}}
                text-geometry={`value: ${this.state.text2}`}
                material={'color: #fff'}
              />
            </Entity>
            <Entity
              name={'stump'}
              geometry={{primitive: 'cylinder'}}
              material={'color: crimson'}
              height={1}
              radius={1}
              position={{x: 0, y: 0, z: 0}}
            />
          </Entity>


        </Scene>
        <div>[{this.state.text}]</div>
      </div>
    )
  }
}

export default App
