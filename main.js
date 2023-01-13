document.addEventListener('DOMContentLoaded', function () {
    const buttonSearch = document.getElementById("searchButton");
    buttonSearch.addEventListener('click', getSubtitlesThenSearch);
});

let subtitles = null;

const getSubtitlesThenSearch = async () => {
    chrome.storage.local.get("subtitles", (result) => loadedSubtitles(result));
}

const loadedSubtitles = (result) => {
    subtitles = result.subtitles;

    document.getElementById("resultList").innerHTML = '';
    document.getElementById("nullResult").style.display = "none";
    document.getElementById("subtitleNull").style.display = "none";
    document.getElementById("listTitle").style.display = "none";

    if (!subtitles) {
        document.getElementById("subtitleNull").style.display = "block";
        return;
    }

    searchSubtitles(searchText.value);
}

const searchSubtitles = (searchText) => {
    const searchResult = [];

    subtitles.forEach((element) => {
        if(element.segs) {
            element.segs.forEach((moment) => {
                if(moment.utf8.includes(searchText)) {
                    const time = moment.tOffsetMs ? element.tStartMs + moment.tOffsetMs : element.tStartMs;
                    searchResult.push(Math.trunc(time / 1000));
                }
            })
        }
    });

    if (searchResult.length == 0) {
        document.getElementById("nullResult").style.display = "block";
        return;
    }

    document.getElementById("listTitle").style.display = "block";

    mapSubtitleLocation(searchResult);
}

const mapSubtitleLocation = async (searchResult) => {
    await chrome.storage.local.get("url", (result) => onURLLoaded(result.url, searchResult));
}

const onURLLoaded = (url, searchResult) => {
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
    });
}

const openLink = (evt) => {
    let evtURL = evt.currentTarget.href;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, { url: evtURL });
    });
}

const stringifyHour = (element) => {
    let h = null;
    let min = Math.floor(element / 60);
    if (min >= 60) {
        min %= 60;
        h = min / 60;
    }
    const sec = Math.floor((element) % 60);

    let hourStringified = '';
    let secStringified = '';

    if (sec < 10) {
        secStringified = '0' + sec;
    } else {
        secStringified = sec;
    }

    if (h > 0) {
        hourStringified = h + ':' + min + ':' + secStringified;
    } else {
        hourStringified = min + ':' + secStringified;
    }

    return hourStringified;
}
