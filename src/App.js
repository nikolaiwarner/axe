import 'aframe'
import 'aframe-chromakey-material'
import 'aframe-layout-component'
import 'aframe-particle-system-component'
import 'aframe-text-geometry-component'
import {Entity, Scene} from 'aframe-react'
import Artyom from 'artyom.js'
import React, { Component } from 'react'
import './App.css'

const SpeechToText = new Artyom()

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentCamera: 1,
      text: 'axe me anything',
      text1: 'axe me ',
      text2: 'anything'
    }
  }

  componentDidMount () {
    document.querySelectorAll('video').forEach((video) => { video.play() })

    SpeechToText.say('axe')

    setInterval(() => {
      let currentCamera = this.state.currentCamera + 1
      if (currentCamera > 4) {
        currentCamera = 1
      }
      this.setState({
        currentCamera
      })
    }, 2000)

    window.SpeechToTextDictation = SpeechToText.newDictation({
      continuous: true,
      onResult: (text) => {
        console.log('Recognized text: ', text)
        let text1 = text
        let text2 = ''
        if (text.length > 1) {
          let middle = Math.floor(text.length / 2)
          text1 = text.slice(0, middle)
          text2 = text.slice(middle)
        }
        this.setState({
          text, text1, text2
        })
      },
      onStart: () => {
        console.log('Dictation started by the user')
      }
    })
    window.SpeechToTextDictation.start()
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
          </a-assets>

          <Entity camera={{active: (this.state.currentCamera === 1)}} position={{x: 0, y: 0, z: 0}} />
          <Entity position={{x: -6, y: 2, z: -15}}>
            <Entity
              name={'axeboy1'}
              geometry={{primitive: 'plane', width: 4, height: 8}}
              position={{x: 0, y: 2.5, z: -4}}
              rotation={{x: 0, y: 0, z: 0}}
              material={'color: pink'}
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
              color={'crimson'}
              height={1}
              radius={1}
              position={{x: 0, y: 0, z: 0}}
            />
          </Entity>

          <Entity camera={{active: (this.state.currentCamera === 2)}} position={{x: 0, y: 0, z: 0}} rotation={{x: 0, y: 90, z: 0}} />

          <Entity camera={{active: (this.state.currentCamera === 3)}} position={{x: 0, y: 0, z: 0}} rotation={{x: 0, y: 180, z: 0}} />

          <Entity camera={{active: (this.state.currentCamera === 4)}} position={{x: 0, y: 0, z: 0}} rotation={{x: 0, y: 270, z: 0}} />

          <a-sky color='#00FF00' />
        </Scene>
        <div>[{this.state.text}]</div>
      </div>
    )
  }
}

export default App
