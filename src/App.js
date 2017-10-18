import 'aframe'
import 'aframe-chromakey-material'
import 'aframe-layout-component'
import 'aframe-meshline-component'
import 'aframe-particle-system-component'
import 'aframe-text-geometry-component'
import {Entity, Scene} from 'aframe-react'
import Artyom from 'artyom.js'
import React, { Component } from 'react'
import './App.css'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomBool = () => !!randomInt(0, 1)
const randomPhrase = (amount = 5) => {
  let words = 'cats are taking over the entire planet someone please send cookies and they sure are noisy little guys wow'.split(' ')
  return [...Array(amount)].map(() => {
    return words[Math.floor(Math.random() * words.length)]
  }).join(' ')
}
const randomColor = () => {
  return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`
}
const randomFont = () => {
  let fonts = [
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/amaticsc/AmaticSC-Regular.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/carterone/CarterOne.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/corben/Corben-Bold.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/fontdinerswanky/FontdinerSwanky-Regular.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/hanuman/Hanuman-Regular.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/matesc/MateSC-Regular.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/monoton/Monoton-Regular.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/nosifer/Nosifer-Regular.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/reeniebeanie/ReenieBeanie.json',
    'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/sigmarone/SigmarOne-Regular.json'
  ]
  return fonts[randomInt(0, (fonts.length - 1))]
}

const SpeechToText = new Artyom()

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      backgroundColor: 'rgb(0, 255, 0)',
      currentCamera: 1,
      currentFont: randomFont(),
      hitting: false,
      swinging: false,
      text: 'axe me anything',
      text1: '       anything',
      text2: 'axe me         '
    }
  }

  componentDidMount () {
    // setInterval(() => {
    //   this.setState({
    //     currentCamera: 2,
    //     cameraTwoVideo: '#wide4'
    //   })
    // }, 100)

    // this.fakeTalking()

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
    if (text.length > 1) {
      let middle = Math.floor(text.length / 2)
      let numberOfSpaces = (text.length - 1) - middle

      let spaces = [...Array(numberOfSpaces)].map(() => ' ').join('')
      text1 = text.slice(0, middle)
      text1 = text1 + spaces
      text2 = text.slice(middle)
      text2 = spaces + text2
    }
    if (!this.state.swinging && !this.state.hitting) {
      this.resetAllVideos()
      this.setState({
        currentFont: randomFont(),
        currentFontSize: randomInt(15, 24),
        currentColor: randomColor(),
        text,
        text1,
        text2,
        swinging: true
      }, () => {
        let hitDelay = 2500
        // Show hit camera
        setTimeout(() => {
          this.setState({currentCamera: randomInt(3, 4)})
        }, randomInt(0, hitDelay))
        // Hit the target
        setTimeout(() => {
          this.setState({hitting: true})
          this.explode()
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

  backgroundColor () {
    setTimeout(() => {
      this.setState({backgroundColor: randomColor()})
      this.backgroundColor()
    }, randomInt(5000, 20000))
  }

  explode () {
    let lines = [...Array(randomInt(10, 30))].map(() => {
      return {
        lineWidth: randomInt(1, 100),
        lineWidthStyler: '1 - p',
        color: `rgb(${randomInt(200, 255)}, ${randomInt(200, 255)}, ${randomInt(200, 255)})`,
        path: `0 0 0, 0 0 0, ${randomInt(-10, 10)} ${randomInt(-5, 5)} ${randomInt(-5, 5)}`
      }
    })
    this.setState({
      backgroundColor: randomColor(),
      lines,
      text1Position: `${randomInt(-10, -1)} ${randomInt(-2, 2)} ${randomInt(-1, 1)}`,
      text1Rotation: `${randomInt(-45, 45)} ${randomInt(-45, 45)} ${randomInt(-45, 45)}`,
      text2Position: `${randomInt(1, 10)} ${randomInt(-2, 2)} ${randomInt(-1, 1)}`,
      text2Rotation: `${randomInt(-45, 45)} ${randomInt(-45, 45)} ${randomInt(-45, 45)}`
    })
  }

  fakeTalking () {
    setTimeout(() => {
      this.onSomeoneSaysSomething(randomPhrase())
      this.fakeTalking()
    }, randomInt(5000, 20000))
  }

  resetAllVideos () {
    let videos = document.querySelectorAll('.video')
    videos.forEach((video) => {
      video.currentTime = 100
      video.play()
    })
  }

  startVideo () {
    document.querySelectorAll('video').forEach((video) => { video.play() })
  }

  startDictation () {
    // SpeechToText.say('axe')
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
          this.setState({
            currentCamera: 2,
            cameraTwoVideo: `#wide${randomInt(1, 4)}`
          })
          setTimeout(() => {
            this.startQuietTimeline()
          }, randomInt(4000, 8000))
        }
      }, randomInt(3000, 8000))
    }
  }

  render () {
    return (
      <div onClick={this.startVideo}>
        <Scene
          embedded
          vr-mode-ui='enabled: false'
          className='scene'
        >
          <a-assets>
            <a-asset-item id='font1' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/amaticsc/AmaticSC-Regular.json' />
            <a-asset-item id='font2' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/carterone/CarterOne.json' />
            <a-asset-item id='font3' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/corben/Corben-Bold.json' />
            <a-asset-item id='font4' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/fontdinerswanky/FontdinerSwanky-Regular.json' />
            <a-asset-item id='font5' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/hanuman/Hanuman-Regular.json' />
            <a-asset-item id='font6' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/matesc/MateSC-Regular.json' />
            <a-asset-item id='font7' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/monoton/Monoton-Regular.json' />
            <a-asset-item id='font8' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/nosifer/Nosifer-Regular.json' />
            <a-asset-item id='font9' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/reeniebeanie/ReenieBeanie.json' />
            <a-asset-item id='font10' src='https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/sigmarone/SigmarOne-Regular.json' />

            <img id='particle' src='video/particle.png' />

            <video id='close1' src='video/close1.mp4' autoPlay loop muted playsInline className={'video'} />
            <video id='swing1' src='video/swing1.mp4' autoPlay loop muted playsInline className={'video'} />
            <video id='wide1' src='video/wide1.mp4' autoPlay loop muted playsInline className={'video'} />
            <video id='wide2' src='video/wide2.mp4' autoPlay loop muted playsInline className={'video'} />
            <video id='wide3' src='video/wide3.mp4' autoPlay loop muted playsInline className={'video'} />
            <video id='wide4' src='video/wide4.mp4' autoPlay loop muted playsInline className={'video'} />
          </a-assets>
          <a-sky color={this.state.backgroundColor} />

          <Entity position={{x: -100, y: 0, z: 0}} rotation={{x: 0, y: 90, z: 0}}>
            <Entity camera={{active: (this.state.currentCamera === 1)}} position={{x: 1.5, y: 3, z: -2.3}} />
            <Entity
              name={'close1'}
              geometry={{primitive: 'plane', width: 4, height: 8}}
              position={{x: 0, y: 2.5, z: -4}}
              rotation={{x: 0, y: 0, z: 0}}
              material={{shader: 'chromakey', src: '#close1', color: '0 1 0'}}
            />
          </Entity>

          <Entity position={{x: 200, y: 0, z: 0}} rotation={{x: 0, y: 180, z: 0}}>
            <Entity camera={{active: (this.state.currentCamera === 2)}} position={{x: 2, y: 2, z: 0}} />
            {this.state.cameraTwoVideo === '#wide1' &&
              <Entity
                id={'wide1'}
                name={'wide1'}
                geometry={{primitive: 'plane', width: 4, height: 8}}
                position={{x: 0, y: 2.5, z: -4}}
                rotation={{x: 0, y: 0, z: 0}}
                material={{shader: 'chromakey', src: '#wide1', color: '0 1 0'}}
              />
            }
            {this.state.cameraTwoVideo === '#wide2' &&
              <Entity
                id={'wide2'}
                name={'wide2'}
                geometry={{primitive: 'plane', width: 4, height: 8}}
                position={{x: 4, y: 2.5, z: -3}}
                rotation={{x: 0, y: 0, z: 0}}
                material={{shader: 'chromakey', src: '#wide2', color: '0 1 0'}}
              />
            }
            {this.state.cameraTwoVideo === '#wide3' &&
              <Entity
                id={'wide3'}
                name={'wide3'}
                geometry={{primitive: 'plane', width: 4, height: 8}}
                position={{x: 0, y: 2.5, z: -4}}
                rotation={{x: 0, y: 0, z: 0}}
                material={{shader: 'chromakey', src: '#wide3', color: '0 1 0'}}
              />
            }
            {this.state.cameraTwoVideo === '#wide4' &&
              <Entity
                id={'wide4'}
                name={'wide4'}
                geometry={{primitive: 'plane', width: 4, height: 8}}
                position={{x: 3, y: 3, z: -2.8}}
                rotation={{x: 0, y: 0, z: 0}}
                material={{shader: 'chromakey', src: '#wide4', color: '0 1 0'}}
              />
            }
          </Entity>

          <Entity position={{x: -6, y: 2, z: -15}}>
            <Entity camera={{active: (this.state.currentCamera === 3)}} position={{x: -1, y: -0.8, z: 3.8}} />
            <Entity camera={{active: (this.state.currentCamera === 4)}} position={{x: 1, y: -2.1, z: 2.8}} rotation={{x: 0, y: 0, z: -40}} />
            <Entity
              layout='type: line; plane: xz'
              name={'text'}
              position={{x: -1, y: -2.2, z: 0.1}}
              rotation={{x: 0, y: -15, z: -15}}
              >
              <Entity
                text={{
                  align: 'center',
                  color: this.state.currentColor,
                  font: this.state.currentFont,
                  shader: 'msdf',
                  value: this.state.text1,
                  width: this.state.currentFontSize
                }}
              >
                {this.state.hitting &&
                  <a-animation
                    attribute='rotation'
                    dur='2000'
                    fill='forwards'
                    from='0 0 0'
                    to={this.state.text1Rotation}
                    repeat='0'
                  />
                }
                {this.state.hitting &&
                  <a-animation
                    attribute='position'
                    dur='2000'
                    fill='forwards'
                    from='0 0 0'
                    to={this.state.text1Position}
                    repeat='0'
                  />
                }
              </Entity>
              <Entity
                text={{
                  align: 'center',
                  color: this.state.currentColor,
                  font: this.state.currentFont,
                  shader: 'msdf',
                  value: this.state.text2,
                  width: this.state.currentFontSize
                }}
              >
                {this.state.hitting &&
                  <a-animation
                    attribute='rotation'
                    dur='2000'
                    fill='forwards'
                    from='0 0 0'
                    to={this.state.text2Rotation}
                    repeat='0'
                  />
                }
                {this.state.hitting &&
                  <a-animation
                    attribute='position'
                    dur='2000'
                    fill='forwards'
                    from='0 0 0'
                    to={this.state.text2Position}
                    repeat='0'
                  />
                }
              </Entity>
            </Entity>
            <Entity position={{x: 0, y: -1.8, z: 0.5}}>
              {!!this.state.hitting &&
                <a-animation
                  attribute='rotation'
                  dur='15000'
                  from='0 0 0'
                  to='-360 360 360'
                  repeat='indefinite'
                />
              }
              {!!this.state.hitting && !!this.state.lines && this.state.lines.map((line, index) => (
                <Entity key={index} meshline={line} />
              ))}
              {!!this.state.hitting &&
                <Entity
                  position={{x: 0, y: 0, z: 0}}
                  particle-system={{
                    texture: './video/particle.png',
                    maxAge: 10,
                    velocityValue: '30 10 0',
                    color: '#fff',
                    size: 0.3,
                    particleCount: 100
                  }}
                />
              }
              {!!this.state.hitting &&
                <Entity
                  position={{x: 0, y: 0, z: 0}}
                  particle-system={{
                    texture: './video/particle.png',
                    maxAge: 10,
                    velocityValue: '-30 10 0',
                    color: '#fff',
                    size: 0.3,
                    particleCount: 100
                  }}
                />
              }
            </Entity>
            <Entity
              name={'swing1'}
              geometry={{primitive: 'plane', width: 4, height: 8}}
              position={{x: 0, y: 0, z: 0}}
              rotation={{x: 0, y: 0, z: 0}}
              material={{shader: 'chromakey', src: '#swing1', color: '0 1 0'}}
            />
          </Entity>

        </Scene>
        <div>[{this.state.text}]</div>
      </div>
    )
  }
}

export default App
