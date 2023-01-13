chrome.webRequest.onBeforeRequest.addListener(
    async (details) => {
        if (details.initiator == 'https://www.youtube.com') {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, async function (tabs) {
                let tab = tabs[0];
                let url = tab.url.replace(/&t.*$/, "");
                await chrome.storage.local.set({ "url": url });
            });

            let subtitles = await onBeforeRequest(details); 
            await chrome.storage.local.set({ "subtitles": subtitles });
        }
    },
    { urls: ["*://*.youtube.com/api/timedtext*"] }
);

const onBeforeRequest = async (details) => {
    if (details.url.includes("timedtext")) {
        let subtitles = await (await fetch(details.url)).json();
        return subtitles.events;
    }
    return;
}
