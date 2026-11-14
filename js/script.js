
const USER_ID = "570693486500773888";

const $ = id => document.getElementById(id);

let currentSpotify = null;

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function resetProgress() {
    $("progress").style.width = "0%";
    $("currenttime").textContent = "0:00";
    $("duration").textContent = "0:00";
}

function renderSpotify(data) {
    const spotify = data.spotify;

    $("progresscontainer").style.display = "block";

    $("activitytitle").textContent = "Media Player";
    $("musicname").textContent = spotify.song;
    $("musicartist").textContent = spotify.artist;
    $("musicalbum").textContent = spotify.album;
    $("musicimage").src = spotify.album_art_url;

    $("activitytype").textContent = `Listening to ${spotify.artist}`;
    $("activitystate").textContent = "";

    currentSpotify = spotify.timestamps;
}

function renderActivity(activity) {
    $("progresscontainer").style.display = "none";

    $("activitytitle").textContent = activity.name;
    $("musicname").textContent = activity.name;
    $("musicartist").textContent = activity.details || "";
    $("musicalbum").textContent =
        activity.assets?.large_text || "";

    $("activitytype").textContent = "";
    $("activitystate").textContent = activity.state || "";

    currentSpotify = null;
    resetProgress();

    const raw = activity.assets?.large_image || "";

    if (raw.startsWith("mp:external/")) {
        const url = raw.split("/https/")[1];
        $("musicimage").src = url
            ? "https://" + url
            : "assets/potato.gif";
    } else {
        $("musicimage").src = "assets/potato.gif";
    }
}

function renderInactive() {
    $("progresscontainer").style.display = "none";

    $("activitytitle").textContent = "activity";
    $("musicname").textContent = "Not active right now.";
    $("musicartist").textContent = "";
    $("musicalbum").textContent = "";
    $("musicimage").src = "assets/potato.gif";
    $("activitytype").textContent = "";
    $("activitystate").textContent = "";

    currentSpotify = null;
    resetProgress();
}

function updateProgress() {
    if (!currentSpotify) return;

    const start = currentSpotify.start;
    const end = currentSpotify.end;

    if (!start || !end) return;

    const total = end - start;
    const elapsed = Math.max(0, Math.min(Date.now() - start, total));

    $("progress").style.width = `${(elapsed / total) * 100}%`;
    $("currenttime").textContent = formatTime(elapsed);
    $("duration").textContent = formatTime(total);
}

function update() {
    fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`)
        .then(r => {
            if (!r.ok) throw new Error("lanyard request failed yo");
            return r.json();
        })
        .then(response => {
            if (!response.success) throw new Error("invalid lanyard response bitch");

            const data = response.data;
            const activity = data.activities.find(a => a.type !== 4);

            if (!activity) {
                renderInactive();
            } else if (activity.name === "Spotify" && data.spotify) {
                renderSpotify(data);
            } else {
                renderActivity(activity);
            }

            updateProgress();
        })
        .catch(console.error);
}

update();
setInterval(update, 5000);
setInterval(updateProgress, 1000);
