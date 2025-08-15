var its, itc, ito;
var mknlsx = new Set();
var url0 = 'https://corsproxy.io/?url=';
var url1 = 'https://raw.githubusercontent.com/deswes2021/tvw/main/lst.m3u';
var url2 = 'https://raw.githubusercontent.com/deswes2021/tvw/main/img/';
var url3 = 'https://raw.githubusercontent.com/deswes2021/tvw/main/img/fnd.jpg';
var url4 = 'https://raw.githubusercontent.com/deswes2021/tvw/main/img/log.jpg';
$(document).off('contextmenu').on('contextmenu', function (ex) { ex.preventDefault(); });
$(document).off('keydown').on('keydown', function (ex) { ex.preventDefault(); });
$(document).off('click').on('click', function (ex) { ex.preventDefault(); });

/*--CONTROL SELECTOR KNLS--*/
function selKNL(opt) {
    try {
        if (its < 1) { its = 1; }
        if (its > itc) { its = itc; }
        var d0 = $('#xplayer');
        var d1 = $('.knls');
        var d2 = $('#' + its);
        d1.css({ backgroundColor: 'rgba(0,0,0,0.5)' });
        d2.css({ backgroundColor: 'rgba(255,0,0,0.5)' });
        /*----------------------------------------*/
        var sOff = d2.offset().top - d0.offset().top;
        var sPos = d0.scrollTop() + sOff - d0.height() / 2 + d2.outerHeight() / 2;
        d0.animate({ scrollTop: sPos }, 100);
        /*----------------------------------------*/
        localStorage.setItem(ito, its);
        if (opt === 1) { opcKNL(); }
    } catch (erx) { console.error('Error: ' + erx); }
    return false;
}

/*--CONTROL READY DOCUMENT--*/
$(document).off('ready').on('ready', function () {
    $('body').css({ backgroundColor: 'rgba(0,0,0,1)', margin: 0, padding: 0, userSelect: 'none', pointerEvents: 'none' });
    var lhrf = location.href;
    ito = lhrf.split('#')[1] || 'menu';
    getKNL();
    return false;
});

/*--CONTROL ERROR--*/
function setERR(xmsj) {
    $('body').empty();
    $('<div id="xbody"></div>').css({
        position: 'absolute', margin: 0, padding: 0, left: '1px', top: '1px', right: '1px', bottom: '1px',
        overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center',
        userSelect: 'none', pointerEvents: 'none', color: 'white', fontSize: '2em', textAlign: 'center',
        textShadow: '0 0 1px black, 0 0 3px black, 0 0 5px aqua, 0 0 10px aqua, 0 0 15px aqua, 0 0 20px aqua',
        border: '1px solid silver', borderRadius: '5px', backgroundImage: 'url("' + url3 + '")', backgroundRepeat: 'repeat',
        backgroundSize: '40px'
    }).appendTo('body').text(xmsj);
    $(document).off('keydown').on('keydown', function (ex) {
        try {
            var kCode =  ex.keyCode || window.event;
            if (ex.code === 'Backspace' || kCode === 8) { window.location.replace('./index.html'); }
            ex.preventDefault();
        } catch (erx) { console.error('Error: ' + erx); }
        return false;
    });
    return false;
}

