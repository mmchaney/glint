
(function (window) {

  var glint = window.glint || (window.glint = {}),
      document = window.document;  

  glint.Player = function (container) {

    this.container = container;
    this.video = container.querySelector('video');

    this.setLoadingState();
    this.setContainerSize();

    // The resizeEvent is dispatched on the window as soon as the player
    // switches to fullscreen
    this.resizeEvent = document.createEvent('Events');
    this.resizeEvent.initEvent('resize', true, false);

    // Setup DOM
    // ---------
    
    this.largePlayControl = glint.util.makeElement('button', {
      'class': 'gl-large-play-control'
    });
    this.container.appendChild(this.largePlayControl);

    this.controls = glint.util.makeElement('div', {
      'class': 'gl-controls'
    });

    this.playPauseControl = glint.util.makeElement('button', {
      'class': 'gl-play-pause-control'
    });
    this.controls.appendChild(this.playPauseControl);

    this.timeLabel = glint.util.makeElement('div', {
      'class': 'gl-time-label'
    });
    this.controls.appendChild(this.timeLabel);

    this.scrubBar = glint.util.makeElement('div', {
      'class': 'gl-scrub-bar'
    });
    this.controls.appendChild(this.scrubBar);

    this.bufferProgressBar = glint.util.makeElement('div', {
      'class': 'gl-buffer-progress-bar'
    });
    this.scrubBar.appendChild(this.bufferProgressBar);
    
    this.playProgressBar = glint.util.makeElement('div', {
      'class': 'gl-play-progress-bar'
    });
    this.scrubBar.appendChild(this.playProgressBar);

    this.volumeRange = glint.util.makeElement('div', {
      'class': 'gl-volume-range'
    });
    this.volumeGrabber = glint.util.makeElement('div');
    this.volumeRange.appendChild(this.volumeGrabber);
    this.controls.appendChild(this.volumeRange);

    this.volumeControl = glint.util.makeElement('button', {
      'class': 'gl-volume-control',
      'data-volume-level': 0
    });
    this.controls.appendChild(this.volumeControl);  

    this.fullscreenControl = glint.util.makeElement('button', {
      'class': 'gl-fullscreen-control'
    });
    this.controls.appendChild(this.fullscreenControl);

    this.container.appendChild(this.controls);

    // Setup UI events
    // ---------------
    
    this.largePlayControl.addEventListener('click', this.onLargePlayControlClick.bind(this), false);
    this.playPauseControl.addEventListener('click', this.onPlayPauseControlClick.bind(this), false);

    this.onScrubBarMouseEvent = this.onScrubBarMouseEvent.bind(this);
    this.scrubBar.addEventListener('mousedown', this.onScrubBarMouseEvent.bind(this), false);

    this.fullscreenControl.addEventListener('click', this.onFullscreenControlClick.bind(this), false);

    this.onVolumeRangeMouseEvent = this.onVolumeRangeMouseEvent.bind(this);
    this.volumeRange.addEventListener('mousedown', this.onVolumeRangeMouseEvent.bind(this), false);

    this.volumeControl.addEventListener('click', this.onVolumeControlClick.bind(this), false);

    // Setup video events
    // ------------------
    
    this.setLoadProgress = this.setLoadProgress.bind(this);
    this.video.addEventListener('progress', this.setLoadProgress.bind(this), false);
    setTimeout(this.setLoadProgress, 20);
    this.video.addEventListener('loadedmetadata', this.onLoadedMetaData.bind(this), false);
    
    this.onVideoPlayPause = this.onVideoPlayPause.bind(this);    
    this.video.addEventListener('play', this.onVideoPlayPause, false);
    this.video.addEventListener('pause', this.onVideoPlayPause, false);
    
    this.video.addEventListener('timeupdate', this.onVideoTimeUpdate.bind(this), false);
    this.video.addEventListener('durationchange', this.onVideoTimeUpdate.bind(this), false);
    this.video.addEventListener('volumechange', this.setVolumeControl.bind(this), false);
    
    // Finalize setup
    // --------------
    
    this.setVolumeControl();

  };

  glint.Player.prototype = {
    
    setContainerSize: function () {
      var videoBounds = this.video.getBoundingClientRect();
      this.container.style.width = (this.video.width || this.video.videoWidth || videoBounds.width) + 'px';
      this.container.style.height = (this.video.height || this.video.videoHeight || videoBounds.height) + 'px';      
    },
      
    setLoadingState: function () {
      if (this.video.readyState > 1 || this.video.preload && this.video.preload === 'none') {
        this.container.classList.remove('gl-loading');
      } else {
        this.container.classList.add('gl-loading');        
      }
    }, 
    
    setLoadProgress: function () {
      if (this.video.buffered && this.video.buffered.length >= 1) {
        this.bufferProgressBar.style.width = 
          Math.min(this.video.buffered.end(0) / this.video.duration * 100, 100) + '%';
        if (this.video.buffered.end(0) !== this.video.duration) {
          setTimeout(this.setLoadProgress, 20);
        }
      } else {
        this.bufferProgressBar.style.width = '100%'; 
      }    
    }, 

    setVolumeControl: function () {      
      if (this.video.muted) {
        this.volumeGrabber.style.width = '0%';
      } else {
        this.volumeGrabber.style.width = this.video.volume * 100 + '%';
      }
      
      this.volumeControl.setAttribute('data-volume-level', this.video.muted ? -1 : Math.round(this.video.volume));
    },       

    // UI event handlers
    // -----------------
    
    onLargePlayControlClick: function () {
      if (this.video.readyState > 0 || this.video.preload && this.video.preload === 'none') {
        this.video.play();
      }
    },

    onPlayPauseControlClick: function (event) {
      if (!this.video.paused) {
        this.video.pause();
        this.playPauseControl.classList.remove('pause');
      } else {
        this.video.play();
        this.playPauseControl.classList.remove('pause');
      }
    },

    onScrubBarMouseEvent: function (event) {
      if (event.which === 3) {
        return; 
      }
      
      event.preventDefault();

      this.video.currentTime = glint.util.localCoordinates(event, this.scrubBar).x * this.video.duration;

      if (event.type === 'mousedown') {
        document.addEventListener('mousemove', this.onScrubBarMouseEvent, false);
        document.addEventListener('mouseup', this.onScrubBarMouseEvent, false);
      } else if (event.type === 'mouseup') {
        document.removeEventListener('mousemove', this.onScrubBarMouseEvent, false);
        document.removeEventListener('mouseup', this.onScrubBarMouseEvent, false);
      }
    },

    onFullscreenControlClick: function () {
      window.dispatchEvent(this.resizeEvent);
      this.container.classList.toggle('gl-fullscreen');
    },

    onVolumeRangeMouseEvent: function (event) {
      if (event.which === 3) {
        return; 
      }
            
      event.preventDefault();

      this.video.muted = false;
      this.video.volume = glint.util.localCoordinates(event, this.volumeRange).x;

      if (event.type === 'mousedown') {
        document.addEventListener('mousemove', this.onVolumeRangeMouseEvent, false);
        document.addEventListener('mouseup', this.onVolumeRangeMouseEvent, false);
      } else if (event.type === 'mouseup') {
        document.removeEventListener('mousemove', this.onVolumeRangeMouseEvent, false);
        document.removeEventListener('mouseup', this.onVolumeRangeMouseEvent, false);
      }
    },

    onVolumeControlClick: function () {
      this.video.muted = !this.video.muted;
    },

    // Video event handlers
    // --------------------
    
    onLoadedMetaData: function () {
      this.setContainerSize();
      this.setLoadingState();
    },
    
    onVideoPlayPause: function () {
      if (this.video.paused) {
        this.container.classList.remove('gl-playing');
        this.container.classList.add('gl-paused');
      } else {
        this.container.classList.remove('gl-paused');
        this.container.classList.add('gl-playing');
      }
    },

    onVideoTimeUpdate: function () {
      var current = glint.util.formatTime(this.video.currentTime),
          duration = glint.util.formatTime(this.video.duration);

      this.playProgressBar.style.width = Math.min(this.video.currentTime / this.video.duration * 100, 100) + '%';
      this.timeLabel.textContent = current + ' / ' + duration;
    }

  };

  glint.setup = function () {
    var playerContainer = Array.prototype.slice.call(document.querySelectorAll('.glint-video-player'));
    playerContainer.forEach(function (playerContainer) {
      return new glint.Player(playerContainer);
    });
  };

}(this));