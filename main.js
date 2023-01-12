document.addEventListener('DOMContentLoaded', function() {
    const buttonSearch = document.getElementById("searchButton");
    buttonSearch.addEventListener('click', getPageInfo);
})

const getPageInfo = () => {
    const backgroundPageInfo = chrome.extension.getBackgroundPage();
}

const filter = { urls: [ "*://*.youtube.com/api/timedtext*" ] };

let subtitles = {};

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
        .then(data => subtitles = data)
    }
}

const handleSubtitles = (subtitle) => {
    console.log(subtitle);
}

