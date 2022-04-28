<template>
	<div
		class="map"
		:class="{ 'map--expended': isSidebarSmall }"
		:key="componentRender"
	>
		<yandex-map
			v-if="mapShowing"
			:settings="settings"
			:coords="center"
			:zoom="12"
			:controls="[]"
			@map-was-initialized="onYmapLoad"
			@click="onMapClick"
		>
			<!-- :controls="['routePanelControl']" -->
			<template v-for="(item, index) in testRoutes">
				<ymap-marker
					:key="`marker-${index}`"
					:marker-id="item.id"
					marker-type="Polyline"
					:options="lineOptions"
					:properties="item.properties"
					:hint-content="item.properties.title"
					:coords="item.geometry.coordinates"
					@click="lineClick($event, item)"
					@mouseenter="lineMouseEnter"
					@mouseleave="lineMouseLeave"
				/>
			</template>

			<template v-for="item in mapPoints">
				<ymap-marker
					:key="`placemark-${item.id}`"
					:marker-id="item.id"
					marker-type="Placemark"
					:coords="item.coordinates"
					@click="onPointClick($event, item)"
					@contextmenu="onPointRightClick($event, item.id)"
					:hint-content="item.title"
					:properties="{ iconContent: item.title }"
					:options="iconOptions"
					@balloonopen="onBalloonOpen"
					@balloonclose="onBalloonClose"
				>
					<div class="baloon" slot="balloon">
						<h2 class="mb-1">
							<strong>
								{{ item.title ? "Изменение" : "Добавление" }}
								метки
							</strong>
						</h2>
						<!-- <div class="mb-1">Введите название</div> -->
						<input
							id="input"
							type="text"
							value=""
							placeholder="Введите название"
							class="selected-item mb-1"
							autocomplete="off"
						/>
						<div class="d-flex">
							<b-btn variant="primary" id="save" class="mr-1">
								Сохранить
							</b-btn>
							<b-btn variant="primary" id="delete">
								Удалить
							</b-btn>
						</div>
					</div>
				</ymap-marker>

				<!-- :options="pointOptions"
					@dragend="onPointDragend($event, item.id)" -->
			</template>

			<!-- <ymap-marker
				v-for="(item, index) in clusters"
				:key="`disctrict-cluster-${index}`"
				:coords="item.coords"
				:properties="item.properties"
				:icon="markerIcon"
				:marker-id="item.id + 2000"
			>
				asdasd
			</ymap-marker> -->
		</yandex-map>

		<!-- <transition name="map-elements">
			<div class="map-header" v-if="isSidebarSmall">
				<b-button variant="map" @click="onSelectionsOpen">
					<svgicon name="around" />
				</b-button>
				<b-button variant="map">
					С.Петербург
				</b-button>
				<b-button variant="map">
					<svgicon name="key" />
				</b-button>
			</div>
		</transition> -->
		<div class="baloon" slot="balloon">
			<h2 class="mb-0"><strong>Добавление метки</strong></h2>
			<div class="mb-1">Введите название</div>
			<input
				v-model="test"
				type="text"
				class="selected-item mb-1"
				required
			/>
			<b-btn variant="primary">Сохранить</b-btn>
		</div>

		<transition name="map-elements">
			<div class="map-control" v-if="isSidebarSmall">
				<div class="map-control__zoom-btn" @click="zoomIn">
					<svgicon name="plus" />
				</div>
				<div class="map-control__zoom-btn" @click="zoomOut">
					<svgicon name="minus" />
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { debounce } from "debounce";
import { mapGetters, mapActions } from "vuex";
import { yandexMap, ymapMarker } from "vue-yandex-maps";

let colorActive = "#E30925";
let colorNonActive = "#3c8aff";
let colorHover = "#0066FF";
let colorDeleted = "#E30925";

