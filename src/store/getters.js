let getters = {
    filteredRoutes: state => state.filteredRoutes,
    notSelectedMetroStations: state => state.notSelectedMetroStations,
    routeSizes: state => state.routeSizes,
    routeLength: state => state.routeLength,
    selectedRouteSizes: state => state.selectedRouteSizes,
    selectedRouteLength: state => state.selectedRouteLength,
    selectedRouteLength: state => state.selectedRouteLength,
    deletedRoutesIds: state => state.deletedRoutesIds,
    metroLines: state => state.metroLines,
    routes: state => state.routes,
    handPickedRoutes: state => state.handPickedRoutes,
    combinedRoutes: state => state.combinedRoutes,
    selectedRegion: state => state.selectedRegion,
    isHandPickedSetted: state => state.isHandPickedSetted,
    deletedRoutes: state => state.deletedRoutes,
    isSidebarSmall: state => state.isSidebarSmall,
    formEmail: state => state.formEmail,
    placemarks: state => state.placemarks,
    managerPass: state => state.managerPass,
}

export default getters;