'use strict';

function setTransformControlsSize(){

    let dims = findDimensions(transform_controls.object);

    let sizeT = 0.25 * Math.log((Math.max(...dims) + 1)  + 1) ;

    transform_controls.setSize(sizeT );
}

function vrodos_read_url(input, id) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            jQuery(id).attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}


function vrodos_fillin_widget_assettrs( selectedObject ) {
    if (selectedObject) {
        let asset_id = selectedObject.value;
        vrodos_fetch_Assettrs_and_setWidget(asset_id, selectedObject);
    }
}

function unixTimestamp_to_time(tStr) {
    var unix_timestamp = parseInt(tStr);
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + formattedTime;
}

function rgbToHex(red, green, blue) {
    const rgb = (red << 16) | (green << 8) | (blue << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
}


function updateClearColorPicker(picker){
    document.getElementById('sceneClearColor').value = picker.toRGBString();
    var hex = rgbToHex(picker.rgb[0], picker.rgb[1], picker.rgb[2]);
    //envir.renderer.setClearColor(hex);
    envir.scene.background = new THREE.Color(hex);
}

function updateFogColorPicker(picker){

    document.getElementById('FogColor').value = picker.toRGBString();

    updateFog();
}

function loadFogType() {

    if (document.getElementById('RadioNoFog').checked) {
        document.getElementById('FogType').value = "none";
    } else if (document.getElementById('RadioLinearFog').checked) {
        document.getElementById('FogType').value = "linear";
    } else if (document.getElementById('RadioExponentialFog').checked) {
        document.getElementById('FogType').value = "exponential";
    }

    updateFog();
}

function updateFog(){

    let picker = document.getElementById('jscolorpickFog').jscolor;

    let fogType = document.getElementById('FogType').value;
    let fogNear = document.getElementById('FogNear').value
    let fogFar = document.getElementById('FogFar').value;
    let fogDensity = document.getElementById('FogDensity').value;

    let hex = rgbToHex(picker.rgb[0], picker.rgb[1], picker.rgb[2]);

    if(fogType === 'linear') {
        envir.scene.fog = new THREE.Fog(hex, fogNear, fogFar);
    } else if(fogType === 'exponential') {
        envir.scene.fog = new THREE.FogExp2(hex, fogDensity);
    } else if(fogType === 'none') {
        if (envir.scene.fog){
            envir.scene.fog = null;
            console.log("fog exists");
        } else {
            console.log("fog does not exists");
        }

    }



    triggerAutoSave();
}