export default {
	name: "MapComponent",
	components: {
		yandexMap,
		ymapMarker,
	},
	props: {
		padding: {
			type: Object,
			default: () => {},
		},
	},
	data: () => ({
		clickedMarkerId: 1,
		isMarkerBalloonOpen: false,
		test: "",
		center: [30.315868, 59.939095],
		mapPoints: [],
		mapShowing: true,
		componentRender: 0,
		isLinesVisible: false,
		routesLineStrings: [],
		testRoutes: [],
		clusters: [
			{
				text: "Кировский",
				coords: [30.257603, 59.876391],
				properties: "",
			},
			{
				text: "Адмиралтейский",
				coords: [30.297542, 59.916825],
			},
			{
				text: "Невский",
				coords: [30.464602, 59.881932],
			},
		],
		pointOptions: {
			draggable: true,
		},
		iconOptions: {
			preset: "islands#blueStretchyIcon",
		},
		pointsIdCounter: 1,
		mapObjectManager: null,
		colorHoverStateId: null,
		// mapTest: {},
		totalVuePackages: null,
		currentSelection: "",
		settings: {
			apiKey: "a0b2e531-602b-4239-a9db-2b981cf9f992",
			lang: "ru_RU",
			coordorder: "longlat",
			version: "2.1",
		},
		lineOptions: {
			strokeColor: colorNonActive,
			strokeWidth: 4,
			opacity: 0.9,
			isRemove: false,
			visible: true,
			zIndex: 2,
		},
		lineOptionsHidden: {
			strokeColor: colorDeleted,
			strokeWidth: 4,
			opacity: 1,
			isRemove: true,
			visible: true,
			zIndex: 1,
		},
		currentRoutes: [],
		markerIcon: {
			layout: "default#imageWithContent",
			imageHref: "icon-ymap.svg",
			imageSize: [43, 43],
			imageOffset: [0, 0],
			content: "3",
			contentOffset: [0, 15],
			contentLayout: "<div>$[properties.iconContent]</div>",
		},

		// clusterOptions: {
		// 	1: {
		// 		clusterDisableClickZoom: true,
		// 		clusterOpenBalloonOnClick: true,
		// 		clusterBalloonLayout: [
		// 			"<ul class=list>",
		// 			"{% for geoObject in properties.geoObjects %}",
		// 			'<li><a href=# class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
		// 			"{% endfor %}",
		// 			"</ul>",
		// 		].join(""),
		// 	},
		// },
	}),
	computed: {
		...mapGetters([
			"combinedRoutes",
			"deletedRoutes",
			"deletedRoutesIds",
			"selectedRegion",
			"handPickedRoutes",
			"isHandPickedSetted",
			"formEmail",
			"placemarks",
		]),
		isOrderExist() {
			return this.$store.state.isOrderExist;
		},
		activeTagId: {
			get: function() {
				return this.$store.state.activeTagId;
			},
			set: function(newValue) {
				this.$store.state.activeTagId = newValue;
			},
		},
		selectedMetroStations: {
			get: function() {
				return this.$store.state.selectedMetroStations;
			},
			set: function(newValue) {
				this.$store.state.selectedMetroStations = newValue;
			},
		},
		isLoaderVisible: {
			get: function() {
				return this.$store.state.isLoaderVisible;
			},
			set: function(newValue) {
				this.$store.state.isLoaderVisible = newValue;
			},
		},
		isSidebarSmall: {
			get: function() {
				return this.$store.state.isSidebarSmall;
			},
			set: function(newValue) {
				this.$store.state.isSidebarSmall = newValue;
			},
		},
		mapZoom: {
			get: function() {
				return this.mapObjStore.getZoom();
			},
			set: function(newValue) {
				this.mapObjStore.setZoom(newValue);
			},
		},

		mapCenter() {
			return this.mapObjStore.getCenter();
		},

		routes: {
			get: function() {
				return this.$store.state.routes;
			},
			set: function(newValue) {
				this.$store.state.routes = newValue;
			},
		},

		mapObjStore: {
			get: function() {
				return this.$store.state.mapObjStore;
			},
			set: function(newValue) {
				this.$store.state.mapObjStore = newValue;
			},
		},

		filter() {
			return this.routes.filter((el) => el.isActive);
		},

		isSidebarSmall: {
			get: function() {
				return this.$store.state.isSidebarSmall;
			},
			set: function(newValue) {
				this.$store.state.isSidebarSmall = newValue;
			},
		},

		selectedRoutes: {
			get: function() {
				return this.$store.state.selectedRoutes;
			},
			set: function(newValue) {
				this.$store.state.selectedRoutes = newValue;
			},
		},
		allRoutes: {
			get: function() {
				return this.$store.state.allRoutes;
			},
			set: function(newValue) {
				this.$store.state.allRoutes = newValue;
			},
		},
		filteredRoutes: {
			get: function() {
				return this.$store.state.filteredRoutes;
			},
			set: function(newValue) {
				this.$store.state.filteredRoutes = newValue;
			},
		},
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
			},
		},
		afilteredDeteletRoutes() {
			return this.testRoutes.filter(
				(route) => !this.deletedRoutesIds.includes(route.id)
			);
		},
	},
	methods: {
		...mapActions(["addPlacemark", "removePlacemark"]),

		onPointDragend(e, id) {
			// let newCoords = e.get("target").geometry.getCoordinates();
			// let arrayItem = this.placemarks.find((el) => el.id === id);
			// arrayItem.coordinates = newCoords;
		},

		onPointClick(e, marker) {
			this.clickedMarkerId = e.get("target").properties._data.markerId;
			let clickedMarker = this.placemarks.find(
				(el) => el.id == this.clickedMarkerId
			);
			setTimeout(() => {
				e.get("target").balloon.open();
				document.getElementById("input").value = clickedMarker.title;
			}, 10);
		},

		onPointRightClick(e, id) {
			let arrayItem = this.placemarks.find((el) => el.id === id);
			let index = this.placemarks.indexOf(arrayItem, 0);
			let object = e.get("target").getParent();
			this.mapObjStore.geoObjects.remove(object);
			this.placemarks.splice(index, 1);
		},
		onBalloonOpen(id) {
			setTimeout(() => {
				document
					.getElementById("save")
					.addEventListener("click", this.onBalloonSaveClick);
				document
					.getElementById("delete")
					.addEventListener("click", this.onBalloonDeleteClick);
				this.isMarkerBalloonOpen = true;
			}, 10);

			// document
			// 	.getElementById("balloon-input")
			// 	.addEventListener("keypress", this.inputValue);
		},
		onBalloonClose(id) {
			document
				.getElementById("save")
				.removeEventListener("click", this.onBalloonSaveClick);
			document
				.getElementById("delete")
				.removeEventListener("click", this.onBalloonDeleteClick);
			// this.onBalloonDeleteClick();
			this.isMarkerBalloonOpen = false;
		},
		onBalloonSaveClick() {
			let inputValue = document.getElementById("input").value;

			let marker = this.placemarks.find(
				(el) => el.id == this.clickedMarkerId
			);
			let index = this.placemarks.indexOf(marker);

			if (index > -1) {
				this.placemarks[index].title = inputValue;
			}
		},

		onBalloonDeleteClick() {
			let marker = this.placemarks.find(
				(el) => el.id == this.clickedMarkerId
			);

			this.removePlacemark(marker);

			this.clickedMarkerId = null;
			this.isMarkerBalloonOpen = false;
		},

		onMapClick(e) {
			// let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

			// for (let i = 0; i < geoObjectsLength; i++) {
			// 	this.mapObjStore.geoObjects.get(i).each((el) => {
			// 		// console.log(el);
			// 	});
			// }

			// let map = this.mapObjStore.events.get("coords");
			if (this.isMarkerBalloonOpen) {
				let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

				for (let i = 0; i < geoObjectsLength; i++) {
					this.mapObjStore.geoObjects.get(i).each((el) => {
						el.balloon.close();
					});
				}
			} else {
				this.createPlacemark(e.get("coords"));
			}
		},

		createPlacemark(coordinates) {
			let newId = 1;

			if (this.placemarks.length) {
				newId = Math.max(...this.placemarks.map((el) => el.id)) + 1;
			}
			this.clickedMarkerId = newId;

			this.addPlacemark({
				id: newId,
				coordinates,
				title: "",
			});

			setTimeout(() => {
				let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

				for (let i = 0; i < geoObjectsLength; i++) {
					this.mapObjStore.geoObjects.get(i).each((el) => {
						console.log(el.properties._data);
						console.log(newId);
						console.log("=====");
						if (el.properties._data.markerId == newId)
							el.balloon.open();
					});
				}
				this.pointsIdCounter++;
			}, 10);
		},

		onSelectionsOpen() {
			this.$emit("on-selections-open");
		},

		onSelectionClose() {
			this.mapObjStore.geoObjects.get(0).each((el) => {
				el.options.set("visible", true);
			});
		},

		onSelectionClick(selectionItem) {
			this.currentSelection = selectionItem.title;

			this.routes.forEach((el) => {
				el.isTagShowing = false;
			});

			setTimeout(() => {
				this.routes.forEach((el) => {
					let selectionsArr = el.properties.selections;

					el.isTagShowing = false;

					if (selectionsArr.length > 0) {
						for (let i = 0; i < selectionsArr.length; i++) {
							if (selectionsArr[i] === this.currentSelection) {
								el.isTagShowing = true;

								// break;
							} else {
								el.isTagShowing = false;
							}
						}
					} else {
						el.isTagShowing = false;
					}
				});
			}, 1);
		},

		filterRoutes() {
			this.currentRoutes.splice(0);
			this.routes.forEach((el) => {
				el.geometry.coordinates.forEach((coord) => {
					[coord[0], coord[1]] = [coord[1], coord[0]];
				});
				this.currentRoutes.push(el);
			});
		},

		lineMouseEnter(e) {
			let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

			for (let i = 0; i < geoObjectsLength; i++) {
				this.mapObjStore.geoObjects.get(0).each((el) => {
					if (
						e.originalEvent.target.properties._data.hintContent ==
						el.properties._data.hintContent
					) {
						el.options.set("strokeColor", colorHover);
						el.options.set("zIndex", "20");
					} else {
						el.options.set("strokeColor", colorNonActive);
						el.options.set("zIndex", "1");
					}
				});
			}
		},

		lineMouseLeave(e) {
			let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

			for (let i = 0; i < geoObjectsLength; i++) {
				this.mapObjStore.geoObjects.get(i).each((el) => {
					// if (this.$route.name === "Route") {
					let b = el.options.getAll();

					if (
						b.strokeColor !== colorActive &&
						b.strokeColor !== colorDeleted
					) {
						el.options.set("strokeColor", colorNonActive);
						el.options.set("zIndex", "2");
					}
					if (b.strokeColor == colorDeleted)
						el.options.set("zIndex", "1");
				});
			}
		},

		lineClick(e, item) {
			this.activeTagId = item.id;
			this.onRouteTagClick(item);
		},

		zoomIn() {
			this.mapObjStore.setZoom(this.mapZoom + 1, {
				useMapMargin: false,
				duration: 500,
				timingFunction: "ease-in-out",
			});
		},
		zoomOut() {
			this.mapObjStore.setZoom(this.mapZoom - 1, {
				useMapMargin: false,
				duration: 500,
				timingFunction: "ease-in-out",
			});
		},
		onYmapLoad(e) {
			e.options.set("maxAnimationZoomDifference", Infinity);
			this.mapObjStore = e;

			if (this.$route.name === "Route") {
				let b = this.routes.find((el) => {
					if (el.properties.title === this.$route.params.code)
						return el;
				});
				setTimeout(() => {
					this.onRouteTagClick(b);
				}, 100);
			}

			let kmArr = [];

			setTimeout(() => {
				if (this.isLinesVisible) {
					let allBounds = [];
					this.mapObjStore.geoObjects.get(0).each((el, index) => {});
					this.combinedRoutes = this.allRoutes;
				}

				this.isLoaderVisible = false;
			}, 1000);
		},
		onRoutePageClose() {
			let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

			for (let i = 0; i < geoObjectsLength; i++) {
				this.mapObjStore.geoObjects.get(i).each((el) => {
					let options = el.options._options;

					if (options.strokeColor === colorActive) {
						// el.options.set("visible", false);
					}
					el.options.set("strokeWidth", "4");
				});
			}

			setTimeout(() => {
				this.setAllMapBounds();
			}, 100);
		},
		onRouteTagHover(item, mouseenter) {
			if (mouseenter) {
				this.onRouteTagClick(item);

				let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

				for (let i = 0; i < geoObjectsLength; i++) {
					this.mapObjStore.geoObjects.get(i).each((el) => {
						if (
							item.properties.title ==
							el.properties._data.hintContent
						) {
							el.options.set("strokeColor", colorActive);
							el.options.set("zIndex", "20");
						} else {
							el.options.set("strokeColor", colorNonActive);
							el.options.set("zIndex", "1");
						}
					});
				}
			} else {
				for (
					let i = 0;
					i < this.mapObjStore.geoObjects.getLength();
					i++
				) {
					this.mapObjStore.geoObjects.get(i).each((el) => {
						if (el.options._options.strokeColor == colorActive) {
							if (el.options._options.isRemove) {
								el.options.set("strokeColor", colorDeleted);
								el.options.set("zIndex", 1);
							} else {
								el.options.set("strokeColor", colorNonActive);
								el.options.set("zIndex", 2);
							}
						} else {
							if (el.options._options.isRemove) {
								el.options.set("strokeColor", colorDeleted);
								el.options.set("zIndex", 1);
							}
						}
					});
				}

				let geoObjectsLength = this.mapObjStore.geoObjects.getLength();

				for (let i = 0; i < geoObjectsLength; i++) {
					this.mapObjStore.geoObjects.get(i).each((el) => {
						let b = el.options.getAll();

						if (
							b.strokeColor !== colorActive &&
							b.strokeColor !== colorDeleted
						) {
							el.options.set("strokeColor", colorNonActive);
							el.options.set("zIndex", "2");
						}
						if (b.strokeColor == colorDeleted) {
							el.options.set("zIndex", "1");
						}
					});
				}
			}
		},
		onRouteTagClick(item) {
			for (let i = 0; i < this.mapObjStore.geoObjects.getLength(); i++) {
				this.mapObjStore.geoObjects.get(i).each((el) => {
					let options = el.options._options;
					if (
						item.properties.title == el.properties._data.hintContent
					) {
						el.options.set("zIndex", 900);
						el.options.set("strokeColor", colorActive);
					} else {
						el.options.set("zIndex", 1);
						el.options.set("strokeColor", colorNonActive);

						if (options.isRemove) {
							el.options.set("strokeColor", colorDeleted);
						}
					}
				});
			}
		},
		setAllMapBounds() {
			let bounds = this.mapObjStore.geoObjects.getBounds();

			this.mapObjStore.margin.setDefaultMargin([0, 0, 0, 0]);
			this.mapObjStore.setBounds(bounds, {
				useMapMargin: false,
				duration: 500,
				timingFunction: "ease-in-out",
			});
		},
		updateRoutes() {
			this.testRoutes = [];
			this.mapPoints = [];

			setTimeout(() => {
				this.testRoutes = [...this.combinedRoutes].filter(
					(route) => !this.deletedRoutesIds.includes(route.id)
				);
				this.mapPoints = this.placemarks;

				if (this.isSidebarSmall) {
					setTimeout(() => {
						this.setAllMapBounds();
					}, 1000);
				}
			}, 0);
		},
	},
	watch: {
		$route(to, from) {
			if (from.name !== to.name) {
				if (from.name === "Route") {
					this.onRoutePageClose();
				}
			}
		},
		handPickedRoutes() {
			this.updateRoutes();
		},

		isSidebarSmall() {
			this.updateRoutes();
		},

		isHandPickedSetted(val) {
			this.updateRoutes();
		},

		selectedRegion(val) {
			this.updateRoutes();
		},

		deletedRoutes(val) {
			this.updateRoutes();
		},

		filters: {
			deep: true,
			handler: debounce(function() {
				this.updateRoutes();
			}, 150),
		},

		selectedMetroStations: {
			deep: true,
			handler: debounce(function() {
				this.updateRoutes();
			}, 150),
		},
	},

	created() {
		this.$parent.$on("on-route-tag-click", this.onRouteTagClick);
		this.$parent.$on("on-route-tag-hover", this.onRouteTagHover);
		this.$parent.$on("on-route-close", this.onRoutePageClose);
		this.$parent.$on("on-selection-click", this.onSelectionClick);
		this.$parent.$on("on-selection-close", this.onSelectionClose);

		if (this.isOrderExist) {
			colorDeleted = "#f6f6f6";
			this.lineOptionsHidden.strokeColor = "#f6f6f6";
			this.lineOptionsHidden.opacity = 0.8;
		}
	},
	mounted() {
		this.routesLineStrings = this.combinedRoutes;
		this.updateRoutes();
	},
	destroyed() {
		this.routesLineStrings = [];
	},
};
</script>

