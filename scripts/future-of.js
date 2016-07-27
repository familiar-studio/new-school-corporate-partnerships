import {app} from './index.js'
import Flickity from 'flickity'
import Velocity from 'velocity-animate'
import 'd3'

export class FutureOf {

  constructor() {
    this.section = document.querySelector('#futureOf')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    this.loadingWord = this.section.querySelector('.section-headlines .dynamic-text')
    this.questionEl = document.querySelector('.question')
    this.slider = document.querySelector('.future-of-slider')
    this.words = []
    this.questions = []

    Array.prototype.forEach.call(this.section.querySelectorAll('.future-of-cell'), (el, i) => {
      if (i === 0) {
        this.questionEl.textContent = el.dataset.question
      }
      this.questions.push($(el).data('question'))
      this.words.push($(el).data('title'))
    })

    this.shufflerConfig = {
      limit: 26,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Online', 'Research & Development', 'Big Data']
    }

    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true,
      autoPlay: false
    })

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
      
      setTimeout(() => {
        this.initVideos()
      }, 2200)

      setTimeout(() => {
        $(this.sectionHeadlines).removeClass('hidden')
      }, 1800)

    }, 750)    
  }

  initVideos() {
    this.shuffler({
      limit: 6,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Online', 'Research & Development', 'Personalization', 'Data Privacy', 'Big Data']
    }).then(() => {
      const cell = this.flkty.cells[ this.flkty.selectedIndex ].element
      Velocity(cell, {opacity: 1})

      if (!this.playingVideo) {
        this.playCellSequence()
      }            
    })
  }

  playCellSequence() {
    this.playingVideo = this.flkty.selectedElement.querySelector('video')

    if (!Modernizr.touchevents) {      
      //wait for asynchronus play method to complete
      const promise = this.playingVideo.play()

      if (promise) {
        promise.then(handleVideoSliderEvents.bind(this))
      } else {
        //handle firefox because firefox play method does not return a promise
        this.playingVideo.play()
        handleVideoSliderEvents.call(this)  
      }
        
    } else {       
      handleVideoSliderEvents.call(this) //touch-enabled devices
    }          

    function handleVideoSliderEvents() {
      // this.loadingWord.textContent = this.words[ this.flkty.selectedIndex ]
      // this.questionEl.textContent = this.questions[this.flkty.selectedIndex]
      
      $('body').addClass('show-question')
      
      this.autoPlay = setTimeout(() => {
        $('body').removeClass('show-question')
        
        setTimeout(() => {
          this.flkty.next()
        }, 1500) // 5 seconds until next slide is called (1500ms + 3500ms)
        
      }, 3500) // 3.5 seconds until question is hidden

      this.flktyScrollHandler = this.flktyScrollStart.bind(this)
      this.flkty.once('scroll', this.flktyScrollHandler)
    }    
  }

  flktyScrollStart() {
    const previousVideo = this.playingVideo
    $('body').removeClass('show-question')

    clearInterval(this.autoPlay)
                  
    if (!Modernizr.touchevents) { 
      previousVideo.pause()
    }      
    
    this.flkty.once('settle', () => {        
      this.loadingWord.textContent = this.words[ this.flkty.selectedIndex ]
      this.questionEl.textContent = this.questions[this.flkty.selectedIndex]

      if (!Modernizr.touchevents) { 
        previousVideo.currentTime = 0
        previousVideo.load()
      }

      this.playCellSequence()        
    })  
  }

  shuffler(o) {
    // this.loadingWord = this.section.querySelector('.section-headlines .dynamic-text')
    // $('body').addClass('show-question')
    console.log(this.loadingWord)
    this.loadingWord.classList.add('show-override')

    return new Promise(resolve => {
      const wordSwitcher = setInterval(() => {
        this.loadingWord.textContent = o.words[o.index]
        o.index = o.index > o.words.length ? 0 : o.index

        if (o.count === o.limit) {
          clearInterval(wordSwitcher)
          this.loadingWord.textContent = o.words[o.words.length - 1]
          resolve()
          this.loadingWord.classList.remove('show-override')
        } else {
          o.count++
          o.index++
        }

      }, 400)
    })
  }

  sleep() {
    $('body').removeClass('show-question')

    clearInterval(this.autoPlay)
    this.flkty.off('scroll', this.flktyScrollHandler)

    if (this.playingVideo && !Modernizr.touchevents) {
      this.playingVideo.pause() 
      this.playingVideo.currentTime = 0
      this.playingVideo.load()
    }    
  }

  awake() {
    this.playCellSequence()
  }
}
