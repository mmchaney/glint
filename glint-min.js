(function(f){var c=f.glint||(f.glint={}),e=f.document;c.Player=function(a){this.container=a;this.video=a.querySelector("video");this.setLoadingState();this.setContainerSize();this.resizeEvent=e.createEvent("Events");this.resizeEvent.initEvent("resize",true,false);this.largePlayControl=c.util.makeElement("button",{"class":"gl-large-play-control"});this.container.appendChild(this.largePlayControl);this.controls=c.util.makeElement("div",{"class":"gl-controls"});this.playPauseControl=c.util.makeElement("button",
{"class":"gl-play-pause-control"});this.controls.appendChild(this.playPauseControl);this.timeLabel=c.util.makeElement("div",{"class":"gl-time-label"});this.controls.appendChild(this.timeLabel);this.scrubBar=c.util.makeElement("div",{"class":"gl-scrub-bar"});this.controls.appendChild(this.scrubBar);this.bufferProgressBar=c.util.makeElement("div",{"class":"gl-buffer-progress-bar"});this.scrubBar.appendChild(this.bufferProgressBar);this.playProgressBar=c.util.makeElement("div",{"class":"gl-play-progress-bar"});
this.scrubBar.appendChild(this.playProgressBar);this.volumeRange=c.util.makeElement("div",{"class":"gl-volume-range"});this.volumeGrabber=c.util.makeElement("div");this.volumeRange.appendChild(this.volumeGrabber);this.controls.appendChild(this.volumeRange);this.volumeControl=c.util.makeElement("button",{"class":"gl-volume-control","data-volume-level":0});this.controls.appendChild(this.volumeControl);this.fullscreenControl=c.util.makeElement("button",{"class":"gl-fullscreen-control"});this.controls.appendChild(this.fullscreenControl);
this.container.appendChild(this.controls);this.largePlayControl.addEventListener("click",this.onLargePlayControlClick.bind(this),false);this.playPauseControl.addEventListener("click",this.onPlayPauseControlClick.bind(this),false);this.onScrubBarMouseEvent=this.onScrubBarMouseEvent.bind(this);this.scrubBar.addEventListener("mousedown",this.onScrubBarMouseEvent.bind(this),false);this.fullscreenControl.addEventListener("click",this.onFullscreenControlClick.bind(this),false);this.onVolumeRangeMouseEvent=
this.onVolumeRangeMouseEvent.bind(this);this.volumeRange.addEventListener("mousedown",this.onVolumeRangeMouseEvent.bind(this),false);this.volumeControl.addEventListener("click",this.onVolumeControlClick.bind(this),false);this.setLoadProgress=this.setLoadProgress.bind(this);this.video.addEventListener("progress",this.setLoadProgress.bind(this),false);setTimeout(this.setLoadProgress,20);this.video.addEventListener("loadedmetadata",this.onLoadedMetaData.bind(this),false);this.onVideoPlayPause=this.onVideoPlayPause.bind(this);
this.video.addEventListener("play",this.onVideoPlayPause,false);this.video.addEventListener("pause",this.onVideoPlayPause,false);this.video.addEventListener("timeupdate",this.onVideoTimeUpdate.bind(this),false);this.video.addEventListener("durationchange",this.onVideoTimeUpdate.bind(this),false);this.video.addEventListener("volumechange",this.setVolumeControl.bind(this),false);this.setVolumeControl()};c.Player.prototype={setContainerSize:function(){var a=this.video.getBoundingClientRect();this.container.style.width=
(this.video.width||this.video.videoWidth||a.width)+"px";this.container.style.height=(this.video.height||this.video.videoHeight||a.height)+"px"},setLoadingState:function(){this.video.readyState>1||this.video.preload&&this.video.preload==="none"?this.container.classList.remove("gl-loading"):this.container.classList.add("gl-loading")},setLoadProgress:function(){if(this.video.buffered&&this.video.buffered.length>=1){this.bufferProgressBar.style.width=Math.min(this.video.buffered.end(0)/this.video.duration*
100,100)+"%";this.video.buffered.end(0)!==this.video.duration&&setTimeout(this.setLoadProgress,20)}else this.bufferProgressBar.style.width="100%"},setVolumeControl:function(){this.volumeGrabber.style.width=this.video.muted?"0%":this.video.volume*100+"%";this.volumeControl.setAttribute("data-volume-level",this.video.muted?-1:Math.round(this.video.volume))},onLargePlayControlClick:function(){if(this.video.readyState>0||this.video.preload&&this.video.preload==="none")this.video.play()},onPlayPauseControlClick:function(){this.video.paused?
this.video.play():this.video.pause();this.playPauseControl.classList.remove("pause")},onScrubBarMouseEvent:function(a){if(a.which!==3){a.preventDefault();this.video.currentTime=c.util.localCoordinates(a,this.scrubBar).x*this.video.duration;if(a.type==="mousedown"){e.addEventListener("mousemove",this.onScrubBarMouseEvent,false);e.addEventListener("mouseup",this.onScrubBarMouseEvent,false)}else if(a.type==="mouseup"){e.removeEventListener("mousemove",this.onScrubBarMouseEvent,false);e.removeEventListener("mouseup",
this.onScrubBarMouseEvent,false)}}},onFullscreenControlClick:function(){f.dispatchEvent(this.resizeEvent);this.container.classList.toggle("gl-fullscreen")},onVolumeRangeMouseEvent:function(a){if(a.which!==3){a.preventDefault();this.video.muted=false;this.video.volume=c.util.localCoordinates(a,this.volumeRange).x;if(a.type==="mousedown"){e.addEventListener("mousemove",this.onVolumeRangeMouseEvent,false);e.addEventListener("mouseup",this.onVolumeRangeMouseEvent,false)}else if(a.type==="mouseup"){e.removeEventListener("mousemove",
this.onVolumeRangeMouseEvent,false);e.removeEventListener("mouseup",this.onVolumeRangeMouseEvent,false)}}},onVolumeControlClick:function(){this.video.muted=!this.video.muted},onLoadedMetaData:function(){this.setContainerSize();this.setLoadingState()},onVideoPlayPause:function(){if(this.video.paused){this.container.classList.remove("gl-playing");this.container.classList.add("gl-paused")}else{this.container.classList.remove("gl-paused");this.container.classList.add("gl-playing")}},onVideoTimeUpdate:function(){var a=
c.util.formatTime(this.video.currentTime),d=c.util.formatTime(this.video.duration);this.playProgressBar.style.width=Math.min(this.video.currentTime/this.video.duration*100,100)+"%";this.timeLabel.textContent=a+" / "+d}};c.setup=function(){Array.prototype.slice.call(e.querySelectorAll(".glint-video-player")).forEach(function(a){return new c.Player(a)})}})(this);
(function(f){var c=f.glint||(f.glint={}),e=f.document;c.util={};c.util.slice=[].slice;c.util.makeElement=function(a,d){var b=e.createElement(a),g;for(g in d)if(g==="class")b.className=d[g];else b.setAttribute(g,d[g]);return b};c.util.localCoordinates=function(a,d){var b;d=d||a.target;b=d.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(a.clientX-b.left)/b.width)),y:Math.max(0,Math.min(1,(a.clientY-b.top)/b.height)),box:b}};c.util.formatTime=function(a){var d=Math.floor(a/60);a=Math.round(a%
60);return d+":"+(a>9?a:"0"+a.toString())};Function.prototype.bind=Function.prototype.bind||function(a){var d=this,b=c.util.slice.call(arguments,1);return function(){return d.apply(a,b.concat(c.util.slice.call(arguments)))}};if(Object.prototype.__defineGetter__&&!Object.defineProperty)Object.defineProperty=function(a,d,b){"get"in b&&a.__defineGetter__(d,b.get);"set"in b&&a.__defineSetter__(d,b.set)};typeof Element!=="undefined"&&!Element.prototype.classList&&function(){var a=function(b){return RegExp("(^|\\s)"+
b+"(\\s|$)")},d=function(b){this.element=b};d.prototype={contains:function(b){return a(b).test(this.element.className)},add:function(b){this.contains(b)||(this.element.className+=(this.element.className?" ":"")+b)},remove:function(b){this.element.className=this.element.className.replace(a(b)," ").trim()},toggle:function(b){var g=a(b);if(g.test(this.element.className))this.element.className=this.element.className.replace(g," ").trim();else this.element.className+=(this.element.className?" ":"")+b}};
Object.defineProperty(Element.prototype,"classList",{get:function(){return new d(this)}})}()})(this);