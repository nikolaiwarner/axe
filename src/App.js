import 'aframe'
import 'aframe-chromakey-material'
import {Entity, Scene} from 'aframe-react'
import Artyom from 'artyom.js'
import React, { Component } from 'react'
import './App.css'

const SpeechToText = new Artyom()
SpeechToText.initialize({
  lang: 'en-US',
  continuous: true,
  soundex: true,
  debug: true, // Show messages in the console
  executionKeyword: 'and do it now',
  listen: true,
  name: 'Axe'
}).then(() => {
  console.log('Artyom has been succesfully initialized')
}).catch((err) => {
  console.error('Artyom error: ', err)
})

class App extends Component {
  componentDidMount () {
    document.querySelectorAll('video').forEach((video) => { video.play() })

    SpeechToText.say('Hello World !')
  }

  render () {
    return (
      <Scene>
        <a-assets>
          <video id='smoke' className='video' src='video/smoke.mp4' loop autoPlay={false} />
        </a-assets>
        <Entity
          geometry='primitive: box'
          material='shader: chromakey; src: #smoke; color: 1 1 1'
          scale='100 50 0'
          position='0 0 -20'
          rotation='0 0 0'
        />

      </Scene>
    )
  }
}

export default App
