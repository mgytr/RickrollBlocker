chrome.storage.local.get('blacklist', (blacklist)=>{
    
chrome.storage.local.get('blacklisttitles', (titlebl)=>{
let url = location.href;
let urlParams = new URLSearchParams(window.location.search);
let okstop = false;
let flaggedids = [...blacklist.blacklist];
let title = '';
const titleblacklist = titlebl.blacklisttitles

if (!sessionStorage.getItem('playAnyway')) {
    // Continuously check for the video element to stop and hide it if necessary
    let idint = setInterval(() => {
        let vid = document.querySelector('div.html5-video-container video');
        if (okstop) {
            clearInterval(idint);
            return;
        }
        if (vid) {
            vid.pause();
            vid.style.display = 'none';
        }
    }, 1);

    // Function to process the video data and check the title
    const thenfunc = () => {
        title = document.querySelector("#watch7-content > meta[itemprop=\"name\"]")?.getAttribute('content') || '';
        if (!title) {
            setTimeout(thenfunc, 5);
            return;
        }
        console.log('[Rickroll Blocker] Found title: ' + title);
        foundit();
    };

    // Fetch the flagged IDs and process them
    fetch('https://corsproxy.io/?https://raw.githubusercontent.com/larssieboy18/rickroll-list/main/rickrolls.json')
        .then(resp => resp.text())
        .then(text => {
            const json = JSON.parse(text)['rickrolls'];
            json.forEach(elem => {
                let vidid = null;
                if (elem.startsWith('youtube.com/get_video?video_id=')) {
                    vidid = elem.split('youtube.com/get_video?video_id=')[1];
                } else if (elem.startsWith('youtu.be/')) {
                    vidid = elem.split('youtu.be/')[1];
                } else if (elem.startsWith('youtube.com/shorts/')) {
                    vidid = elem.split('youtube.com/shorts/')[1];
                } else if (elem.startsWith('youtube.com/watch?v=')) {
                    vidid = elem.split('youtube.com/watch?v=')[1];
                }
                if (vidid && !flaggedids.includes(vidid)) {
                    flaggedids.push(vidid);
                }
            });
        })
        .then(thenfunc);

    // Function to show the warning popup
    const warning = (vid) => {
        let popupcont = document.createElement('div');
        popupcont.style.position = 'fixed';
        popupcont.style.left = '0px';
        popupcont.style.backgroundColor = 'rgba(150, 150, 150, 0.3';
        popupcont.style.top = '0px';
        popupcont.style.width = '100%';
        popupcont.style.height = '100%';
        popupcont.style.backdropFilter = 'blur(20px)';
        popupcont.style.zIndex = '99999';
        popupcont.style.display = 'flex';
        popupcont.style.alignItems = 'center';
        popupcont.style.justifyContent = 'center';

        let popup = document.createElement('div');
        popup.style.textAlign = 'center';
        popupcont.appendChild(popup);

        let h2 = document.createElement('h1');
        h2.innerText = 'WARNING! This video was flagged as a rickroll/banned video';
        h2.style.color = 'red';
        h2.style.textShadow = '0px 1px 5px #282828, -1px -2px 5px #282828'
        popup.appendChild(h2);

        let btn = document.createElement('button');
        btn.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
        btn.setAttribute('aria-label', 'Watch anyway');
        btn.title = '';
        btn.innerHTML = `
          <div class="yt-spec-button-shape-next__button-text-content">
            <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">Watch Anyway</span>
          </div>
          <yt-touch-feedback-shape style="border-radius: inherit;">
            <div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response-inverse" aria-hidden="true">
              <div class="yt-spec-touch-feedback-shape__stroke"></div>
              <div class="yt-spec-touch-feedback-shape__fill"></div>
            </div>
          </yt-touch-feedback-shape>
        `;

        let reason = `Reason: Title flagged: ${title}`;
        let vidid = '';
        if (location.pathname === '/watch') {
            vidid = urlParams.get('v');
        } else if (location.pathname.startsWith('/shorts') || location.pathname.startsWith('/embed')) {
            vidid = location.pathname.split('/')[2];
        }
        if (flaggedids.includes(vidid)) {
            reason = `Reason: Video ID found in rickroll/custom database`;
        }

        let relem = document.createElement('h2');
        relem.style.textShadow = '0px 1px 5px #282828, -1px -2px 5px #282828'
        relem.style.color = 'white';
        relem.textContent = reason;
        relem.style.marginTop = '40px';
        relem.style.paddingBottom = '120px';

        btn.addEventListener('click', () => {
            sessionStorage.setItem('playAnyway', 'true');
            window.location.reload();
        });

        popup.appendChild(relem);
        popup.appendChild(btn);
        document.body.appendChild(popupcont);
    };

    // Function to check the video title and ID
    const foundit = () => {
        let vid = document.querySelector('div.html5-video-container video');

        // Check if the title includes certain keywords
        const ti = title.toLowerCase().includes.bind(title.toLowerCase());

        let vidid = '';
        if (location.pathname === '/watch') {
            vidid = urlParams.get('v');
        } else if (location.pathname.startsWith('/shorts')) {
            vidid = location.pathname.split('/')[2];
        }

        if (flaggedids.includes(vidid)) {
            warning(vid);
            return;
        }
        
        if (ti('never gonna give you up') || ti('rickroll') || ti('rick roll')) {
            warning(vid);
            return;
        }
        let blelem = null
        for (const ind in titleblacklist) {
            blelem = titleblacklist[ind]

            if (ti(blelem)) {
                warning(vid);
                return;
            }
        }

        vid = document.querySelector('div.html5-video-container video');
        okstop = true;
        vid.style.display = 'block';
        vid.play();
    };
} else {
    sessionStorage.removeItem('playAnyway');
}
})})