/*--CONTROL GET CANAL--*/
function getKNL() {//Con proxy
    try {
        var TVWlst = localStorage.getItem('TVWlst') || '';
        if (/^(#EXTM3U)/i.test(TVWlst)) { prcKNL(TVWlst); }
        else {
            var nur = (url0 || '') + (url1 || '');
            fetch(nur).then(response => { if (!response.ok) { setERR('CONEXION PERDIDA'); } else { return response.text(); } })
                .then(data => {
                    if (/^(#EXTM3U)/i.test(data)) {
                        localStorage.setItem('TVWlst', data);
                        prcKNL(data);
                    } else { setERR('LISTA NO COMPATIBLE'); }
                }).catch((err) => { setERR('NO SE PUEDE OBTENER LISTA'); });
        }
    } catch (err) { getKNL2(); }
    return false;
}
function getKNL2() {//Sin proxy
    try {
        var TVWlst = localStorage.getItem('TVWlst') || '';
        if (/^(#EXTM3U)/i.test(TVWlst)) { prcKNL(TVWlst); }
        else {
            var nur = url1;
            fetch(nur).then(response => { if (!response.ok) { setERR('CONEXION PERDIDA'); } else { return response.text(); } })
                .then(data => {
                    if (/^(#EXTM3U)/i.test(data)) {
                        localStorage.setItem('TVWlst', data);
                        prcKNL(data);
                    } else { setERR('LISTA NO COMPATIBLE'); }
                }).catch((err) => { setERR('NO SE PUEDE OBTENER LISTA'); });
        }
    } catch (err) { console.log('E: '+err); }
    return false;
}

/*--CONTROL PARC CANALS--*/
function prcKNL(data) {
    const lineas = data.split(/\r?\n/);
    const mknls = [];
    var logox;
    mknlsx = new Set();
    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (linea.startsWith('#EXTINF:')) {
            const mdNombre = linea.match(/nombre="([^"]*)"/i)
                || linea.match(/name="([^"]*)"/i)
                || linea.match(/,(.*)$/);
            const mdTipo = linea.match(/tipo="([^"]*)"/i)
                || linea.match(/title="([^"]*)"/i);
            const mdLogo = linea.match(/logo="([^"]*)"/i);
            const mdUrl = linea.match(/url="([^"]*)"/i);
            const nombre = mdNombre ? mdNombre[1].trim() : '';
            const tipo = mdTipo ? mdTipo[1].trim() : '';
            const logo = mdLogo ? mdLogo[1].trim() : './img/oner.jpg';
            const xurl = mdUrl ? mdUrl[1].trim() : (Array.isArray(lineas) && lineas[i + 1] ? lineas[i + 1].trim() : '');
            
            if (xurl) {
                if (ito === 'menu') {
                    if (!mknlsx.has(tipo)) {
                        mknlsx.add(tipo);
                        if(/\.(jpg|jpeg|bmp|png|svg)/i.test(logo)){ logox = url2 + tipo.toLowerCase() + '.jpg'; }
                        mknls.push({ 'nombre': tipo, 'tipo': tipo, 'logo': logox, 'url': tipo });
                    }
                } else if (ito.toLowerCase() === tipo.toLowerCase()) {
                    mknlsx.add(tipo);
                    if(/\.(jpg|jpeg|bmp|png|svg)/i.test(logo)){ logox = url2 + nombre.toLowerCase() + '.jpg'; }
                    if(/\.(ytb)/i.test(logo)){ logox = 'https://img.youtube.com/vi/' + xurl.split('.')[0] + '/hqdefault.jpg'; }
                    else{ logox = logo;}
                    mknls.push({ 'nombre': nombre, 'tipo': tipo, 'logo': logox, 'url': xurl });
                }
            }
        }
    }
    setKNL(mknls);
    return false;
}

