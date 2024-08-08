let add = document.querySelector('#banvid')
let banned = document.querySelector('.banned')
let statuss = document.querySelector('#statuss')
let vidid = document.getElementById('banname')
let addt = document.querySelector('#bantitleb')
let bannedt = document.querySelector('.bannedt')
let titlein = document.getElementById('bantitle')
chrome.storage.local.get('disabled', (disabled) => {
    statuss.checked = !disabled.disabled
})
chrome.storage.local.get('blacklist', (bs) => {
    banned.innerHTML = ''
    bs.blacklist.forEach(element => {
        let elem = document.createElement('p')
        elem.innerText = element
        elem.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            chrome.storage.local.get('blacklist', (bs)=>{
                let bl = bs.blacklist.filter(e => e !== element)
                chrome.storage.local.set({'blacklist': bl})
            })
            elem.remove()
        })
        banned.appendChild(elem)
    });
})
chrome.storage.local.get('blacklisttitles', (bs) => {
    bannedt.innerHTML = ''
    bs.blacklisttitles.forEach(element => {
        let elem = document.createElement('p')
        elem.innerText = element
        elem.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            chrome.storage.local.get('blacklisttitles', (bs)=>{
                let bl = bs.blacklisttitles.filter(e => e !== element)
                chrome.storage.local.set({'blacklisttitles': bl})
            })
            elem.remove()
        })
        bannedt.appendChild(elem)
    });
})

statuss.addEventListener('change', () => {
    chrome.storage.local.set({'disabled': !statuss.checked})
})
add.addEventListener('click', ()=>{
    const element = vidid.value
    if (element.replace(/\s+/g, '') === '') {
        return
    }
    let elem = document.createElement('p')
    elem.innerText = element
    elem.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        elem.remove()
        chrome.storage.local.get('blacklist', (bs)=>{
            let bl = bs.blacklist.filter(e => e !== element)
            chrome.storage.local.set({'blacklist': bl})
        })
    })
    banned.appendChild(elem)
    chrome.storage.local.get('blacklist', (bs)=>{
        let bl = bs.blacklist
        bl.push(element)
        chrome.storage.local.set({'blacklist': bl})
    })
    vidid.value = ''
})
addt.addEventListener('click', ()=>{
    const element = titlein.value.toLowerCase()
    if (element.replace(/\s+/g, '') === '') {
        return
    }
    let elem = document.createElement('p')
    elem.innerText = element
    elem.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        elem.remove()
        chrome.storage.local.get('blacklisttitles', (bs)=>{
            let bl = bs.blacklisttitles.filter(e => e !== element)
            chrome.storage.local.set({'blacklisttitles': bl})
        })
    })
    bannedt.appendChild(elem)
    chrome.storage.local.get('blacklisttitles', (bs)=>{
        let bl = bs.blacklisttitles
        bl.push(element)
        chrome.storage.local.set({'blacklisttitles': bl})
    })
    titlein.value = ''
})