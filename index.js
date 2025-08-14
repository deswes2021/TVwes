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
    ito = location.href.split('#')[1]||'menu';
    if (/(menu)/i.test(ito)) {
        KScripts(["https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js"], function () {setMENU();});
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
    return false;
}

/*--KNLS-MENU------------------*/
function setMENU() {
    $('body').empty();
    $('body').css({ background: 'rgba(64,64,64,1)', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' });
    var d0 = location.href.split('#')[1] || 'menu';
    $('<div id="xbody"></div>').css({
        position: 'absolute', left: '1px', top: '1px', right: '1px', bottom: '1px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
        border: '1px solid silver', borderRadius: '5px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center'
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
                $('<div class="knl0" id="'+itc+'" tipo="' + el.tipo + '" url="' + el.url + '" tabindex="0">' +
                    '<input class="knl1" type="image" src="' + el.logo + '" onerror="this.onerror=null;">' +
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
        }).on('click',function(){ its = parseInt($(this).attr('id')); selKNL(1); });
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
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    var ho = hh + mm + ss;
    return ho;
}

/*--KNLS-SELECTION------------------*/
function opKNL() {
    var d1 = $('#' + its).attr('url');
    var nh = getHH();
    if (/\.(mp4|m3u8|ytb)/i.test(d1)) {
        if (!/(menu)/i.test(ito)) { location.replace('./index.html?' + nh + '#' + d1); }
    } else if (/(\.html|\/activar)$/i.test(d1)) {
        if (!/(menu)/i.test(ito)) { location.replace('./index.html?' + nh + '#' + d1); }
    }
    return false;
}

function setPLAYER(vurl){
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
        } else if (ex.key === 'Backspace' || ex.keyCode === 8) { 
            var nh = getHH();
            location.replace('./index.html?'+nh);
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

function setIFRAME(zurl){
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
            location.replace('./index.html?'+nh);
        }
    }).off('click').on('click', function () { });
    return false;
}















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
            nombre: "Canal7",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal7.jpg",
            url: "https://cdn.elsalvadordigital.com:1936/wotvw/smil:wotvw.smil/playlist.m3u8",
        },
        {
            nombre: "Canal8",
            tipo: "nacionales",
            logo: "https://raw.githubusercontent.com/deswes2021/tvw/main/img/naccanal8.jpg",
            url: "http://201.247.102.189/tmp_hls/stream/index.m3u8",
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