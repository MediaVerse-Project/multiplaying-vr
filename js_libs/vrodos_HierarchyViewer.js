/**
 *   Reset object in scene
 */
function resetInScene(name){

    if (name === "avatarCamera") {
        envir.avatarControls.getObject().position.set(0, 1.3, 0);
        envir.avatarControls.getObject().quaternion.set(0, 0, 0, 1);
        envir.avatarControls.getObject().children[0].rotation.set(0, 0, 0);
        envir.avatarControls.getObject().children[0].scale.set(1, 1, 1);
    } else {
        envir.scene.getObjectByName(name).position.set(0, 1.3, 0);
        envir.scene.getObjectByName(name).rotation.set(0, 0, 0);
        envir.scene.getObjectByName(name).scale.set(1, 1, 1);
    }
}

function AppendObject(obj, game_object_nameA_assetName, game_object_nameB_dateCreated, deleteButtonHTML, resetButtonHTML){

    jQuery('#hierarchy-viewer').append(
        '<li class="hierarchyItem mdc-list-item" id="' + obj.name + '">' +
        '<a href="javascript:void(0);" class="hierarchyItem mdc-list-item" ' +
        'style="font-size: 9pt; line-height:12pt" ' +
        'data-mdc-auto-init="MDCRipple" title="" onclick="onMouseDoubleClickFocus(event,\'' + obj.name + '\')">' +
        '<span id="" class="mdc-list-item__text">' +
        game_object_nameA_assetName + '<br />' +
        '<span style="font-size:7pt; color:grey">' + game_object_nameB_dateCreated + '</span>' +
        '</span>' +
        '</a>' +
        deleteButtonHTML +
        resetButtonHTML +
        '</li>');
}


function CreateDeleteButton(obj){
    return '<a href="javascript:void(0);" class="hierarchyItemDelete mdc-list-item" aria-label="Delete asset"' + ' title="Delete asset object" onclick="' + 'deleterFomScene(\'' + obj.name + '\');' + '">' +
        '<i class="material-icons mdc-list-item__end-detail" aria-hidden="true" title="Delete">delete </i>' + '</a>';
}

function CreateResetButton(obj){

    return '<a href="javascript:void(0);" class="mdc-list-item" aria-label="Reset asset"' +
    ' title="Reset asset object" onclick="' +
    // Reset 0,0,0 rot 0,0,0
    'resetInScene(\'' + obj.name + '\');'
    + '">' +
    '<i class="material-icons mdc-list-item__end-detail" aria-hidden="true" title="Reset">cached</i>' +
    '</a>';

}

// Highlight item in Hierarchy viewer
function setBackgroundColorHierarchyViewer(name) {

    jQuery('#hierarchy-viewer li').each(
        function (idx, li) {
            jQuery(li)[0].style.background = 'rgb(244, 244, 244)';
        }
    );


    jQuery('#hierarchy-viewer').find('#' + name)[0].style.background = '#a4addf';
}

// Traverse the entire scene to insert scene children in Hierarchy Viewer
function setHierarchyViewer() {

    jQuery('#hierarchy-viewer').empty();

    envir.scene.traverse(function (obj) {

        // SunSphere mesh is not needed a handler to move
        if (obj.name === "SunSphere" || obj.name === "SpotSphere" || obj.name === "ambientSphere")
            return;

        if (obj.isSelectableMesh || obj.name === "avatarCamera") {

            let game_object_nameA_assetName = obj.name === 'avatarCamera' ? "Director" : obj.assetname;

            let game_object_nameB_dateCreated = obj.name === 'avatarCamera' ? "" : unixTimestamp_to_time(
                                                obj.name.substring(obj.name.length - 10, obj.name.length));

            let deleteButton = obj.categoryName === "lightTargetSpot" || obj.name === 'avatarCamera' ? "" :
                                                                                           CreateDeleteButton(obj);

            // Add as a list item
            AppendObject(obj, game_object_nameA_assetName, game_object_nameB_dateCreated, deleteButton, CreateResetButton(obj));
        }
    });
}



// Single object add in Hierarchy
function addInHierarchyViewer(obj) {

    let game_object_nameA_assetName = obj.categoryName !== 'lightTargetSpot' ? obj.assetname : obj.name.substring(0, obj.name.length - 11);

    let game_object_nameB_dateCreated = unixTimestamp_to_time(obj.name.substring(obj.name.length - 10, obj.name.length));

    let deleteButton = obj.categoryName === "lightTargetSpot" ? "" : CreateDeleteButton(obj);

    // Add as a list item
    AppendObject(obj, game_object_nameA_assetName, game_object_nameB_dateCreated, deleteButton, CreateResetButton(obj));
}
