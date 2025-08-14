var its,itc,ito;
function KScripts(scripts, callback) {
    let cargados = 0;
    let total = scripts.length;
    function scriptListo() {
        cargados++;
        if (cargados === total && typeof callback === "function") { callback(); }
    }

    scripts.forEach(function (src) {
        let script = document.createElement("script");
        script.src = src;
        script.onload = scriptListo;
        script.onerror = function () { scriptListo(); };
        document.head.appendChild(script);
    });
}

function setINIC() {
    console.log('cargando');
    KScripts(
        [
            "https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js",
            "https://cdn.jsdelivr.net/npm/clappr@0.3.13/dist/clappr.min.js",
            "https://cdn.jsdelivr.net/npm/dash-shaka-playback@3.5.0/dist/dash-shaka-playback.min.js",
            "https://cdn.jsdelivr.net/npm/@clappr/hlsjs-playback@1.8.3/dist/hlsjs-playback.min.js"
        ], function () { setMENU(); }
    );
    return false;
}

function setMENU() {
    $('body').empty();
    ito = location.href.split('#')[1]||'menu';
    $('body').css({ background: 'black', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' });
    var d0 = location.href.split('#')[1] || 'menu';
    $('<div id="xbody"></div>').css({
        position: 'absolute', left: '1px', top: '1px', right: '1px', bottom: '1px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
        border: '1px solid silver', borderRadius: '5px', display:'flex', flexWrap:'wrap', justifyContent:'center', alignContent:'center'
    }).appendTo('body');
    $('<div id="xplayer"></div>').css({
        userSelect: 'none', pointerEvents: 'none', overflow: 'hidden', maxWidth:'99%', maxHeight:'99%', border: '1px solid silver',
        borderRadius: '5px', display:'flex', flexWrap:'wrap', justifyContent:'center', overflowX:'hidden', overflowY:'scroll',
        scrollbarWidth:'none'
    }).appendTo('#xbody');
    /*--GET-LIST---------------------------------------------------------------------------------*/
    itc=0;
    setLST(function(data){        
        data.forEach(el => {
            if(el.url){
                itc++;
                $('<div class="knl0" tipo="'+el.tipo+'" url="'+el.url+'" tabindex="0">'+
                    '<input class="knl1" type="image" src="'+el.logo+'">'+
                    '<input class="knl2" type="button" value="'+el.nombre+'">'+
                    '</div>').appendTo('#xplayer');
            }
        });        
    });
    /*--SET-CSS----------------------------------------------------------------------------------*/
    if(itc>0){
        its = parseInt(localStorage.getItem(ito))||1;
        $('.knl0').css({
            background:'rgba(0,0,0,0.5)', margin:'5px', padding:'10px', paddingBottom:'10px', border:'1px solid silver',
            userSelect:'none', pointerEvents:'auto', display:'grid'
        });
        $('.knl1').css({
            background:'rgba(102, 100, 100, 0.5)', border:'1px solid silver', userSelect:'none', pointerEvents:'none',
            width:'280px', height:'130px'
        });
        $('.knl1').css({
            background:'transparent', userSelect:'none', pointerEvents:'none', width:'280px', height:'35px', color:'white',
            lineHeight:'0.85', textTransform:'uppercase'
        });
    }
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