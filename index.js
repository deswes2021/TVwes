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
            "https://cdn.jsdelivr.net/npm/dash-shaka-playback@3.5.0/dist/dash-shaka-playback.min.js",
            "https://cdn.jsdelivr.net/npm/@clappr/hlsjs-playback@1.8.3/dist/hlsjs-playback.min.js"
        ], function () { setMENU(); }
    );
    return false;
}

function setMENU() {
    $('body').empty();
    $('body').css({ background: 'black', margin: '0px', padding: '0px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' });
    var d0 = location.href.split('#')[1] || 'menu';
    $('<div id="xbody"></div>').css({
        position: 'absolute', left: '1px', top: '1px', right: '1px', bottom: '1px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
        border: '1px solid silver', borderRadius: '5px', display:'flex', flexWrap:'wrap', justifyContent:'center', alignContent:'center'
    }).appendTo('body');
    $('<div id="xplayer">666</div>').css({
        userSelect: 'none', pointerEvents: 'none', overflow: 'hidden',
        border: '1px solid silver', borderRadius: '5px', display:'flex', flexWrap:'wrap', justifyContent:'center', alignContent:'center'
    }).appendTo('#xbody');
    /*------------------------------------------------------------------------------------*/    
    return false;
}
