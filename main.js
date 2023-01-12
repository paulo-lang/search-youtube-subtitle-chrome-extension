document.addEventListener('DOMContentLoaded', function() {
    const buttonSearch = document.getElementById("searchButton");
    buttonSearch.addEventListener('click', getPageInfo);
})

let subtitles = null;

const getPageInfo = () => {
    const searchText = document.getElementById("searchText").value;
    document.getElementById("alert").style.display = "none";

    if(!subtitles) {
        document.getElementById("alert").style.display = "block";
        return;
    }

    searchSubtitles(searchText);
}

const searchSubtitles = (searchText) => {
    console.log(subtitles);
}

const filter = { urls: [ "*://*.youtube.com/api/timedtext*" ] };

chrome.webRequest.onBeforeRequest.addListener(
    (details) => { if (details.initiator == 'https://www.youtube.com') onBeforeRequest(details) }, 
    filter
);

const onBeforeRequest = async (details) => {
    if(details.url.includes("timedtext")) {
        const res = await fetch(details.url);
        subtitles = await res.json();
    }
}

