let state = {
    isSidebarSmall: false,
    isSidebarMiddle: false,
    isLoaderVisible: true,

    isManagerLink: false,

    activeTagId: null,
    isHandPickedSetted: false,

    form: {
        email: "",
        name: "",
        phone: "",
        check: true,
        dateStart: "",
        dateFinish: "",
        selectedAdvertisiment: [],
        selectedAdvertisementFormat: [],
    },

    managerPass: 'WGPjk_Fu79Ld3_1K2',

    isOrderSetted: false,

    formEmail: {
        email: "",
        check: true,
        stats: {
            region: "",
            metro: "",
            routes: "",
            vehicles: "",
            grp: "",
            ots: "",
        }
    },

    modalMessage: "",
    combinedRoutes: [],

    selectedRouteSizes: [],
    selectedRouteLength: [],

    routeSizes: [
        { text: "БВ", value: "БВ" },
        { text: "СВ", value: "СВ" },
    ],

    routeLength: [
        { text: "Длинный", value: "Длинный" },
        { text: "Средний", value: "Средний" },
        { text: "Короткий", value: "Короткий" },
    ],

    deletedRoutesIds: [],
    deletedRoutes: [],

    slug: "",

    rangeSliders: {
        grp: [],
        ots: [],
    },

    filters: {
        size: [],
        rollingStock: ["БВ", "СВ"],
        lengthType: [],
        rangeLength: [],
        rangeGrp: [],
    },

    savedGrpRange: [],
    savedLengthRange: [],

    handPickedRoutes: [],
    placemarks: [],

    startFilterSidebarMain: 0,
    startFilterSelectChecbox: 0,
    rangeValuesAllStatistics1: null,
    rangeValuesMiddleStatistics1: null,

    rangeValues1: [10, 100],

    testDistricts: [],

    selectedRegion: [],
    selectedDistricts: [],
    selectedMetroStations: [],
    notSelectedMetroStations: [],
    selectedVehicles: [],
    districts: [],
    selectedDistrictsNew: [],

    currentRegionsDistricts: [],
   
    regions: [],

    isOrderExist: false,

    colorDeleted: '#cbcbcb',

    metroLinesOLD: [

        {
            region: "Ленобласть",
            text: "Девяткино",
            value: "Девяткино",
            district: "Всеволожский",
            line: 1,
            id: 0,
        },
        {
            region: "Санкт-Петербург",
            text: "Академическая",
            value: "Академическая",
            district: "Калининский",
            line: 1,
            id: 3,
        },
        {
            region: "Санкт-Петербург",
            text: "Балтийская",
            value: "Балтийская",
            district: "Адмиралтейский",
            line: 1,
            id: 14,
        },
        {
            region: "Санкт-Петербург",
            text: "Балтийская",
            value: "Балтийская",
            district: "Адмиралтейский",
            line: 1,
            id: 14,
        },
        {
            region: "Санкт-Петербург",
            text: "Нарвская",
            value: "Нарвская",
            district: "Кировский",
            line: 1,
            id: 15,
        },
        {
            region: "Санкт-Петербург",
            text: "Автово",
            value: "Автово",
            district: "Красносельский",
            line: 1,
            id: 17,
        },
        {
            region: "Санкт-Петербург",
            text: "Невский проспект",
            value: "Невский проспект",
            district: "Центральный",
            line: 2,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Горьковская",
            value: "Горьковская",
            district: "Петроградский",
            line: 2,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Московская",
            value: "Московская",
            district: "Московский",
            line: 2,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Шушары",
            value: "Шушары",
            district: "Колпинский",
            line: 2,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Рыбацкое",
            value: "Рыбацкое",
            district: "Невский",
            line: 3,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Василеостровская",
            value: "Василеостровская",
            district: "Василеостровский",
            line: 3,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Ладожская",
            value: "Ладожская",
            district: "Красногвардейский",
            line: 4,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Старая деревня",
            value: "Старая деревня",
            district: "Приморский",
            line: 5,
            isActive: false,
        },
        {
            region: "Санкт-Петербург",
            text: "Адмиралтейская",
            value: "Адмиралтейская",
            district: "Адмиралтейский",
            line: 5,
            isActive: false,
        },
    ],

    metroLines: [],

    //TODO: delete dev objects
    sidebarStep: 0,

    selectedRoutes: [],
    mapObjStore: {},


    routes: [],

    allRoutes: [],
    filteredRoutes: [],
    // test: [],
};
export default state;