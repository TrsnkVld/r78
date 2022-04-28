let mutations = {
    PUSH_PICKED_ROUTE(state, el) {
        let index = state.handPickedRoutes.indexOf(el);
        if (index < 0) {
            state.handPickedRoutes.push(el);
        }
        state.isHandPickedSetted = true;
    },
    SET_COMBINED_ROUTES(state, val) {
        state.combinedRoutes = val;
    },
    REMOVE_ADDED_ELEMENT(state, el) {
        // console.log(el)
        let index = state.handPickedRoutes.indexOf(el);
        if (index > -1) {
            state.handPickedRoutes.splice(index, 1);
        }
    },
    SET_DELETED_ROUTES(state, route) {

        let foundRoute = state.deletedRoutes.find(el => el == route);

        if (foundRoute) {
            let index = state.deletedRoutes.indexOf(route)

            if (index > -1) state.deletedRoutes.splice(index, 1)
        } else {
            state.deletedRoutes.push(route);
        }
    },
    UPDATE_DELETED_ROUTES(state, arr) {
        state.deletedRoutes = arr;
    },
    SET_HAND_ROUTES(state, arr) {
        state.handPickedRoutes = arr;
    },
    SET_PLACEMARKS(state, arr) {
        state.placemarks = arr;
    },
    ADD_PLACEMARK(state, el) {
        state.placemarks.push(el)
    },
    REMOVE_PLACEMARK(state, index) {
        state.placemarks.splice(index, 1)
    }
}

export default mutations;