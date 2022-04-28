import state from './state.js';
import axios from 'axios';

let actions = {
    pushHandPickedRoute(context, el) {
        context.commit('PUSH_PICKED_ROUTE', el);
    },
    setCombinedRoutes(context, arr) {
        context.commit('SET_COMBINED_ROUTES', arr);
    },
    removeAddedElement(context, el) {
        context.commit('REMOVE_ADDED_ELEMENT', el);
    },
    updateDeletedRoutes(context, arr) {
        context.commit('UPDATE_DELETED_ROUTES', arr);
    },
    postFilters() {

        axios({
            method: "get",
            url: "email_of_manager/",

        })
            .then((resp) => {
                // console.log(resp);
                let body = new FormData();
                body.append("slug", "");
                body.append("jsonData", JSON.stringify({
                    formData: state.form,
                    filters: state.filters,
                    selectedRegion: state.selectedRegion,
                    selectedMetroStations: state.selectedMetroStations,
                    selectedDistricts: state.testDistricts,
                    deletedRoutes: state.deletedRoutes,
                    deletedRoutesIds: state.deletedRoutesIds,
                    handPickedRoutes: state.handPickedRoutes,
                    placemarks: state.placemarks,
                }));
                console.log('========')
                console.log('========')
                console.log(state.placemarks)
                console.log('========')
                console.log('========')

                axios({
                    method: "post",
                    url: "order/",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    data: body,
                }).then(({ data }) => {
                    state.slug = data.slug;

                    axios({
                        method: "post",
                        url: "//map.r-78.net/email-kp.php",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: {
                            managerEmails: resp.data.email,
                            name: state.form.name,
                            email: state.form.email,
                            phone: state.form.phone,
                            dateStart: state.form.dateStart.split('-').reverse().join('.'),
                            dateFinish: state.form.dateFinish.split('-').reverse().join('.'),
                            advType: state.form.selectedAdvertisiment.join(", "),
                            advFormat: state.form.selectedAdvertisementFormat.join(", "),
                            url: `http://map.r-78.net/order/${state.slug}`,

                        },
                    })
                        .then(function () {
                            // alert("Отправлено");
                            state.modalMessage = "Отправлено";
                            state.form = {
                                email: "",
                                name: "",
                                phone: "",
                                check: true,
                                dateStart: "",
                                dateFinish: "",
                                selectedAdvertisiment: [],
                                selectedAdvertisementFormat: [],
                            }
                            state.isSidebarSmall = false;
                            state.sidebarStep = 0;
                        })
                        .catch(function (response) {
                            console.error(response);
                        });
                    // this.$router.push(`/order/${state.slug}/`);
                });
            })
            .catch(function (response) {
                console.error(response);
            });


    },
    postToEmail() {


        axios({
            method: "get",
            url: "email_of_manager/",

        }).then((resp) => {
            let body = new FormData();
            body.append("slug", "");
            body.append("jsonData", JSON.stringify({
                formData: state.formEmail,
                filters: state.filters,
                selectedRegion: state.selectedRegion,
                selectedMetroStations: state.selectedMetroStations,
                selectedDistricts: state.testDistricts,
                deletedRoutes: state.deletedRoutes,
                deletedRoutesIds: state.deletedRoutesIds,
                selectedMetroStations: state.selectedMetroStations,
                handPickedRoutes: state.handPickedRoutes,
                placemarks: state.placemarks,
            }));

            axios({
                method: "post",
                url: "order/",
                data: body,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(({ data }) => {
                state.slug = data.slug;

                axios({
                    method: "post",
                    url: "//map.r-78.net/email-send.php",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: {
                        managerEmails: resp.data.email,
                        phone: state.formEmail.phone,
                        name: state.formEmail.name,
                        email: state.formEmail.email,
                        region: state.formEmail.stats.region,
                        metro: state.formEmail.stats.metro,
                        routes: state.formEmail.stats.routes,
                        vehicles: state.formEmail.stats.vehicles,
                        grp: state.formEmail.stats.grp,
                        ots: state.formEmail.stats.ots,
                        url: `http://map.r-78.net/order/${state.slug}`,
                        urlForManager: `http://map.r-78.net/user-order/${state.slug}`,

                    },
                })
                    .then(function () {
                        // console.log(state.formEmail)
                        // alert("Отправлено");
                        state.modalMessage = "Отправлено";
                        state.formEmail = {
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
                        }
                        state.isSidebarSmall = false;
                        state.sidebarStep = 0;
                    })
                    .catch(function (response) {
                        console.error(response);
                    });
                // this.$router.push(`/order/${state.slug}/`);
            });
        }).catch((err) => {
            console.error(err)
        })
    },
    setHandPickedRoutes(context, arr) {
        context.commit('SET_HAND_ROUTES', arr);
    },
    setPlacemarks(context, arr) {
        context.commit('SET_PLACEMARKS', arr);
    },
    addPlacemark(context, el) {
        let index = state.placemarks.indexOf(el);
        if (index < 0) context.commit('ADD_PLACEMARK', el);
    },
    removePlacemark(context, el) {
        let index = state.placemarks.indexOf(el);
        if (index > -1) context.commit('REMOVE_PLACEMARK', index);
    }
}

export default actions;
