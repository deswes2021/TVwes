var its, itc, ito;
var Clappr;
/*--CARGAR SCRIPT-------------------*/
function KScripts(scripts, callback) {
    let i = 0;
    function cargarSiguiente() {
        if (i >= scripts.length) {
            if (typeof callback === "function") callback();
            return;
        }
        let script = document.createElement("script");
        script.src = scripts[i];
        script.onload = function () {
            i++;
            cargarSiguiente();
        };
        script.onerror = function () {
            console.error("Error cargando:", scripts[i]);
            i++;
            cargarSiguiente();
        };
        document.head.appendChild(script);
    }
    cargarSiguiente();
}

/*--LISTA_SCRIPT-------------------*/
function setINIC() {
    try {
        ito = location.href.split('#')[1] || 'menu';
        if (/(menu)/i.test(ito)) {
            KScripts(["https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js"], function () { setMENU(); });
        } else {
            KScripts([
                "https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js",
                "https://cdn.jsdelivr.net/npm/clappr@0.3.13/dist/clappr.min.js",
                "https://cdn.jsdelivr.net/npm/dash-shaka-playback@3.5.0/dist/dash-shaka-playback.min.js",
                "https://cdn.jsdelivr.net/npm/@clappr/hlsjs-playback@1.8.3/dist/hlsjs-playback.min.js"
            ], function () {
                if (/\.(mp4|m3u8|ytb)/i.test(ito)) { setPLAYER(ito); }
                else if (/(\.html|\/activar)$/i.test(ito)) { setIFRAME(ito); }
            });
        }
    } catch (erx) { console.error('Error: ' + erx); }
    return false;
}

