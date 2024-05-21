/* Elementlere Ulaşmak */

const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


//sira
let index

//dongu
let loop = true

//json verisi
const songsList = [
    {
        name: "Perfect-beauty",
        link: "assets/perfect-beauty-191271.mp3",
        artist: "Good_B_Music",
        image: "assets/beauty.jpg"
    },
    {
        name: "Ethereal Vistas",
        link: "assets/ethereal-vistas-191254.mp3",
        artist: "Starjam",
        image: "assets/ethereal.jpg"
    },
    {
        name: "Inside You",
        link: "assets/inside-you-162760.mp3",
        artist: "lemonmusicstudio",
        image: "assets/insideyou.jpg"
    },
    {
        name: "Summer Walk",
        link: "assets/summer-walk-152722.mp3",
        artist: "Olexy",
        image: "assets/summer.jpg"
    }
]

//oynat
const playAudio = () => {
    audio.play()
    pauseButton.classList.remove('hide') //göster
    playButton.classList.add('hide') //gizle
}

//durdur
const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//sarki ata
const setSong = (arrayIndex) => {
    let { name, link, artist, image } = songsList[arrayIndex]

    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () => {
        //saniye hesapla
        maxDuration.innerText = timeFormatter(audio.duration)
    }

    playListContainer.classList.add('hide')
    playAudio()
}

//sürekli saniye kontrolü yap
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    //progress i ilerleteceğiz
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

//şarkı süresi değişim kısmı tıklanıldığında
progressBar.addEventListener('click', (event) => {

    //başlangıç
    let coordStart = progressBar.getBoundingClientRect().left
    console.log(coordStart)

    //x ekseninde tıklama noktası
    let coordEnd = event.clientX
    console.log(coordEnd)
    console.log(progressBar.offsetWidth)

    //yüzdelik olarak hesaplama yap
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth
    console.log(progress)

    //progress i ilerlet
    currentProgress.style.width = progress * 100 + "%"

    //sesin anlık süresini değiştir
    audio.currentTime = progress * audio.duration

    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')


})


//zaman formatla
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}


const previousSong = () => {
    if (index > 0) {
        pauseAudio()
        index = index - 1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
}

const nextSong = () => {
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        } else {
            index = index + 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
}

//ekrar butonuna tıklanıldığında
repeatButton.addEventListener('click', () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
    }
})


//karıştırıcı tıklanıldığında
shuffleButton.addEventListener('click', () => {
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        audio.loop = true
    } else {
        shuffleButton.classList.add('active')
        audio.loop = false
    }
})


//sarkı bittiğinde,
audio.onended = () => {
    nextSong() //sonraki şarkıyı çağır
}

playListButton.addEventListener('click', () => {
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click', () => {
    playListContainer.classList.add('hide')
})


//oynat butonuna tıklanıldığında
playButton.addEventListener('click', playAudio)

//durdur butonuna tıklanıldığında
pauseButton.addEventListener('click', pauseAudio)

//önceki tıklanırsa
prevButton.addEventListener('click', previousSong)


//sonraki tıklanıldığında
nextButton.addEventListener('click', nextSong)


const initializePlaylist = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"
        <img src="${songsList[i]}"/>
        </div>
        <div class="playlist-song-details">
        <span id="playlist-song-name">
        ${songsList[i].name}
        </span>
        <span id="playlist-song-artist-album">
        ${songsList[i].artist}
        </span>
        </div>
        </li>`
    }
}

window.onload = () => {
    index = 0
    setSong(index)
    pauseAudio()
    initializePlaylist()
}