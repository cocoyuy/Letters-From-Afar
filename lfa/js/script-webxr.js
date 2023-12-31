let controller1, controller2;
let controllerGrip1, controllerGrip2;

function setupWebXR() {
    renderer.xr.enabled = true;

    // controller 
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart); // when the trigger is pressed
    controller1.addEventListener('selectend', onSelectEnd); // when the trigger is released
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    // controller grip
    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // display the XR Button
    document.body.appendChild(XRButton.createButton(renderer));

    // controllers and raycaster
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

    raycaster = new THREE.Raycaster();
}

function startXRSession() {
    navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['viewer', 'hand-tracking', 'local', 'teleport'],
        optionalFeatures: ['hand-tracking'],
        audio: true,
    })
        .then((session) => {
            // Handle the XR session
        })
        .catch((error) => {
            // Handle any errors
            console.error('Failed to request XR session:', error);
        });
    // voiceOver.play();
}

function onSelectStart(event) {
    this.userData.isSelecting = true;
    play = true;
    shoot = true;
    text_rotate2 = true;
    // fire = true;
    const controller = event.target;
    const intersections = getIntersections(controller);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        // object.material.emissive.b = 1;
        const doneColor = new THREE.Color(0x04b015);
        object.material.color.set(doneColor);
        controller.attach(object);
        controller.userData.selected = object;
    }
    controller.userData.targetRayMode = event.data.targetRayMode;
}

function onSelectEnd(event) {
    this.userData.isSelecting = false;
    play = false;
    shoot = false;
    text_rotate2 = false;
    // fire = false;
    const controller = event.target;
    if (controller.userData.selected !== undefined) {
        const object = controller.userData.selected;
        // object.material.emissive.b = 0;
        const doneColor = new THREE.Color(0x04b015);
        object.material.color.set(doneColor);
        textGroup.attach(object);
        controller.userData.selected = undefined;
    }
}

// function onSelectStart(event) {
//     this.userData.isSelecting = true;
// }

// function onSelectEnd(event) {
//     this.userData.isSelecting = false;
// }