/*--KNLS-MENU------------------*/
function setMENU() {
    $('body').empty();
    $('body').css({ background: 'rgba(64,64,64,1)', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' });
    $('<div id="xbody"></div>').css({
        position: 'absolute', left: '1px', top: '1px', right: '1px', bottom: '1px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
        border: '1px solid silver', borderRadius: '5px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center',
        backgroundImage: 'url('+imgfnd+')', backgroundRepeat: 'repeat', backgroundSize: '35px'
    }).appendTo('body');
    $('<div id="xplayer"></div>').css({
        userSelect: 'none', pointerEvents: 'none', overflow: 'hidden', maxWidth: '99%', maxHeight: '99%', display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', overflowX: 'hidden', overflowY: 'scroll', scrollbarWidth: 'none'
    }).appendTo('#xbody');
    /*--GET-LIST---------------------------------------------------------------------------------*/
    itc = 0;
    setLST(function (data) {
        data.forEach(el => {
            if (el.url) {
                itc++;
                $('<div class="knl0" id="' + itc + '" tipo="' + el.tipo + '" url="' + el.url + '" tabindex="0">' +
                    '<input class="knl1" type="image" src="' + el.logo + '" onerror="this.onerror=null; this.src=\'' + imgerr + '\'">' +
                    '<input class="knl2" type="button" value="' + el.nombre + '">' +
                    '</div>').appendTo('#xplayer');
            }
        });
    });
    /*--KEYDOWN----------------------------------------------------------------------------------*/
    $(document).off('keydown').on('keydown', function (ex) {
        try {
            var kCode = ex.keyCode || window.event;
            /*---------------------------------------*/
            var dpl = $('#xplayer');
            var dpi = dpl.children();
            var dti = dpi.filter(function () { return $(this).position().top === dpi.first().position().top; });
            var dil = dti.length;
            /*---------------------------------------*/
            if (ex.code === 'ArrowLeft' || kCode === 37) {
                its--;
                selKNL(0);
            } else if (ex.code === 'ArrowUp' || kCode === 38) {
                its -= dil;
                selKNL(0);
            } else if (ex.code === 'ArrowRight' || kCode === 39) {
                its++;
                selKNL(0);
            } else if (ex.code === 'ArrowDown' || kCode === 40) {
                its += dil;
                selKNL(0);
            } else if (ex.code === 'Enter' || kCode === 13) {
                selKNL(1);
            } else if (ex.code === 'Backspace' || kCode === 8) {
                var nh = getHH();
                if (!/(menu)/i.test(ito)) { location.replace('./index.html?' + nh); }
            } else if (ex.preventDefault) {
                ex.preventDefault();
            } else { ex.returnValue = false; }
        } catch (erx) { console.error('Error: ' + erx); }
        return false;
    }).off('contextmenu').on('contextmenu', function (ex) {//Desactiva menu contextual
        if (ex.preventDefault) { ex.preventDefault(); }
        else { ex.returnValue = false; }
    }).off('click').on('click', function (ex) {//Control click en document
        if (ex.preventDefault) { ex.preventDefault(); }
        else { ex.returnValue = false; }
    });
    /*--SET-CSS----------------------------------------------------------------------------------*/
    if (itc > 0) {
        its = parseInt(localStorage.getItem(ito)) || 1;
        $('.knl0').css({
            background: 'rgba(0,0,0,0.5)', margin: '5px', padding: '10px', paddingBottom: '0px', border: '1px solid silver',
            borderRadius: '5px', userSelect: 'none', pointerEvents: 'auto', display: 'grid'
        }).on('click', function () { its = parseInt($(this).attr('id')); selKNL(1); });
        $('.knl1').css({
            background: 'rgba(102, 100, 100, 0.5)', border: '1px solid silver', userSelect: 'none', pointerEvents: 'none',
            borderRadius: '5px', width: '280px', height: '130px'
        });
        $('.knl2').css({
            background: 'transparent', userSelect: 'none', pointerEvents: 'none', width: '280px', height: '35px', border: '0px solid red',
            color: 'white', lineHeight: '0.85', textTransform: 'uppercase'
        });
        selKNL(0);
    }
    return false;
}

/*--KNLS-SELECTION------------------*/
function selKNL(opt) {
    try {
        if (its < 1) { its = 1; }
        if (its > itc) { its = itc; }
        var d0 = $('#xplayer');
        var d1 = $('.knl0');
        var d2 = $('#' + its);
        d1.css({ backgroundColor: 'rgba(0,0,0,0.5)' });
        d2.css({ backgroundColor: 'rgba(255,0,0,0.5)' });
        /*----------------------------------------*/
        var sOff = d2.offset().top - d0.offset().top;
        var sPos = d0.scrollTop() + sOff - d0.height() / 2 + d2.outerHeight() / 2;
        d0.animate({ scrollTop: sPos }, 100);
        /*----------------------------------------*/
        localStorage.setItem(ito, its);
        if (opt === 1) { opKNL(); }
    } catch (erx) { console.error('Error: ' + erx); }
    return false;
};

/*--SET-HORAS----------------------*/
function getHH() {
    try {
        var now = new Date();
        var hh = String(now.getHours()).padStart(2, '0');
        var mm = String(now.getMinutes()).padStart(2, '0');
        var ss = String(now.getSeconds()).padStart(2, '0');
        var ho = hh + mm + ss;
        return ho;
    } catch (erx) { console.error('Error: ' + erx); }
}

/*--KNLS-SELECTION------------------*/
function opKNL() {
    try {
        var d1 = $('#' + its).attr('url');
        var nh = getHH();
        console.log(d1);
        if (/\.(mp4|m3u8|ytb)/i.test(d1)) {
            location.replace('./index.html?' + nh + '#' + d1);
        } else if (/(\.html|\/activar)$/i.test(d1)) {
            location.replace('./index.html?' + nh + '#' + d1);
        }
    } catch (erx) { console.error('Error: ' + erx); }
    return false;
}

/*--ANDROID-VERSION-----------------*/
function getAndroidVersion() {
    const ua = navigator.userAgent;
    const match = ua.match(/Android\s([0-9\.]+)/); // Busca "Android X.X"
    return match ? match[1] : null;
}

function setPLAYER(vurl) {
    try {
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
                    parentId: '#xplayer', width: '100vw', height: '100vh', autoPlay: true, mute: false, source: vurl,
                    plugins: Modermplugins,
                    playbackPlugins: Extraplugins,
                    playback: { playInline: true }
                }).on(Clappr.Events.PLAYER_PLAY, () => { setEPLAYER('video', true); });
        } else if (/\.(ytb)/i.test(vurl)) {
            vurl = vurl.split('.')[0];
            player = new Clappr.Player(
                {
                    parentId: '#xplayer', width: '100vw', height: '100vh', autoPlay: true, mute: false, source: vurl,
                    poster: 'https://img.youtube.com/vi/' + vurl + '/hqdefault.jpg',
                    plugins: [YoutubePlugin],
                    youtube: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0, fs: 0, iv_load_policy: 3, mute: 0 },
                    playback: { playInline: true }
                }).on(Clappr.Events.PLAYER_PLAY, () => { setEPLAYER('iframe', true); });
        }
        /*--ACTION-PLAY--------------------------------------------------------------------------------------------------*/
        function setEPLAYER(FOptc, FPlay) {
            if (FPlay) {
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
        $('body').css({ background: 'rgba(64,64,64,1)', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' });
        $('#xplayer').css({
            position: 'absolute', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
            width: '100vw', height: '100vh', objectFit: 'fill', left: '1px', top: '1px', right: '1px', bottom: '1px',
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
            } else if (ex.key === 'Backspace' || ex.keyCode === 8) {
                var nh = getHH();
                location.replace('./index.html?' + nh);
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
    } catch (erx) { console.error('Error: ' + erx); }
    return false;
}

function setIFRAME(zurl) {
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
        if (ex.key === 'Backspace' || ex.keyCode === 8) {
            var nh = getHH();
            location.replace('./index.html?' + nh);
        }
    }).off('click').on('click', function () { });
    return false;
}

/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*--CHANNEL-MAP-----------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
var imgfnd = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RBmRXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAEAAIdpAAQAAAABAAAIPuocAAcAAAgMAAAAMgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6hwABwAACAwAAAhQAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4QjdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIi8+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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";
var imgerr = "data:image/jpg;base64,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";
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*--CHANNEL-MAP-----------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/


function setLST(call) {
    var jsLST = [
        {
            nombre: "tcs +",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal1.jpg",
            url: "https://telecorporacion.cdn.vustreams.com/live/19b307cf-3f2d-44cb-bce6-0fd65365c56a/live.isml/live.m3u8",
        },
        {
            nombre: "Canal2",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal2.jpg",
            url: "https://telecorporacion-es.cdn.vustreams.com/live/d3e259fa-736d-46b0-b1c9-71caf946ace9/live.isml/d3e259fa-736d-46b0-b1c9-71caf946ace9.m3u8",
        },
        {
            nombre: "Canal3",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal3.jpg",
            url: "https://cloud2.streaminglivehd.com:1936/8048/8048/playlist.m3u8",
        },
        {
            nombre: "Canal4",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal4.jpg",
            url: "https://telecorporacion-es.cdn.vustreams.com/live/c5ce1839-52b2-45df-b86b-0b3a00ed4f8f/live.isml/live.m3u8",
        },
        {
            nombre: "Canal5",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal5.jpg",
            url: "https://cdn.elsalvadordigital.com:1936/wotvw/smil:wotvw.smil/playlist.m3u8",
        },
        {
            nombre: "Canal6",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal6.jpg",
            url: "https://telecorporacion.cdn.vustreams.com/live/b164ebe7-decf-4a5a-8aea-5bb56fb92dfc/live.isml/live.m3u8",
        },
        {
            nombre: "Canal9",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal9.jpg",
            url: "https://streaming.asamblea.gob.sv/hls/plenariahd.m3u8",
        },
        {
            nombre: "Canal10",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal10.jpg",
            url: "https://5ca3e84a76d30.streamlock.net:443/tves/videotves/playlist.m3u8",
        },
        {
            nombre: "Canal11",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal11.jpg",
            url: "https://stream.giostreaming.net:19360/canal11/canal11.m3u8",
        },
        {
            nombre: "Canal12",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal12.jpg",
            url: "https://live.airstream.run/alba-sv-c12-c12/original.m3u8",
        },
        {
            nombre: "Canal19",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal19.jpg",
            url: "https://mgv-channel19.akamaized.net/hls/live/2093190/MGV_CHANNEL19/master.m3u8",
        },
        {
            nombre: "Canal21",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal21.jpg",
            url: "https://mgv-channel21.akamaized.net/hls/live/2093191/MGV_CHANNEL21/master.m3u8",
        }
    ];
    call(jsLST);
}