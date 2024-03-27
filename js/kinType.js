const playPauseBtn = document.querySelector(".play-pause-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const miniPlyaerBtn = document.querySelector(".mini-player-btn")
const videoContainer = document.querySelector(".video-container")
const muteBtn = document.querySelector(".mute-btn")
const volumeSlider = document.querySelector(".volume-slider")
const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")
const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")
const timelineContainer = document.querySelector(".timeline-container")
const video = document.querySelector("video")

document.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLowerCase()
    
    if (tagName === "input") return

    switch (e.key.toLowerCase()) {
        case "":
            if (tagName === "button") return
        case "k":
            togglePlay()
             break
        case "f":
            toggleFullScreenMode()
            break
        case "i":
            toggleMiniPlayerMode()
            break
        case "m":
            toggleMute()
            break
        case "arrowleft":
        case "j":
            skip(-5)
            break
        case "arrowright":
        case "l":
            skip(5)
            break
    }
})

playPauseBtn.addEventListener("click", togglePlay)
video.addEventListener("click", togglePlay)

function togglePlay() {
  video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused")
})


fullScreenBtn.addEventListener("click", toggleFullScreenMode)

function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
     videoContainer.requestFullscreen()
    } else {
     document.exitFullscreen()
    }
}

document.addEventListener("fullscreenchange", () => {
     videoContainer.classList.toggle("full-screen", document.fullscreenElement)
   })

miniPlyaerBtn.addEventListener("click", toggleMiniPlayerMode)

function toggleMiniPlayerMode() {
    if (videoContainer.classList.contains("mini-player")) {
     document.exitPictureInPicture()
    } else {
     video.requestPictureInPicture()
    }
}


video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player")
})

video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player")
})


muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute() {
    video.muted = !video.muted
}

video.addEventListener("volumechange", () => {
    volumeSlider.value = video.volume
    let volumeLevel
    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0
        volumeLevel = "muted"
    } else if (video.volume >= .5) {
        volumeLevel = "high"
    } else {
        volumeLevel = "low"
    }

    videoContainer.dataset.volumeLevel = volumeLevel
})

video.addEventListener("loadeddata", () => {
    totalTimeElem.textContent = formatDuration(video.duration)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})
function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }
}

video.addEventListener("timeupdate", () => {
    currentTimeElem.textContent = formatDuration(video.currentTime)
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty("--progress-position", percent)
})

function skip(duration) {
    video.currentTime += duration
  }

timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
    if (isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false
let wasPausd
function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
        wasPausd = video.paused
        video.pause()
    } else {
        video.currentTime = percent * video.duration
        if (!wasPausd) video.play()
    }

    handleTimelineUpdate(e)
}
  
function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    const previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10))
    const previewImgSrc = `../media/assets/previewImgs_six/preview${previewImgNumber}.jpg`
    // CHANGE THIS FOR EARCH VIDEO. YOU NEED NEW JS FILES
    previewImg.src = previewImgSrc
    timelineContainer.style.setProperty("--preview-position", percent)
    
    if (isScrubbing) {
        e.preventDefault()
        thumbnailImg.src = previewImgSrc
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}


