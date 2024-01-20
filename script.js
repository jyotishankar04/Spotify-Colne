let songListDiv = document
  .querySelector(".songList")
  .getElementsByTagName("li");
let seekbar = document.querySelector(".seekbar");
let audioCurrentMuniteSpan = document.querySelector("#audioCurrentTimeMinute");
let audioCurrentSecSpan = document.querySelector("#audioCurrentTimeSec");
let audioDurationMinuteSpan = document.querySelector("#audioDuratinMinute");
let audioDurationSecSpan = document.querySelector("#audioDuratinSec");
let playPause = document.querySelector(".playPause");
let playNext = document.querySelector(".playNext");
let palyPrev = document.querySelector(".playPrev");
let seekbarProgress = document.querySelector("#seekbarRound");
let rightHero = document.querySelector(".rightHero");
let rightHeroLis;
setTimeout(() => {
  rightHeroLis = document.querySelectorAll(".rightHero>div");
}, 200);
let songNameStatus = document.querySelector(".songNameStatus");
let heroSongDivArray;
let path;
let audio = new Audio();
// let currentSong = audio();
let indexOfSong;
let curDiv;
let index;
let songs;
let songDivArray;
let actEl;
let songName;

// !
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/dist/musics");

  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let songElArray = div.getElementsByTagName("a");
  let songs = [];
  //   console.log(tds);
  for (let i = 0; i < songElArray.length; i++) {
    let element = songElArray[i];
    if (element.href.includes(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

function whichSong(songs, songListDiv) {
  let parentEl;

  songDivArray = Array.from(songListDiv);
  songDivArray.forEach((element) => {
    index2 = element.addEventListener("click", (el) => {
      if (el.target.tagName == "IMG") {
        parentEl = el.target.parentNode;
        index = songDivArray.indexOf(parentEl);
        getSongUrl(index, songs);
        curDiv = songDivArray[index];
        removeActiveSong(songDivArray);
        // console.log(curDiv);
        activeSong();
      }
    });
  });
  setTimeout(() => {
    heroSongDivArray = Array.from(rightHeroLis);
    heroSongDivArray.forEach((element) => {
      element.addEventListener("click", (el) => {
        if (el.target.tagName == "IMG") {
          console.log(el.target.parentNode.parentNode.parentNode);
          parentEl = el.target.parentNode.parentNode.parentNode;
          index = heroSongDivArray.indexOf(parentEl);
          getSongUrl(index, songs);
          curDiv = heroSongDivArray[index];
          removeActiveSong(heroSongDivArray);
          // console.log(curDiv);
          activeSong();
        }
      });
    });
  }, 300);
}

async function setSongs() {
  songs = await getSongs();

  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    let curSong = song.split("/musics/")[1];
    curSong = curSong.replaceAll("-", " ");
    songName = curSong.split("(PagalWorld)")[0];
    // !Setting songs to the library
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li class="relative border-gray-200 group border-[1px] p-[10px] rounded-md flex gap-5 cursor-pointer">
    <img src="./Assets/musicIcon.svg" class="w-[20px]" alt="">
    <div class="flex flex-col basis-[60%]">
      <h1 class="liSongName">${songName}</h1>
      <p class="liArtistName text-xs"></p>
    </div>
    <img src="./Assets/hoverPlay.svg"  class=" right-2 ] w-[30px] hidden group-hover:block">

  </li>`;

    // ! The hero part song setting
    rightHero.innerHTML =
      rightHero.innerHTML +
      ` <div class=" relative cards  max-w-[250px] p-[15px] h-fit rounded-lg bg-[#2c2c2c] hover:cursor-pointer hover:bg-black transition-colors ease-in duration-200 group flex-grow basis-[200px]">
    <div class=" relative">
        <img src="./Assets/music.jpg" class="w-[100%] rounded-lg">
        <div class="absolute bottom-5 hidden right-5  group-hover:block group-hover:opacity-100   group-hover:right-2 group-hover:bottom-2 ">
          <img src="./Assets/hoverPlay.svg" class="w-[50px]">
        </div>
        </div>
        <h2 class="text-xl">${songName}</h2>
        <p class="text-sm text-gray-500"> Local Storage</p>`;
  }

  indexOfSong = whichSong(songs, songListDiv);
}

function getSongUrl(index, songs) {
  path = songs[index];
  playSong(path);
  playNextSong();
  playPrevSong();
}

let playSong = (path) => {
  audio.src = path;
  audio.play();
  otherUpdateDuringPlay();
  displaySongTime();
};

let pauseSong = () => {
  audio.pause();
};

setSongs();

// !Play and pause
let playPauseCount = 0;
playPause.addEventListener("click", () => {
  if (playPauseCount === 0) {
    pauseSong();
    playPause.removeAttribute("src");
    playPause.removeAttribute("src");
    playPause.setAttribute("src", "./Assets/play.svg");
    playPauseCount = 1;
  } else if (playPauseCount === 1) {
    audio.play();
    playPause.setAttribute("src", "./Assets/pause.svg");
    playPauseCount = 0;
  }
});

let otherUpdateDuringPlay = () => {
  playPause.setAttribute("src", "./Assets/pause.svg");
};
let displaySongTime = () => {
  setTimeout(() => {
    let Duration = formatTime(audio.duration);
    songNameStatus.innerText = `${songName}`;
    audioDurationMinuteSpan.innerText = `${Duration}`;
  }, 500);
};

seekbar.addEventListener("click", function (event) {
  let percentage = 0;
  var clickPosition = event.clientX - seekbar.getBoundingClientRect().left;
  percentage = (clickPosition / seekbar.offsetWidth) * 100;
  audio.currentTime = (percentage / 100) * audio.duration;
  updateSeekbar(percentage);
});
setTimeout(() => {
  audio.addEventListener("timeupdate", (ev) => {
    updateSeekbar(0);
    let currentTime = formatTime(audio.currentTime);
    audioCurrentMuniteSpan.innerText = `${currentTime}`;
  });
}, 200);
let updateSeekbar = (percentage) => {
  if (percentage) {
    seekbarProgress.style.left = percentage + "%";
  }
  let value = (audio.currentTime / audio.duration) * 100;
  seekbarProgress.style.left = `${value}%`;
  // console.log(value);
};

let formatTime = (seconds) => {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

let activeSong = () => {
  setTimeout(() => {
    actEl = songDivArray[index];
    heroActEl = heroSongDivArray[index];
    actEl.classList.add("border-green-600");
    actEl.classList.remove("border-gray-200");
    heroActEl.classList.add("bg-green-600");
    heroActEl.classList.add("group-hover:bg-green-100");
    heroActEl.classList.remove("bg-[#2c2c2c]");
    heroActEl.classList.remove("hover:bg-black");
  }, 200);
  // actEl.classList.add("border-[1px]");
};

let removeActiveSong = () => {
  songDivArray.forEach((elll) => {
    elll.classList.remove("border-green-600");
    elll.classList.add("border-gray-200");
  });
  heroSongDivArray.forEach((ellll) => {
    ellll.classList.add("bg-[#2c2c2c]");
    ellll.classList.remove("group-hover:bg-green-100");
    ellll.classList.remove("bg-green-600");
    ellll.classList.add("bg-[#2c2c2c]");
  });
};

let playNextSong = () => {
  playNext.addEventListener("click", () => {
    if (index < songs.length - 1) {
      index = index + 1;
    }
    activeSong();
    playSong(songs[index]);

    removeActiveSong();
  });
};
let playPrevSong = () => {
  palyPrev.addEventListener("click", () => {
    if (index > 0) {
      index = index - 1;
    }
    activeSong();

    removeActiveSong();
    playSong(songs[index]);
  });
};
