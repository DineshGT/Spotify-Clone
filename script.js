console.log("Welcome!");
// Fetching songs from address
// Global variable
let playsong = document.querySelector(".pause");
let currentsongplay = new Audio();
let songs;
let clickedsongs = [];
let songText;

async function getsong(l, songText) {
  let a = await fetch(`/songs/${songText}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  songs = [];

  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href.split(`/songs/${songText}`)[1]);
    }
  }

  if (songText) {
    songs.push(songText);
  }
  console.log(songs)
  return songs;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

const playmusic = (track) => {
  currentsongplay.src = "/songs/"+songs[songs.length-1]+"/"+track;
  // console.log(currentsongplay);
  currentsongplay.play();
  playsong.src = "./svg/pause.svg";
  let str = track.replaceAll(".mp3", "").replaceAll("%20", " ");
  document.querySelector(".curr").innerHTML = str;
};

async function getfolders() {
  let folder = await fetch("./songs/");
  let response = await folder.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let x = document.querySelector(".songs");
  let as = div.getElementsByTagName("a");

  // console.log(clickedsongs);

  for (let i = 0; i < as.length; i++) {
    if (as[i].href.includes("/songs/")) {
      let indexx = as[i].href.indexOf("s/");
      let substr = as[i].href.substr(indexx + 2);
      let infoimg = await (await fetch(`./songs/${substr}/info.json`)).json();
      x.innerHTML += `<div class="cards">
                        <div class="greenbutton">
                            <img src="svg/playbutton.svg" alt="play">
                        </div>
                        <div class="photo" style="background-image: url(songs/${substr}/image.jpg);"></div>
                        <div class="songname">
                            <div>${infoimg.name}</div>
                        </div>
                        <div class="artist">${infoimg.about}</div>
                    </div>`;
    }
  }

  let cards = document.getElementsByClassName("cards");

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", async function () {
      let songElement = this.getElementsByClassName("songname")[0];
      songText = songElement ? songElement.innerText : "";
      clickedsongs.push(songText);
      // console.log(clickedsongs[0]);

      // Fetch songs with clicked song text
      songs = await getsong(`/songs/${songText}`, songText);
      // console.log(songs)
      updateLibrary(songs);
    });
  }
}

async function main() {

  await getfolders();

  songs = await getsong(`/songs/${songText}`);
  // console.log(songs);

  currentsongplay.src = songs[0];
  updateLibrary(songs);

  Array.from(
    document.querySelector(".currentsong").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {

      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  playsong.addEventListener("click", () => {
    if (currentsongplay.paused) {
      playsong.src = "./svg/pause.svg";
      currentsongplay.play();
    } else {
      playsong.src = "./svg/playbutton.svg";
      currentsongplay.pause();
    }
  });

  currentsongplay.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${formatTime(
      currentsongplay.currentTime
    )}/${formatTime(currentsongplay.duration)}`;
    document.querySelector(".dot").style.left =
      (currentsongplay.currentTime / currentsongplay.duration) * 100 + "%";
  });

  document.querySelector(".line").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".dot").style.left = percent + "%";
    currentsongplay.currentTime = (currentsongplay.duration * percent) / 100;
  });
}

document.querySelector(".prev").addEventListener("click", () => {
  let p = currentsongplay.src.split("/").slice(-1)[0];
  p = "/"+p;
  let index = songs.indexOf(p);
  console.log(currentsongplay.src.split("/").slice(-1)[0]);
  console.log(index);
  if (index - 1 >= 0) {
    playmusic(songs[index - 1]);
  }
});

document.querySelector(".next").addEventListener("click", () => {
  let p = currentsongplay.src.split("/").slice(-1)[0];
  p = "/"+p;
  let index = songs.indexOf(p);
  if (index + 1 < songs.length) {
    playmusic(songs[index + 1]);
  }
});

const volumeControl = document.querySelector("#volume-control");
volumeControl.addEventListener("input", (e) => {
  const volume = e.target.value / 100;
  currentsongplay.volume = volume;
});

function updateLibrary(songs) {
  let songul = document
    .querySelector(".currentsong")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = ""; // Clear existing list
  // console.log(songul)

  for (const song of songs) {
    let songName = song.replaceAll("%20", " ").replaceAll("/", "");
    songul.innerHTML += `
      <li>
        <img src="svg/music.svg" alt="">
        <div class="info">
          <div class="SongName">${songName}</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <div class="move"><img src="svg/playbutton.svg" alt=""></div>
        </div>
      </li>`;
  }

  Array.from(songul.getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", () => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });



document.querySelector(".signup").addEventListener("click", () => {
  console.log("Signup button clicked");
  
})


}

main();
