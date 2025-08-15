
$(document).on('ready', function () {
    $('body').css({
        backgroundColor: 'rgba(0, 0, 0, 1)', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden'
    });

    console.log('Clappr version:', Clappr.version || 'no disponible');
    console.log('HlsjsPlayback:', typeof HlsjsPlayback);
    console.log('DashShakaPlayback:', typeof DashShakaPlayback);

    var u0 = location.href;
    var u1 = u0.split('#')[1] || null;
    var u2 = u0.split('#')[2] || null;
    Cplayer(u1, u2);
    return false;
});

function Cplayer(vurl, vopc) {
    var timeId, player, nVol;
    $('body').empty();
    $('<div id="vspm"></div>').css({
        position: 'absolute', fontWeight: '600', top: '20px', right: '20px', color: 'lime', zIndex: '9999',
        userSelect: 'none', pointerEvents: 'none'
    }).appendTo('body');
    $('<div id="xplayer"></div>').appendTo('body');

    /*--CHECK-VERSION--------------------------------------------------------------------------------------------------*/
    var androidVer = getAndroidVersion();
    var Modermplugins = [];
    var Extraplugins = {};
    if (androidVer && androidVer < 5) {//MP4 o HLS nativo
    } else {//Plugin moderno
        Modermplugins.push(HlsjsPlayback, DashShakaPlayback);
        Extraplugins = { html5_dash: DashShakaPlayback, html5_hlsjs: HlsjsPlayback };
    }
    /*--CHECK-EXT-----------------------------------------------------------------------------------------------------*/    
    if (/\.(mp4|m3u8)/i.test(vurl)) {
        player = new Clappr.Player(
            {
                parentId: '#xplayer', width: '100vw', height: '100vh', autoPlay: true, mute: false, poster:'./img/krg.jpg',
                source: vurl,
                plugins: Modermplugins,
                playbackPlugins: Extraplugins,
                playback: { playInline: true }
            }).on(Clappr.Events.PLAYER_PLAY, () => { setEPLAYER('video', true); });
    } else if (/\.(ytb)/i.test(vurl)) {
        vurl = vurl.split('.')[0];
        player = new Clappr.Player(
            {
                parentId: '#xplayer', width: '100vw', height: '100vh', autoPlay: true, mute: false, poster: 'https://img.youtube.com/vi/' + vurl + '/hqdefault.jpg',
                source: vurl,
                plugins: [YoutubePlugin],
                youtube: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0, fs: 0, iv_load_policy: 3, mute: 0 },
                playback: { playInline: true }
            }).on(Clappr.Events.PLAYER_PLAY, () => { setEPLAYER('iframe', true); });
    } else if (/(\/activar|\.html)/i.test(vurl)) {        
        setIFRAME(vurl, vopc);
        return;
    }
    /*--ACTION-PLAY--------------------------------------------------------------------------------------------------*/
    function setEPLAYER(FOptc, FPlay) {
        if (FPlay) {
            FPlay = false;
            try { player.core.mediaControl.disable(); } catch (error) { }
            try { player.setVolume(100); } catch (error) { }
            const iframe = document.querySelector(FOptc);
            if (iframe) {
                iframe.style.position = "absolute";/*-*/iframe.style.objectFit = "fill";
                iframe.style.width = "100%";/*-*/iframe.style.height = "100%";
                iframe.style.backgroundColor = 'black';/*-*/iframe.style.overflow = 'hidden';
                iframe.style.top = "0px";/*-*/iframe.style.left = "0px";
            }
        }
    }
    /*--SPAM---------------------------------------------------------------------------------------------------------*/
    function infspm(texto) {
        var div = document.getElementById("vspm");
        div.textContent = texto;
        clearTimeout(timeId);
        timeId = setTimeout(function () { div.textContent = ""; }, 2000);
    }
    /*--CSS---------------------------------------------------------------------------------------------------------*/
    $('#xplayer').css({
        position: 'absolute', margin: '0', padding: '0', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
        width: '100vw', height: '100vh', objectFit: 'fill'
    });
    /*--KEYDOWN-----------------------------------------------------------------------------------------------------*/
    $(document).off('keydown').on('keydown', function (ex) {
        var kCode = ex.keyCode || window.event;
        if (ex.code === 'Enter' || kCode === 13) {
            if (player.isPlaying()) {
                player.pause();
                infspm('Pause');
            } else {
                player.play();
                infspm('Play');
            }
        } else if (ex.code === 'Space' || kCode === 32) {
            if (player.isPlaying()) {
                player.pause();
                infspm('Pause');
            } else {
                player.play();
                infspm('Play');
            }
        } else if (ex.code === 'Backspace' || kCode === 8) {
            location.replace('./index2.html#' + vopc);
        } else if (ex.code === 'ArrowUp' || kCode === 38) {
            nVol = Math.min(player.getVolume() + 5, 100);
            player.setVolume(nVol);
            infspm('Vol.: ' + nVol + '%');
        } else if (ex.code === 'ArrowDown' || kCode === 40) {
            nVol = Math.min(player.getVolume() - 5, 100);
            player.setVolume(nVol);
            infspm('Vol.: ' + nVol + '%');
        } else if (ex.code === 'ArrowLeft' || kCode === 37) {
            player.seek(Math.max(player.getCurrentTime() - 10, 0));
            infspm('Rep.: -10Seg');
        } else if (ex.code === 'ArrowRight' || kCode === 39) {
            player.seek(Math.max(player.getCurrentTime() + 10, 0));
            infspm('Rep.: +10Seg');
        }
    }).off('click').on('click', function () {
        if (player.isPlaying()) {
            player.pause();
            infspm('Pause');
        } else {
            player.play();
            infspm('Play');
        }
    });
    return false;
}

function setIFRAME(vurl, vopc) {
    $('body').empty();
    $('<iframe ' +
        'id="frmplayer"' +
        ' allow="encrypted-media"' +
        ' src="' + vurl + '"' +
        ' width="100%"' +
        ' height="100%"' +
        ' scrolling="no"' +
        ' frameBorder="0"' +
        ' allowfullscreen' +
        ' sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms"' +
        //' sandbox="allow-top-navigation allow-scripts allow-forms"' +
        ' tabindex="0"></iframe>').appendTo('body');
    /*--CSS---------------------------------------------------------------------------------------------------------*/
    $('#frmplayer').css({
        position: 'absolute', backgroundColor: 'black', margin: '0', padding: '0', userSelect: 'none',
        pointerEvents: 'all', overflow: 'auto', left: '1px', top: '1px', right: '1px', bottom: '1px'
    });
    /*--KEYDOWN-----------------------------------------------------------------------------------------------------*/
    $(document).off('keydown').on('keydown', function (ex) {
        if (ex.key === 'Backspace' || ex.keyCode === 8) { location.replace('./index2.html#' + vopc); }
    }).off('click').on('click', function () { });
    return false;
}