<style lang="scss">
.map {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	padding-left: 404px;
	pointer-events: none;

	.baloon {
		.btn {
			min-width: auto;
		}
	}

	////////////////////////

	.ymaps-2-1-78-image-with-content-content {
		top: calc(100% + 5px) !important;
		left: 50% !important;
		transform: translateX(-50%) !important;
		background: #4d4d4d !important;
		border-radius: 12px;
		color: white;
		padding: 5px 12px !important;
		height: auto !important;
		font-size: 12px !important;
		line-height: 14px !important;
	}

	&-header {
		position: absolute;
		top: 20px;
		right: 20px;
		display: flex;
		justify-content: flex-end;

		.btn {
			&-map {
				margin-left: 10px;

				&:first-of-type {
					margin-left: 0;
				}
			}
		}
	}

	&-control {
		position: absolute;
		top: 50%;
		right: 20px;
		transform: translateY(-50%);
		border-radius: $radius-lg;
		box-shadow: $shadow;

		&__zoom-btn {
			background: white;
			width: 40px;
			height: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			svg {
				width: 12px;
				height: auto;
			}

			&:first-of-type {
				border-radius: $radius-lg $radius-lg 0 0;
			}

			&:last-of-type {
				border-radius: 0 0 $radius-lg $radius-lg;
			}
		}
	}

	.mapboxgl {
		&-ctrl {
			&-group {
				margin: 0;
			}

			&-compass {
				display: none;
			}

			&-top-right {
				top: 50%;
				right: 20px;
				transform: translateY(-50%);
			}
		}
	}

	.ymap-container {
		width: 100%;
		height: 100%;
	}

	.ymaps-2-1-78-controls__control {
		.ymaps-2-1-78-zoom {
			height: auto !important;

			&__scale {
				display: none;
			}
		}
	}

	&--expended {
		pointer-events: all;
	}
}
</style>
