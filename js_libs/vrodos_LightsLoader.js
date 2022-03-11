/**
 * Created by DIMITRIOS on 7/3/2022.
 */

"use strict";

class VRodos_LightsLoader {

    constructor(who){
    };


    load(resources3D) {

        // Lights and Scene Settings loop
        for (let n in resources3D) {
            (function (name) {

                // Scene Settings
                if(name === 'ClearColor') {

                    envir.renderer.setClearColor(resources3D['ClearColor']);

                    if(document.getElementById('sceneClearColor')) {
                        document.getElementById('sceneClearColor').value = resources3D['ClearColor'];
                    }
                    if(document.getElementById('jscolorpick')) {
                        document.getElementById('jscolorpick').value = resources3D['ClearColor'];
                    }
                    return;
                }

                if(name === 'toneMappingExposure') {


                    let toneMappingExposure =  parseFloat(resources3D['toneMappingExposure']);
                    envir.renderer.toneMappingExposure = toneMappingExposure;

                    if(document.getElementById('rendererToneMapping')) {
                        document.getElementById('rendererToneMapping').value = toneMappingExposure;
                    }

                    if(document.getElementById('rendererToneMappingSlider')) {
                        document.getElementById('rendererToneMappingSlider').value = toneMappingExposure;
                    }
                    return;
                }


                if(name === 'enableEnvironmentTexture') {

                    let enableEnvironmentTexture = (resources3D['enableEnvironmentTexture'] === 'true');

                    envir.scene.environment = enableEnvironmentTexture ? envir.maintexture : "";

                    if(document.getElementById('sceneEnvironmentTexture')) {
                        document.getElementById('sceneEnvironmentTexture').checked = enableEnvironmentTexture;
                    }

                    return;
                }



                if (!resources3D[name]['categoryName'].startsWith("light"))
                    return;

                if (resources3D[name]['categoryName']==='lightSun' ){

                    var colora = new THREE.Color(resources3D[name]['lightcolor'][0],
                        resources3D[name]['lightcolor'][1],
                        resources3D[name]['lightcolor'][2]);

                    var lightintensity = resources3D[name]['lightintensity'];

                    // LIGHT
                    var lightSun = new THREE.DirectionalLight( colora, lightintensity ); //  new THREE.PointLight( 0xC0C090, 0.4, 1000, 0.01 );
                    //lightSun.castShadow = true;

                    //Set up shadow properties for the light
                    lightSun.shadow.mapSize.width = 2048;  // default
                    lightSun.shadow.mapSize.height = 2048; // default
                    lightSun.shadow.camera.near = 0.5;    // default
                    lightSun.shadow.camera.far = 500;     // default

                    // REM HERE
                    lightSun.position.set(resources3D[name]['trs']['translation'][0],
                        resources3D[name]['trs']['translation'][1],
                        resources3D[name]['trs']['translation'][2] );

                    lightSun.rotation.set(
                        resources3D[name]['trs']['rotation'][0],
                        resources3D[name]['trs']['rotation'][1],
                        resources3D[name]['trs']['rotation'][2] );

                    lightSun.scale.set( resources3D[name]['trs']['scale'][0],
                        resources3D[name]['trs']['scale'][1],
                        resources3D[name]['trs']['scale'][2]);


                    lightSun.target.position.set(resources3D[name]['targetposition'][0],
                        resources3D[name]['targetposition'][1],
                        resources3D[name]['targetposition'][2]); // where it points

                    lightSun.name = name;
                    lightSun.categoryName = "lightSun";
                    lightSun.isDigiArt3DModel = true;
                    lightSun.isLight = true;

                    lightSun.castShadow = true;
                    lightSun.shadow.mapSize.width = 512;
                    lightSun.shadow.mapSize.height = 512;

                    lightSun.shadow.camera.near = 0.5;
                    lightSun.shadow.camera.far = 1000;

                    lightSun.shadow.camera.left = -30;
                    lightSun.shadow.camera.right = 30;
                    lightSun.shadow.camera.top = 30;
                    lightSun.shadow.camera.bottom = -30;

                    //// Add Sun Helper
                    var sunSphere = new THREE.Mesh(
                        new THREE.SphereBufferGeometry( 1, 16, 8 ),
                        new THREE.MeshBasicMaterial( { color: colora } )
                    );
                    sunSphere.isDigiArt3DMesh = true;
                    sunSphere.name = "SunSphere";
                    lightSun.add(sunSphere);


                    var lightSunHelper = new THREE.DirectionalLightHelper( lightSun, 3, colora);
                    lightSunHelper.isLightHelper = true;
                    lightSunHelper.name = 'lightHelper_' + lightSun.name;
                    lightSunHelper.categoryName = 'lightHelper';
                    lightSunHelper.parentLightName = name;
                    envir.scene.add(lightSunHelper);

                    // end of sphere
                    envir.scene.add(lightSun);

                    lightSun.target.updateMatrixWorld();
                    lightSunHelper.update();

                    // REM LOAD ALSO THE SPOT HELPER AND EXPORT IMPORT IT : SEE FROM ADD REMOVE ONE !!!!
                    // Target spot: Where Sun points
                    var lightTargetSpot = new THREE.Object3D();

                    lightTargetSpot.add(new THREE.Mesh(
                        new THREE.SphereBufferGeometry( 0.5, 16, 8 ),
                        new THREE.MeshBasicMaterial( { color: colora } )
                    ));

                    lightTargetSpot.isDigiArt3DMesh = true;
                    lightTargetSpot.name = "lightTargetSpot_" + lightSun.name;
                    lightTargetSpot.categoryName = "lightTargetSpot";
                    lightTargetSpot.isLightTargetSpot = true;

                    lightTargetSpot.position.set(resources3D[name]['targetposition'][0],
                        resources3D[name]['targetposition'][1],
                        resources3D[name]['targetposition'][2]);

                    lightTargetSpot.parentLight = lightSun;
                    lightTargetSpot.parentLightHelper = lightSunHelper;

                    lightSun.target.position.set(lightTargetSpot.position.x, lightTargetSpot.position.y,
                        lightTargetSpot.position.z) ;

                    envir.scene.add(lightTargetSpot);

                    //Create a helper for the shadow camera (optional)
                    var lightSunShadowhelper = new THREE.CameraHelper( lightSun.shadow.camera );
                    lightSunShadowhelper.name = "lightShadowHelper_" + lightSun.name;
                    envir.scene.add( lightSunShadowhelper );

                } else if (resources3D[name]['categoryName']==='lightLamp' ){

                    var colora = new THREE.Color(resources3D[name]['lightcolor'][0],
                        resources3D[name]['lightcolor'][1],
                        resources3D[name]['lightcolor'][2]);

                    var lightintensity = resources3D[name]['lightintensity'];
                    var lightdecay = resources3D[name]['lightdecay'];
                    var lightdistance = resources3D[name]['lightdistance'];
                    // LIGHT
                    var lightLamp = new THREE.PointLight(colora, lightintensity, lightdistance, lightdecay);
                    lightLamp.intensity = lightintensity;

                    lightLamp.position.set(
                        resources3D[name]['trs']['translation'][0],
                        resources3D[name]['trs']['translation'][1],
                        resources3D[name]['trs']['translation'][2] );

                    lightLamp.rotation.set(
                        resources3D[name]['trs']['rotation'][0],
                        resources3D[name]['trs']['rotation'][1],
                        resources3D[name]['trs']['rotation'][2] );

                    lightLamp.scale.set( resources3D[name]['trs']['scale'],
                        resources3D[name]['trs']['scale'],
                        resources3D[name]['trs']['scale']);

                    lightLamp.name = name;
                    lightLamp.categoryName = "lightLamp";
                    lightLamp.isDigiArt3DModel = true;
                    lightLamp.isLight = true;
                    lightLamp.castShadow = true;
                    lightLamp.shadow.radius = parseFloat( resources3D[name]['shadowRadius'] );



                    envir.scene.add(lightLamp);

                    // Add Lamp Sphere
                    var lampSphere = new THREE.Mesh(
                        new THREE.SphereBufferGeometry(0.5, 16, 8),
                        new THREE.MeshBasicMaterial({color: colora})
                    );
                    lampSphere.isDigiArt3DMesh = true;
                    lampSphere.name = "LampSphere";
                    lightLamp.add(lampSphere);

                    // Helper
                    var lightLampHelper = new THREE.PointLightHelper(lightLamp, 1, colora);
                    lightLampHelper.isLightHelper = true;
                    lightLampHelper.name = 'lightHelper_' + lightLamp.name;
                    lightLampHelper.categoryName = 'lightHelper';
                    lightLampHelper.parentLightName = lightLamp.name;
                    envir.scene.add(lightLampHelper);
                    lightLampHelper.update();

                    // If we do not attach them, they are not visible in Editor !
                    if (typeof transform_controls !== "undefined") {
                        if (typeof attachToControls !== "undefined") {
                            attachToControls(name, envir.scene.getObjectByName(name));
                        }
                    }

                } else if (resources3D[name]['categoryName']==='lightSpot' ){

                    var colora = new THREE.Color(resources3D[name]['lightcolor'][0],
                        resources3D[name]['lightcolor'][1],
                        resources3D[name]['lightcolor'][2]);

                    var lightintensity = resources3D[name]['lightintensity'];
                    var lightdecay = resources3D[name]['lightdecay'];
                    var lightdistance = resources3D[name]['lightdistance'];
                    var lightangle = resources3D[name]['lightangle'];
                    var lightpenumbra = resources3D[name]['lightpenumbra'];

                    // LIGHT
                    var lightSpot = new THREE.SpotLight(colora, lightintensity, lightdistance, lightangle, lightpenumbra, lightdecay);
                    lightSpot.intensity = lightintensity;

                    lightSpot.position.set(
                        resources3D[name]['trs']['translation'][0],
                        resources3D[name]['trs']['translation'][1],
                        resources3D[name]['trs']['translation'][2] );

                    lightSpot.rotation.set(
                        resources3D[name]['trs']['rotation'][0],
                        resources3D[name]['trs']['rotation'][1],
                        resources3D[name]['trs']['rotation'][2] );

                    lightSpot.scale.set( resources3D[name]['trs']['scale'],
                        resources3D[name]['trs']['scale'],
                        resources3D[name]['trs']['scale']);

                    lightSpot.name = name;
                    lightSpot.categoryName = "lightSpot";
                    lightSpot.isDigiArt3DModel = true;
                    lightSpot.isLight = true;

                    lightSpot.castShadow = true;

                    lightSpot.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 0.5, 100 ) );
                    lightSpot.shadow.bias = 0.0001;


                    //
                    lightSpot.shadow.mapSize.width = 1024;
                    lightSpot.shadow.mapSize.height = 1024;

                    //// Add Spot Cone
                    var spotSphere = new THREE.Mesh(
                        new THREE.SphereBufferGeometry( 1, 16, 8 ),
                        new THREE.MeshBasicMaterial({color: colora})
                    );
                    spotSphere.isDigiArt3DMesh = true;
                    spotSphere.name = "SpotSphere";
                    lightSpot.add(spotSphere);
                    // end of sphere

                    // Helper
                    var lightSpotHelper = new THREE.SpotLightHelper(lightSpot, colora);
                    lightSpotHelper.isLightHelper = true;
                    lightSpotHelper.name = 'lightHelper_' + lightSpot.name;
                    lightSpotHelper.categoryName = 'lightHelper';
                    lightSpotHelper.parentLightName = lightSpot.name;

                    envir.scene.add(lightSpot);
                    envir.scene.add(lightSpotHelper);

                    lightSpotHelper.update();

                    // If we do not attach them, they are not visible in Editor !
                    if (typeof transform_controls !== "undefined") {
                        if (typeof attachToControls !== "undefined") {
                            attachToControls(name, envir.scene.getObjectByName(name));
                        }
                    }

                }
            })(n);
        }

    }

}
