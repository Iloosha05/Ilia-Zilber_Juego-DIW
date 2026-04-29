document.addEventListener("DOMContentLoaded", function() {
    let video = document.getElementById("intro-video");
    let playBtn = document.getElementById("play-btn");

    playBtn.addEventListener("click", function () {
        video.muted = false;
        video.play();
    });
});