/*--CONTROL SET CANAL--*/
function setKNL(data) {
    $('body').empty();
    $('<div id="xbody"></div>').css({
        position: 'absolute', margin: 0, padding: 0, left: '1px', top: '1px', right: '1px', bottom: '1px',
        overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center',
        userSelect: 'none', pointerEvents: 'none', border: '1px solid silver', borderRadius: '5px',
        backgroundImage: 'url("' + url3 + '")', backgroundRepeat: 'repeat', backgroundSize: '40px'
    }).appendTo('body');
    $('<div id="xplayer"></div>').css({
        margin: 0, padding: 0, maxWidth: '99%', maxHeight: '99%', userSelect: 'none', pointerEvents: 'none',
        overflowX: 'hidden', overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center'
    }).appendTo('#xbody');
    /*--css---------------------------------------------------------------------------------------------------------*/
    try {
        itc = 0;
        data.forEach((ex) => {
            itc++;
            $(`<div class="knls" id="${itc}" tipo="${ex.tipo}" url="${ex.url}" tabindex="-1">
                <input type='image' src='${ex.logo}' onerror='this.onerror=null; this.src="${url4}";'>
                <input type="button" value="${ex.nombre.replace(/ytb/gi, 'Movie ')}">
                <div>`).appendTo('#xplayer');
        });
        if (itc > 0) {
            its = parseInt(localStorage.getItem(ito), 10) || 1;
            $('.knls').css({
                backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid silver', borderRadius: '5px',
                userSelect: 'none', pointerEvents: 'all', margin: '5px', padding: '10px', paddingBottom: '0px', display: 'grid'
            }).on('click', function () { its = parseInt($(this).attr('id'), 10); selKNL(1); })
                .on('mouseover', function () { $(this).css({ backgroundColor: 'rgba(255,0,0,0.5)' }); })
                .on('mouseleave', function () { $(this).css({ backgroundColor: 'rgba(0,0,0,0.5)' }); })
                .on('focus', function () { $(this).css({ backgroundColor: 'rgba(255,0,0,0.5)' }); })
                .on('blur', function () { $(this).css({ backgroundColor: 'rgba(0,0,0,0.5)' }); });
            $('.knls input[type="image"]').css({
                backgroundColor: 'rgba(150, 150, 150, 0.75)', width: '340px', height: '160px', border: '1px solid silver', borderRadius: '5px',
                userSelect: 'none', pointerEvents: 'none', margin: '0px', padding: '0px'
            });
            $('.knls input[type="button"]').css({
                backgroundColor: 'rgba(0, 0, 0, 0)', width: '340px', height: '45px', border: 'none', userSelect: 'none',
                pointerEvents: 'none', margin: '0px', padding: '0px', color: 'white', textTransform: 'uppercase',
                textWrap:'wrap', alignContent:'center', fontSize:'0.9em' , lineHeight:'0.88'
            });
            selKNL(0);
        } else { setERR('LISTA VACIA'); }
    } catch (erx) { console.error('Error: ' + erx); }
    /*--KEYDOWN---------------------------------------------------------------------------------------------------------*/
    $(document).off('keydown').on('keydown', function (ex) {
        try {
            var dpl = $('#xplayer');
            var dpi = dpl.children();
            var dti = dpi.filter(function () { return $(this).position().top === dpi.first().position().top; });
            var dil = dti.length;
            var kCode =  ex.keyCode || window.event;
            /*---------------------------------------*/
            if (ex.code === 'ArrowLeft' || kCode === 37) { its--;/*-*/selKNL(0); }
            else if (ex.code === 'ArrowUp' || kCode === 38) { its -= dil;/*-*/selKNL(0); }
            else if (ex.code === 'ArrowRight' || kCode === 39) { its++;/*-*/selKNL(0); }
            else if (ex.code === 'ArrowDown' || kCode === 40) { its += dil;/*-*/selKNL(0); }
            else if (ex.code === 'Enter' || kCode === 13) { selKNL(1); }
            else if (ex.code === 'Backspace' || kCode === 8) {
                if (!/(menu)/i.test(ito)) { location.replace('./index.html'); }
            }
            ex.preventDefault();
        } catch (erx) { console.error('Error: ' + erx); }
        return false;
    });
    return false;
}

/*--CONTROL OPT CANALES--*/
function opcKNL() {
    d0 = $('#' + its);
    d1 = d0.attr('url');
    d2 = d0.attr('tipo');
    if (/\.(mp4|m3u8|ytb|html)/i.test(d1)) {
        location.replace('./player.html#' + d1 + '#' + d2);
    } else if (/\/(borrarcache|delkche)$/i.test(d1)) {
        localStorage.clear();
        location.replace('./index.html');
    } else if (/\/(actualizar|update)$/i.test(d1)) {
        localStorage.removeItem('TVWlst');
        location.replace('./index.html');
    } else if (/\/(activar|activate)$/i.test(d1)) {
        location.replace('./player.html#' + d1 + '#' + d2);
        //window.open(d1, '_blank');
    } else if (mknlsx.has(d1)) {
        location.replace('./index2.html#' + d1);
    }
    return false;
}