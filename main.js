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
    }

}

const filter = { urls: [ "*://*.youtube.com/api/timedtext*" ] };

chrome.webRequest.onBeforeRequest.addListener(
    (details) => { if (details.initiator == 'https://www.youtube.com') return onBeforeRequest(details) }, 
    filter
);

const onBeforeRequest = (details) => {

    if(details.url.includes("timedtext")) {
        fetch(details.url, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
            },  
        })
        .then(response => response.json())
        .then(data => subtitles = {})
    }
}

const handleSubtitles = (subtitle) => {
    console.log(subtitle);
}

