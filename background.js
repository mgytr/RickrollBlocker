// function that injects code to a specific tab
function injectScript(tabId, url) {
    console.log("Injecting script into tab: ", tabId, " with url ",url);
    if (url.startsWith('https://www.youtube.com/watch') || url.startsWith('https://www.youtube.com/shorts/') || url.startsWith('https://www.youtube.com/embed/')) {
        chrome.scripting.executeScript(
            {
                target: {tabId: tabId},
                files: ['inject.js'],
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
            }
        );
    }


}
chrome.storage.local.get('disabled', (disabled) => {
    if (disabled.disabled === undefined) {
        chrome.storage.local.set({'disabled': false})
    }
})
chrome.storage.local.get('blacklist', (disabled) => {
    if (disabled.blacklist === undefined) {
        chrome.storage.local.set({'blacklist': []})
    }
})
chrome.storage.local.get('blacklisttitles', (disabled) => {
    if (disabled.blacklisttitle === undefined) {
        chrome.storage.local.set({'blacklisttitles': []})
    }
})



// adds a listener to tab change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Tab updated: ", tabId, " ChangeInfo: ", changeInfo);
    chrome.storage.local.get('disabled', (disabled) => {
        if (disabled.disabled === true) {
            return
        }

    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && changeInfo.status === 'loading') {
        console.log("URL changed: ", changeInfo.url);

        // calls the inject function
        injectScript(tabId, changeInfo.url);
    }
    else if (changeInfo.status === 'loading') {
        url = tab.url
        console.log('Reloaded: ', url)
        injectScript(tabId, url)
    }
})
});
