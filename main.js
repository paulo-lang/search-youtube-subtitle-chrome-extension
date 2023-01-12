document.addEventListener('DOMContentLoaded', function() {
    const buttonSearch = document.getElementById("searchButton");
    buttonSearch.addEventListener('click', getPageInfo);
})

let subtitles = null;
let url = null;

const getPageInfo = () => {
    const searchText = document.getElementById("searchText").value;
    document.getElementById("resultList").innerHTML = '';
    document.getElementById("nullResult").style.display = "none";
    document.getElementById("subtitleNull").style.display = "none";
    document.getElementById("listTitle").style.display = "none";

    if(!subtitles) {
        document.getElementById("subtitleNull").style.display = "block";
        return;
    }

    searchSubtitles(searchText);
}

const searchSubtitles = (searchText) => {
    const searchResult = [];

    subtitles.forEach((element) => {
        if(element.segs[0].utf8.includes(searchText)) {
            const msInSecs = Math.trunc(element.tStartMs/1000);
            searchResult.push(msInSecs);
        }
    })

    if(searchResult.length == 0) {
        document.getElementById("nullResult").style.display = "block";
        return;
    }

    document.getElementById("listTitle").style.display = "block";

    mapSubtitleLocation(searchResult);
}

const mapSubtitleLocation = (searchResult) => {
    const resultList = document.getElementById('resultList');

    searchResult.forEach((element) => {
        const subtitleUrl = url + '&t=' + element + 's';

        const stringifiedHour = stringifyHour(element);

        const linkElement = document.createElement('a');
        linkElement.href = subtitleUrl;
        linkElement.innerHTML = stringifiedHour;
        linkElement.className = "link"; 
        linkElement.style.display = "block";
        linkElement.addEventListener('click', openLink);
        resultList.appendChild(linkElement);

    })
}

const openLink = (evt) => {
    let evtURL = evt.currentTarget.href;

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, { url: evtURL });
    });
}

const stringifyHour = (element) => {
    let h = null;
    let min = Math.floor(element/60);
    if(min >= 60) {
        min %= 60;
        h = min/60;
    }
    const sec = Math.floor((element) % 60);

    let hourStringified = '';
    let secStringified = '';

    if(sec < 10) {
        secStringified = '0' + sec;
    }else {
        secStringified = sec;
    }

    if( h > 0 ) {
        hourStringified = h + ':' + min + ':' + secStringified;
    }else {
        hourStringified = min + ':' + secStringified;
    }
    
    return hourStringified;
}

chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    let tab = tabs[0];
    url = tab.url.replace(/&t.*$/, "");
});

const filter = { urls: [ "*://*.youtube.com/api/timedtext*" ] };

chrome.webRequest.onBeforeRequest.addListener(
    (details) => { if (details.initiator == 'https://www.youtube.com') onBeforeRequest(details) }, 
    filter
);

const onBeforeRequest = async (details) => {
    if(details.url.includes("timedtext")) {
        const res = await (await fetch(details.url)).json();
        subtitles = res.events;
    }
}

