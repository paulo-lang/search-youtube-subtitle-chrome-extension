document.addEventListener('DOMContentLoaded', function() {
    const buttonSearch = document.getElementById("searchButton");
    buttonSearch.addEventListener('click', getPageInfo);
})

const filter = { urls: [ "<all_urls>" ] };

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {return onBeforeRequest(details)}, 
    filter,
    ["requestBody","blocking"]
);

const onBeforeRequest = (details) => {
    if(details.url.includes("timedtext")){
        console.log(details);
    }
}

const getPageInfo = () => {
    const backgroundPageInfo = chrome.extension.getBackgroundPage();
    console.log(chrome.extension.network);
    console.log("oi");
}