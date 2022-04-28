<template>
	<div class="d-flex justify-content-start" id="advancePaynemt">
		<transition name="filter-fade" mode="out-in">
			<div v-if="!isSidebarSmall && isAnimationFinished" key="filter">
				<SidebarFilters
					@on-region-change="onRegionChange"
					@on-district-toggle="onDistrictToggle"
					@on-region-toggle="onRegionToggle"
					@on-districts-region-toggle="onDistrictsRegionToggle"
					@on-metro-toggle="onMetroToggle"
					@on-all-metro-toggle="onAllMetroToggle"
					@on-station-toggle="onMetroStationToggle"
					@on-size-check-click="onSizeCheckClick"
					@on-rollingstock-check-click="onRollingstockCheckClick"
				/>
			</div>
		</transition>
		<transition name="filter-fade" mode="out-in">
			<div
				v-if="isAnimationFinished"
				class="output flex-grow-1 d-flex flex-column"
				:class="{
					'output--small': isSidebarSmall,
					'output--border': !combinedRoutes.length,
				}"
			>
				<SidebarFilters
					v-if="isSidebarSmall"
					key="filter2"
					@on-region-change="onRegionChange"
					@on-district-toggle="onDistrictToggle"
					@on-region-toggle="onRegionToggle"
					@on-districts-region-toggle="onDistrictsRegionToggle"
					@on-metro-toggle="onMetroToggle"
					@on-all-metro-toggle="onAllMetroToggle"
					@on-station-toggle="onMetroStationToggle"
					@on-size-check-click="onSizeCheckClick"
					@on-rollingstock-check-click="onRollingstockCheckClick"
				/>

				<RoutesTags
					key="tags"
					:items="routes"
					@on-route-tag-click="onSidebarRouteTagClick"
					@on-route-tag-hover="onSidebarRouteTagHover"
				/>
				<div
					v-if="
						(isAnimationFinished &&
							selectedRegion.length &&
							filteredRoutes.length &&
							withPickedRoutes) ||
							combinedRoutes.length
					"
					key="content-info"
					class="flex-grow-1 d-flex flex-column"
				>
					<div v-if="isSidebarSmall" key="stats">
						<template v-if="!isItOrderPage">
							<div>
								<div
									class="d-flex flex-wrap justify-content-start align-items-center"
								>
									<b-button
										variant="primary"
										@click="isSidebarSmall = false"
										class="align-items-center justify-content-center mr-2 mb-2"
									>
										Назад
									</b-button>
									<b-button
										key="send"
										variant="danger"
										class="align-items-center justify-content-center mb-2"
										@click="$emit('on-step-change', 1)"
									>
										<svgicon name="route" />
										Сделать КП
									</b-button>
								</div>
								<div>
									<b-button
										variant="primary"
										class="align-items-center justify-content-center"
										@click="$emit('on-step-change', 2)"
									>
										<svgicon name="share" />
										Отправить
									</b-button>
									<!-- <b-dropdown
											toggle-class="dropdown-toggle--save"
											class="dropdown--save"
											variant="primary"
										>
											<template #button-content>
												<svgicon name="share" />
												Отправить
											</template>
											<b-dropdown-item>
												@click="
												$emit('on-step-change', 3),
													(isSidebarSmall = !isSidebarSmall),
													(isSidebarMiddle = !isSidebarMiddle)
											"
												Печать
											</b-dropdown-item>

											<b-dropdown-item>
												Скачать
											</b-dropdown-item> 

											<b-dropdown-item
												@click="
													$emit('on-step-change', 2)
												"
											>
												Скачать на E-mail
											</b-dropdown-item>
										</b-dropdown> -->
								</div>
							</div>
						</template>
						<template v-else>
							<b-button
								v-if="isManagerLink"
								variant="primary"
								@click="onPutFilters()"
								class="align-items-center justify-content-center"
							>
								Сохранить
							</b-button>
						</template>
					</div>
					<div v-else key="btns" class="mt-auto">
						<h2>Статистика</h2>
						<b-row>
							<b-col cols="6">
								<ul
									class="list-icons"
									:class="{ 'mb-5': isSidebarSmall }"
								>
									<li v-if="isDistrictsSelectedRegion">
										<svgicon name="map-region" />
										{{ statsRegions }}
									</li>
									<li v-if="isMetroStationsSelectedRegion">
										<svgicon name="metro" />

										{{ statsMetro }}
									</li>
									<li v-if="stats.routesQuantity">
										<svgicon name="bus" />

										{{ statsRoutes }}
									</li>
									<li v-if="stats.routesVehiclesQuantity">
										<svgicon name="bus" />

										{{ statsVehicles }}
									</li>
									<li v-if="stats.grpSum">
										<svgicon name="stars" />
										{{ statsGrp }}
									</li>
									<li v-if="stats.otsSum">
										<svgicon name="star" />
										{{ statsOts }}
									</li>
								</ul></b-col
							>
							<b-col cols="6" class="d-flex">
								<b-button
									key="form"
									variant="danger"
									class="align-items-center justify-content-center mt-auto"
									@click="onMapNextClick"
								>
									<!-- <svgicon name="route" /> -->
									Карта
								</b-button>
							</b-col>
						</b-row>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { debounce } from "debounce";
import SidebarFilters from "@/components/elements/sidebar/SidebarFilters";
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";
import SidebarDistrictComponent from "@/components/elements/sidebar/SidebarDistrictComponent";
import SidebarRegionsComponent from "@/components/elements/sidebar/SidebarRegionsComponent";
import SidebarFilterBtn from "@/components/elements/sidebar/SidebarFilterBtn";
import SidebarMetroComponent from "@/components/elements/sidebar/SidebarMetroComponent";
import SidebarRollingStock from "@/components/elements/sidebar/SidebarRollingStock";
import SidebarSizes from "@/components/elements/sidebar/SidebarSizes";
import SelectCheckbox from "@/components/elements/SelectCheckbox";
import RoutesTags from "@/components/elements/RoutesTags";
import RouteSearch from "@/components/elements/RouteSearch";

export default {
	name: "SidebarMain",
	components: {
		SidebarFilters,
		SidebarSizes,
		SidebarRollingStock,
		SidebarFilterItem,
		SelectCheckbox,
		RoutesTags,
		SidebarMetroComponent,
		SidebarDistrictComponent,
		SidebarRegionsComponent,
		SidebarFilterBtn,
		RouteSearch,
	},
	data: () => ({
		isAnimationFinished: true,
		axiosConfig: {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
		statsSelected: "Санкт-Петербург",
		step: 0,
		hintGrp:
			"GRP (Gross Rating Point, суммарный рейтинг, валовый рейтинг) — один из главных маркетинговых показателей, который отражает масштаб воздействия рекламы. Он представляет собой сумму всех рейтингов рекламной кампании.",

		hintRoutes:
			"Маршруты - тест описания тест описания тест описания тест описания тест описания тест описания",
		hintDistricts:
			"Районы - тест описания тест описания тест описания тест описания тест описания тест описания",
		hintMetroStations:
			"Станции метро - тест описания тест описания тест описания тест описания тест описания тест описания",
		hintBrands:
			"Марка автобуса - тест описания тест описания тест описания тест описания тест описания тест описания",
		hintBusTypes:
			"Тип автобуса - тест описания тест описания тест описания тест описания тест описания тест описания",
		hintOts:
			"OTS - тест описания тест описания тест описания тест описания тест описания тест описания",
		selectedDistrictMetroItems: [],
		selectedDistrictItems: [],

		vehicles: [
			{ text: "МА3103", value: "МА3103" },
			{ text: "ЛиА3", value: "ЛиА3" },
			{ text: "ПАЗ", value: "ПАЗ" },
			{ text: "МА3206", value: "МА3206" },
			{ text: "VW", value: "VW" },
			{ text: "Mercedes", value: "Mercedes" },
			{ text: "Iveco", value: "Iveco" },
		],

		places: [
			{
				text: "",
				isAdding: true,
			},
		],

		// rangeLength: [0, 150000],

		min1: 0,
		max1: 150000,
		sliderInputMin: 0,
		sliderInputMax: 150000,

		min2: 0,
		max2: 5,
		sliderInputGrpMin: 0,
		sliderInputGrpMax: 5,

		routesRegionType: [],

		isFirstLoaded: true,
	}),
	computed: {
		...mapGetters([
			"deletedRoutes",
			"deletedRoutesIds",
			"combinedRoutes",
			"handPickedRoutes",
			"isHandPickedSetted",
			"formEmail",
			"placemarks",
		]),

		isItOrderPage() {
			let currentPage = this.$route.fullPath.split("/");

			if (
				currentPage.includes("order") ||
				currentPage.includes("user-order")
			) {
				return true;
			}

			return false;
		},
		minMaxOts() {
			let arr = this.routes.reduce((acc, val) => {
				acc[0] =
					acc[0] === undefined ||
					val.properties.ots < acc[0].properties.ots
						? val
						: acc[0];
				acc[1] =
					acc[1] === undefined ||
					val.properties.ots > acc[1].properties.ots
						? val
						: acc[1];
				return acc;
			}, []);

			return arr.map((el) => el.properties.ots);
		},
		minMaxGrp() {
			let arr = this.routes.reduce((acc, val) => {
				acc[0] =
					acc[0] === undefined ||
					val.properties.grp < acc[0].properties.grp
						? val
						: acc[0];
				acc[1] =
					acc[1] === undefined ||
					val.properties.grp > acc[1].properties.grp
						? val
						: acc[1];
				return acc;
			}, []);

			let b = arr.map((el) => el.properties.grp);

			return [Math.floor(b[0]), Math.ceil(b[1])];
		},
		statsRegions() {
			return `${this.testDistricts.length} ${this.declOfNum(
				this.testDistricts.length,
				["район", "района", "районов"]
			)}`;
		},
		statsMetro() {
			return `${
				this.isMetroStationsSelectedRegion.split(", ").length
			} ${this.declOfNum(
				this.isMetroStationsSelectedRegion.split(", ").length,
				["станция", "станции", "станций"]
			)} метро`;
		},
		statsRoutes() {
			return `${this.stats.routesQuantity} ${this.declOfNum(
				this.stats.routesQuantity,
				["маршрут", "маршрута", "маршрутов"]
			)}`;
		},
		statsVehicles() {
			return `${this.stats.routesVehiclesQuantity} ${this.declOfNum(
				this.stats.routesVehiclesQuantity,
				["транспортное", "транспортных", "транспортных"]
			)} ${this.declOfNum(this.stats.routesVehiclesQuantity, [
				"средство",
				"средства",
				"средств",
			])}`;
		},
		statsGrp() {
			return `${this.stats.grpSum} показатель GRP`;
		},
		statsOts() {
			return `${this.stats.otsSum} показатель OTS`;
		},
		// isOrderSetted: {
		// 	get: function() {
		// 		return this.$store.state.isOrderSetted;
		// 	},
		// 	set: function(newValue) {
		// 		this.$store.state.isOrderSetted = newValue;
		// 	},
		// },
		formEmail: {
			get: function() {
				return this.$store.state.formEmail;
			},
			set: function(newValue) {
				this.$store.state.formEmail = newValue;
			},
		},
		withPickedRoutes() {
			return this.filteredRoutes.some(
				(el) => el.properties.isPicked == true
			);
		},
		sortedVehicles() {
			return this.sort(this.vehicles, "text");
		},
		slug: {
			get: function() {
				return this.$store.state.slug;
			},
			set: function(newValue) {
				this.$store.state.slug = newValue;
			},
		},
		sidebarStep: {
			get: function() {
				return this.$store.state.sidebarStep;
			},
			set: function(newValue) {
				this.$store.state.sidebarStep = newValue;
			},
		},
		rangeSliders: {
			get: function() {
				return this.$store.state.rangeSliders;
			},
			set: function(newValue) {
				this.$store.state.rangeSliders = newValue;
			},
		},
		currentRegionsDistricts: {
			get: function() {
				return this.$store.state.currentRegionsDistricts;
			},
			set: function(newValue) {
				this.$store.state.currentRegionsDistricts = newValue;
			},
		},
		filteredRoutes() {
			return this.$store.getters.filteredRoutes;
		},
		metroLines: {
			get() {
				return this.$store.state.metroLines;
			},
		},

		computedRegions() {
			if (this.selectedRegion.length) {
				let arr = [];

				this.selectedRegion.forEach((el) => {
					arr.push(this.regions.find((item) => el === item.text));
				});

				return arr;
			}
			return this.regions;
		},

		stats() {
			return {
				routesQuantity: this.routesQuantity,
				routesVehiclesQuantity: this.routesVehiclesQuantity,
				kmSum: this.kmSum,
				kmAverage: this.kmAverage,
				grpAverage: this.grpAverage,
				grpSum: this.grpSum,
				otsSum: this.otsSum,
			};
		},

		currentRegionDistricts() {
			let arr = [];

			if (this.regions.length) {
				// let region = this.regions.find(
				// 	(el) => el.text === this.statsSelected
				// );

				// region.districts.forEach((el) => {
				// 	arr.push(el.text);
				// });

				this.regions.forEach((el) => {
					el.districts.forEach((el) => {
						arr.push(el.value);
					});
				});
			}

			return arr;
		},
		selectedRegionsDistricts() {
			let arr = [];

			this.selectedRegion.forEach((region) => {
				let currentRegion = this.regions.find(
					(el) => el.text === region
				);
				currentRegion.districts.forEach((distr) => {
					if (!arr.includes(distr.value)) {
						arr.push(distr.value);
					}
				});
			});
			return arr;
		},

		routesQuantity() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter(
					(el) =>
						// this.currentRegionDistricts.includes(el.district)
						el.properties.isPicked &&
						this.currentRegionDistricts.some((item) =>
							el.properties.districts.includes(item)
						)
				);
				if (regionRoutes.length) {
					return regionRoutes
						.filter((el) => el)
						.reduce((total, i) => total + 1, 0);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		routesVehiclesQuantity() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter(
					(el) =>
						// this.currentRegionDistricts.includes(el.district)
						el.properties.isPicked &&
						this.currentRegionDistricts.some((item) =>
							el.properties.districts.includes(item)
						)
				);
				if (regionRoutes.length) {
					return regionRoutes
						.filter((el) => el)
						.reduce((total, i) => total + i.properties.quantity, 0);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		kmSum() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter((el) =>
					this.currentRegionDistricts.some((item) =>
						el.properties.districts.includes(item)
					)
				);
				if (regionRoutes.length) {
					return regionRoutes
						.reduce(
							(total, i) => total + i.properties.pathLength,
							0
						)
						.toFixed(1);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		kmAverage() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter((el) =>
					this.currentRegionDistricts.some((item) =>
						el.properties.districts.includes(item)
					)
				);
				if (regionRoutes.length) {
					return (
						Math.round(
							(regionRoutes.reduce(
								(total, i) => total + i.properties.pathLength,
								0
							) /
								regionRoutes.length) *
								1e1
						) / 1e1
					);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		grpSum() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter(
					(el) =>
						this.currentRegionDistricts.some((item) =>
							el.properties.districts.includes(item)
						) && el.properties.isPicked
				);
				// console.log(regionRoutes);
				if (regionRoutes.length) {
					return (
						Math.round(
							regionRoutes.reduce(
								(total, i) => total + i.properties.grp,
								0
							) * 100
						) / 100
					);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		otsSum() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter(
					(el) =>
						this.currentRegionDistricts.some((item) =>
							el.properties.districts.includes(item)
						) && el.properties.isPicked
				);
				if (regionRoutes.length) {
					return (
						Math.round(
							regionRoutes.reduce(
								(total, i) => total + i.properties.ots,
								0
							) * 100
						) / 100
					);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		grpAverage() {
			if (this.combinedRoutes.length) {
				let regionRoutes = this.combinedRoutes.filter((el) =>
					this.currentRegionDistricts.some((item) =>
						el.properties.districts.includes(item)
					)
				);
				if (regionRoutes.length) {
					return (
						Math.round(
							(regionRoutes.reduce(
								(total, i) => total + i.properties.grp,
								0
							) /
								regionRoutes.length) *
								1e1
						) / 1e1
					);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		},

		isRouteHome() {
			if (
				this.$route.name === "Home" ||
				this.$route.name === "Order" ||
				this.$route.name === "OrderItem"
			)
				return true;
			return false;
		},
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
			},
		},
		filterLength: {
			get: function() {
				return this.filters.rangeLength;
			},
			set: function(newValue) {
				this.filters.rangeLength = newValue;
			},
		},
		filterGrp: {
			get: function() {
				return this.filters.rangeGrp;
			},
			set: function(newValue) {
				this.filters.rangeGrp = newValue;
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
		isSidebarMiddle: {
			get: function() {
				return this.$store.state.isSidebarMiddle;
			},
			set: function(newValue) {
				this.$store.state.isSidebarMiddle = newValue;
			},
		},
		testDistricts: {
			get: function() {
				return this.$store.state.testDistricts;
			},
			set: function(newValue) {
				this.$store.state.testDistricts = newValue;
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
		selectedRegion: {
			get: function() {
				return this.$store.state.selectedRegion;
			},
			set: function(newValue) {
				this.$store.state.selectedRegion = newValue;
			},
		},
		selectedVehicles: {
			get: function() {
				return this.$store.state.selectedVehicles;
			},
			set: function(newValue) {
				this.$store.state.selectedVehicles = newValue;
			},
		},
		selectedDistrictMetro: {
			get: function() {
				return this.$store.state.selectedDistrictMetro;
			},
			set: function(newValue) {
				this.$store.state.selectedDistrictMetro = newValue;
			},
		},
		regions: {
			get: function() {
				return this.$store.state.regions;
			},
			set: function(newValue) {
				this.$store.state.regions = newValue;
			},
		},
		metroStations() {
			let b = [];
			// this.regions.forEach((item) => {
			// 	item.districts.forEach((el) => {
			// 		let metroArr = [];

			// 		item.metro.forEach((station) => {
			// 			if (el.text === station.district)
			// 				metroArr.push(station);
			// 		});

			// 		b.push({
			// 			id: el.id,
			// 			text: el.text,
			// 			metro: metroArr,
			// 		});
			// 	});
			// });

			this.metroLines.forEach((item) => {
				item.stations.forEach((el) => {
					b.push(el);
				});
			});

			// let final = [];

			// if(this.selectedDistricts.flat().length > 0) {
			// 	this.concatedDisctrics.forEach((selectedDistrict) => {
			// 		b.forEach((el) => {
			// 			if (selectedDistrict == el.district) final.push(el);
			// 		});
			// 	});

			// 	return final;
			// }

			return b;
		},
		routes() {
			return this.$store.state.routes;
		},
		subRoutes() {
			let b = this.routes;
			return b;
		},
		isRegionSelected() {
			return this.selectedRegion.flat(Infinity).join(", ");
		},
		isDistrictsSelected() {
			if (this.selectedDistricts.flat().length > 0) {
				return this.selectedDistricts.flat(Infinity).join(", ");
			} else {
				return "Выберите районы";
			}
		},
		isDistrictsSelectedRegion() {
			// let selectedRegion = this.regions.find(
			// 	(el) => el.text === this.statsSelected
			// );
			// if (this.regions.length) {
			// 	let selectedRegionDistricts = [];
			// 	let regionDistricts = [];
			// 	selectedRegion.districts.forEach((el) => {
			// 		regionDistricts.push(el.text);
			// 	});
			// 	this.filteredRoutes.forEach((el) => {
			// 		el.properties.districts.forEach((item) => {
			// 			if (!selectedRegionDistricts.includes(item)) {
			// 				selectedRegionDistricts.push(item);
			// 			}
			// 		});
			// 	});

			// 	let final = regionDistricts.filter((item) =>
			// 		selectedRegionDistricts.includes(item)
			// 	);
			// 	return final.join(", ");
			// }

			if (this.regions.length) {
				let selectedRegionDistricts = [];
				let regionDistricts = [];
				this.regions.forEach((region) => {
					region.districts.forEach((el) => {
						regionDistricts.push(el.text);
					});
				});

				this.filteredRoutes
					.filter((el) => el.properties.isPicked)
					.forEach((el) => {
						el.properties.districts.forEach((item) => {
							if (!selectedRegionDistricts.includes(item)) {
								selectedRegionDistricts.push(item);
							}
						});
					});

				let final = regionDistricts.filter((item) =>
					selectedRegionDistricts.includes(item)
				);
				return final.join(", ");
			}
		},
		isMetroStationsSelected() {
			if (this.selectedMetroStations.length) {
				// let newArrDistrict = [];

				// this.metroLines.flat().forEach((item) => {
				// 	item.stations.forEach((el) => {
				// 		this.selectedDistricts.flat().forEach((district) => {
				// 			if (el.district === district && this.selectedMetroStations.includes(el.text)) {
				// 				this.selectedDistrictItems.push(el.text)
				// 			}
				// 		});
				// 	});
				// });

				// console.log(this.selectedMetroStations.flat())

				// return [
				// 	...new Set(
				// 		this.filteredRoutes
				// 			.filter((el) => el.properties.isPicked)
				// 			.map((el) => el.properties.metro)
				// 			.flat()
				// 	),
				// ].join(", ");

				return this.selectedMetroStations.flat(Infinity).join(", ");
			} else {
				return "Выберите станции метро";
			}
		},
		isMetroStationsSelectedRegion() {
			// let selectedRegion = this.regions.find(
			// 	(el) => el.text === this.statsSelected
			// );

			// if (this.regions.length) {
			// 	let selectedMetro = [];
			// 	let allRegionMetro = [];
			// 	selectedRegion.districts.forEach((el) => {
			// 		this.metroLines.forEach((station) => {
			// 			if (station.districts.includes(el.text)) {
			// 				if (!allRegionMetro.includes(station.text)) {
			// 					allRegionMetro.push(station.text);
			// 				}
			// 			}
			// 		});
			// 	});

			// 	this.filteredRoutes.forEach((el) => {
			// 		el.properties.metro.forEach((item) => {
			// 			if (!selectedMetro.includes(item)) {
			// 				selectedMetro.push(item);
			// 			}
			// 		});
			// 	});

			// 	let final = allRegionMetro.filter((item) =>
			// 		selectedMetro.includes(item)
			// 	);
			// 	return final.join(", ");
			// }

			if (this.regions.length) {
				let selectedMetro = [];
				let allRegionMetro = [];

				this.regions.forEach((region) => {
					region.districts.forEach((el) => {
						this.metroLines.forEach((station) => {
							if (station.districts.includes(el.text)) {
								if (!allRegionMetro.includes(station.text)) {
									allRegionMetro.push(station.text);
								}
							}
						});
					});
				});

				this.filteredRoutes
					.filter((el) => el.properties.isPicked)
					.forEach((el) => {
						el.properties.metro.forEach((item) => {
							if (!selectedMetro.includes(item)) {
								selectedMetro.push(item);
							}
						});
					});

				let final = allRegionMetro.filter((item) =>
					selectedMetro.includes(item)
				);
				return final.join(", ");
			}
		},
		isVehiclesSelected() {
			if (this.selectedVehicles.length > 0) {
				return this.selectedVehicles.join(", ");
			} else {
				return "Выберите марку автобуса";
			}
		},
		selectedRoutes: {
			get: function() {
				return this.$store.state.selectedRoutes;
			},
			set: function(newValue) {
				this.$store.state.selectedRoutes = newValue;
			},
		},
		startFilterSidebarMain: {
			get: function() {
				return this.$store.state.startFilterSidebarMain;
			},
			set: function(newValue) {
				this.$store.state.startFilterSidebarMain = newValue;
			},
		},
		isManagerLink: {
			get: function() {
				return this.$store.state.isManagerLink;
			},
			set: function(newValue) {
				this.$store.state.isManagerLink = newValue;
			},
		},

		handPickedRoutes: {
			get: function() {
				return this.$store.state.handPickedRoutes;
			},
			set: function(newValue) {
				this.$store.state.handPickedRoutes = newValue;
			},
		},
		modalMessage: {
			get: function() {
				return this.$store.state.modalMessage;
			},
			set: function(newValue) {
				this.$store.state.modalMessage = newValue;
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
	},
	methods: {
		...mapActions(["setHandPickedRoutes", "setPlacemarks"]),
		...mapMutations(["SET_DELETED_ROUTES"]),

		onMapNextClick() {
			this.isAnimationFinished = false;

			setTimeout(() => {
				this.isSidebarSmall = !this.isSidebarSmall;
				this.$emit("on-next-click");

				setTimeout(() => {
					this.isAnimationFinished = true;
				}, 300);
			}, 100);
		},

		onSizeCheckClick(checked) {
			this.$emit("on-size-check-click", checked);
		},
		onRollingstockCheckClick(checked) {
			this.$emit("on-rollingstock-click", checked);
		},
		onDistrictsRegionToggle(region, checked) {
			this.$emit("on-districts-region-toggle", region, checked);
		},
		onRegionChange(item, checked) {
			this.$emit("on-region-change", item, checked);
		},
		onPostFilters() {
			this.$store.dispatch("postFilters");
			// console.log("go");
			// let formData = new FormData();
			// formData.append("slug", "");
			// formData.append("jsonData", this.jsonData);

			// this.axios({
			// 	method: "post",
			// 	url: "order/",
			// 	data: formData,
			// 	headers: {
			// 		"Content-Type": "multipart/form-data",
			// 	},
			// }).then(({ data }) => {
			// 	this.slug = data.slug;
			// 	this.$router.push(`/order/${this.slug}/`);
			// });
		},
		onPutFilters() {
			let formData = new FormData();
			formData.append("slug", this.slug);
			formData.append(
				"jsonData",
				JSON.stringify({
					formData: this.form,
					filters: this.filters,
					selectedRegion: this.selectedRegion,
					selectedMetroStations: this.selectedMetroStations,
					selectedDistricts: this.testDistricts,
					deletedRoutes: this.deletedRoutes,
					deletedRoutesIds: this.deletedRoutesIds,
					handPickedRoutes: this.handPickedRoutes,
                    placemarks: this.placemarks,
				})
			);

			this.axios({
				method: "put",
				url: `order/${this.slug}/`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}).then(({ data }) => {
				this.$store.state.modalMessage = "Данные заказа сохранены";
			});
		},
		downloadXML(filePath, content) {
			let allRoutes = [
				...this.filteredRoutes,
				...this.handPickedRoutes,
			].map((el) => el.properties.title);
			// console.log(allRoutes);

			const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
            <route> ${allRoutes.join(", ")} </route>
        `;

			let blob = new Blob([xmlStr], { type: "text/xml" });
			let url = URL.createObjectURL(blob);
			// window.open(url, "_self");
			// URL.revokeObjectURL(url);
			// console.log(url);

			var saveData = (function() {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				return function(data, fileName) {
					a.href = url;
					a.download = fileName;
					a.click();
					window.URL.revokeObjectURL(url);
				};
			})();

			var data = xmlStr,
				fileName = "routes.xml";

			saveData(data, fileName);
		},
		declOfNum(number, words) {
			return words[
				number % 100 > 4 && number % 100 < 20
					? 2
					: [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
			];
		},
		onRegionToggle(region, checked) {
			this.$emit("on-region-toggle", region, checked);
		},
		onDistrictToggle(item, checked) {
			this.$emit("on-district-toggle", item, checked);
		},
		onMetroStationToggle(item, arr, checked) {
			this.$emit("on-station-toggle", item, arr, checked);
		},
		onMetroToggle(arr, checked) {
			this.$emit("on-metro-toggle", arr, checked);
		},
		sort(arr, prop) {
			arr = arr.sort(function(a, b) {
				if (a[prop] < b[prop]) {
					return -1;
				}
				if (a[prop] > b[prop]) {
					return 1;
				}
				return 0;
			});
			return arr;
		},
		onInputMinChange: debounce(function(evt, val) {
			val = parseInt(val, 10);
			evt = evt ? evt : window.event;
			var charCode = evt.which ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				evt.preventDefault();
			} else {
				if (this.sliderInputMin == "") {
					this.sliderInputMin = this.min1;
				}
				if (this.sliderInputMin < this.min1) {
					this.sliderInputMin = this.min1;
				}
				if (this.sliderInputMin > this.max1) {
					this.sliderInputMin = this.max1 - 1;
				}
				this.$set(
					this.filterLength,
					0,
					parseInt(this.sliderInputMin, 10)
				);
				return true;
			}
		}, 350),

		filteredRoutesChange: debounce(function(val) {
			if (this.isFirstLoaded) {
				this.isSidebarSmall = true;
				this.$emit("on-next-click");
				this.isFirstLoaded = false;
			}
		}, 500),

		onInputMaxChange: debounce(function(evt, val) {
			val = parseInt(val, 10);
			evt = evt ? evt : window.event;
			var charCode = evt.which ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				evt.preventDefault();
			} else {
				if (this.sliderInputMax == "") {
					this.sliderInputMax = this.max2;
				}
				if (this.sliderInputMax < this.min1) {
					this.sliderInputMax = this.min1 + 1;
				}
				if (this.sliderInputMax > this.max1) {
					this.sliderInputMax = this.max1;
				}
				this.$set(
					this.filterLength,
					1,
					parseInt(this.sliderInputMax, 10)
				);
				return true;
			}
		}, 350),

		onInputGrpMinChange: debounce(function(evt, val) {
			val = parseInt(val, 10);
			evt = evt ? evt : window.event;
			var charCode = evt.which ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				evt.preventDefault();
			} else {
				if (this.sliderInputGrpMin == "") {
					this.sliderInputGrpMin = this.min2;
				}
				if (this.sliderInputGrpMin < this.min2) {
					this.sliderInputGrpMin = this.min2;
				}
				if (this.sliderInputGrpMin > this.max2) {
					this.sliderInputGrpMin = this.max2 - 1;
				}
				this.$set(
					this.filterGrp,
					0,
					parseInt(this.sliderInputGrpMin, 10)
				);
				return true;
			}
		}, 350),

		onInputGrpMaxChange: debounce(function(evt, val) {
			val = parseInt(val, 10);
			evt = evt ? evt : window.event;
			var charCode = evt.which ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				evt.preventDefault();
			} else {
				if (this.sliderInputGrpMax == "") {
					this.sliderInputGrpMax = this.max2;
				}
				if (this.sliderInputGrpMax < this.min2) {
					this.sliderInputGrpMax = this.min2;
				}
				if (this.sliderInputGrpMax > this.max2) {
					this.sliderInputGrpMax = this.max2 - 1;
				}
				this.$set(
					this.filterGrp,
					1,
					parseInt(this.sliderInputGrpMax, 10)
				);
				return true;
			}
		}, 350),

		onSelectCheckboxItemUpdate(arr, index, item) {
			return this.$set(arr, index, item);
		},

		resetPlaces() {
			this.places = [
				{
					text: "",
					isAdding: true,
				},
			];
		},

		onSidebarRouteTagClick(item) {
			this.$emit("on-route-tag-click", item);
			// console.log(item);
			// if (this.isRouteHome) {
			// 	this.$router.push({
			// 		name: "Route",
			// 		params: { code: item.properties.name },
			// 	});
			// } else {
			// 	this.$router.push({ name: "Home" });

			// 	setTimeout(() => {
			// 		this.$router.push({
			// 			name: "Route",
			// 			params: { code: item.properties.name },
			// 		});
			// 	}, 300);
			// }
		},
		onSidebarRouteTagHover(item, mouseenter) {
			this.$emit("on-route-tag-hover", item, mouseenter);
		},

		// generatePdf() {
		// 	const doc = new jsPDF();

		// 	doc.text("Hello world!", 10, 10);
		// 	doc.save("a4.pdf");
		// },

		// test1: debounce(function(e) {
		// 	if (e < 0 || e > 150000) {
		// 		this.filters.rangeLength = [0, 150000];
		// 	}
		// }, 600),
		// test2: debounce(function(e) {
		// 	if (e < 0 || e > 5) {
		// 		this.filters.rangeGrp = [0, 5];
		// 	}
		// }, 600),

		// onSelectedRemove(item, arr) {
		// 	if (arr === "selectedDistricts") {
		// 		this.selectedDistricts.forEach((el) => {
		// 			if (el === item) {
		// 				var index = this.selectedDistricts.indexOf(el);
		// 				if (index > -1) {
		// 					this.selectedDistricts.splice(index, 1);
		// 				}
		// 			}
		// 		});
		// 	}
		// 	if (arr === "selectedVehicles") {
		// 		this.selectedVehicles.forEach((el) => {
		// 			if (el === item) {
		// 				var index = this.selectedVehicles.indexOf(el);
		// 				if (index > -1) {
		// 					this.selectedVehicles.splice(index, 1);
		// 				}
		// 			}
		// 		});
		// 	}
		// 	if (arr === "places") {
		// 		this.places.forEach((el) => {
		// 			if (el === item) {
		// 				var index = this.places.indexOf(el);
		// 				if (index > -1) {
		// 					this.places.splice(index, 1);
		// 				}
		// 			}
		// 		});
		// 	}
		// },
		// onAddClick(str) {
		// 	if (str === "selectDistrict") {
		// 		console.log(this.$refs.selectDistrict);
		// 		this.$refs.selectDistrict.show();
		// 	}
		// 	if (str === "place") {
		// 		this.places.push({
		// 			text: "",
		// 			isAdding: true,
		// 		});
		// 	}
		// },
		setRegionType(val) {
			this.routesRegionType = [];
			if (val.includes("Санкт-Петербург")) {
				this.routesRegionType.push("городские");
			}
			if (val.includes("Ленобласть")) {
				this.routesRegionType.push("областные");
			}
		},
		onSidebarToggle() {
			this.$emit("on-next-click");
		},
		onAllMetroToggle(checked) {
			this.$emit("on-all-metro-toggle", checked);
		},

		onGetFilters() {
			this.axios({
				method: "get",
				url: `order/${this.slug}/`,
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then(({ data }) => {
					// console.log(data);
					setTimeout(() => {
						// this.$store.state.isOrderExist = true;
					}, 10);

					this.filters = data.jsonData.filters;
					this.selectedRegion = data.jsonData.selectedRegion;
					this.selectedMetroStations =
						data.jsonData.selectedMetroStations;
					this.testDistricts = data.jsonData.selectedDistricts;

					let currentPage = this.$route.fullPath.split("/");

					if (currentPage.includes("user-order")) {
						this.isManagerLink = true;
					}
					if (data.jsonData.deletedRoutes.length) {
						data.jsonData.deletedRoutes.forEach((el) => {
							this.SET_DELETED_ROUTES(el);
						});
					}
					this.$store.state.deletedRoutesIds =
						data.jsonData.deletedRoutesIds;
					this.setHandPickedRoutes(data.jsonData.handPickedRoutes);
					this.setPlacemarks(data.jsonData.placemarks);
				})
				.catch((err) => {
					console.error(err);
					this.$store.state.modalMessage =
						"Данных не существует или они были удалены";
				});
		},
		setDeletedRoutes() {
			if (this.deletedRoutesIds.length) {
				this.deletedRoutesIds.forEach((id) => {
					this.filteredRoutes.find(
						(route) => route.id === id
					).properties.isPicked = false;
				});
			}
		},
	},

	watch: {
		isHandPickedSetted(val) {
			if (val && window.location.href.endsWith("?downloadroutes")) {
				setTimeout(() => {
					this.downloadXML();
				}, 2000);
			}
		},

		statsRegions(val) {
			this.formEmail.stats.region = val;
			// console.log(val);
		},
		statsMetro(val) {
			this.formEmail.stats.metro = val;
		},
		statsRoutes(val) {
			this.formEmail.stats.routes = val;
		},
		statsVehicles(val) {
			this.formEmail.stats.vehicles = val;
		},
		statsGrp(val) {
			this.formEmail.stats.grp = val;
		},
		statsOts(val) {
			this.formEmail.stats.ots = val;
		},

		filterLength(val) {
			this.sliderInputMin = this.filterLength[0];
			this.sliderInputMax = this.filterLength[1];
		},
		filterGrp(val) {
			this.sliderInputGrpMin = this.filterGrp[0];
			this.sliderInputGrpMax = this.filterGrp[1];
		},
		selectedRegion(val) {
			this.setRegionType(val);

			if (val.length < 2) {
				this.statsSelected = val[0];
			}

			this.currentRegionsDistricts = this.selectedRegionsDistricts;
		},
		filteredRoutes(val) {
			this.setDeletedRoutes();

			if (!this.isLoaderVisible && this.isItOrderPage) {
				this.filteredRoutesChange(val);
			}
		},
		// isOrderSetted(val) {
		// 	if (val) {
		// 		this.isSidebarSmall = true;
		// 		this.$emit("on-next-click");
		// 	}
		// },
	},

	mounted() {
		let pathNameArr = this.$route.path.replace(/^\/|\/$/g, "").split("/");
		if (pathNameArr[0] == "order" || pathNameArr[0] == "user-order") {
			if (pathNameArr.length > 1) {
				this.slug = pathNameArr[1];
				this.onGetFilters();
			} else {
				this.$router.push({ name: "Home" });
			}
		}

		if (!this.selectedRegion.length) {
			this.filters.rollingStock = [];
			this.filters.lengthType = [];
		}

		// if (!this.filterLength.length) {
		this.$set(this.filters, "rangeLength", this.minMaxOts);

		this.min1 = this.minMaxOts[0];
		this.max1 = this.minMaxOts[1];
		this.sliderInputMin = this.minMaxOts[0];
		this.sliderInputMax = this.minMaxOts[1];

		this.$set(this.filters, "rangeGrp", [
			this.minMaxGrp[0],
			this.minMaxGrp[1],
		]);

		this.min2 = this.minMaxGrp[0];
		this.max2 = this.minMaxGrp[1];
		this.sliderInputGrpMin = this.minMaxGrp[0];
		this.sliderInputGrpMax = this.minMaxGrp[1];

		this.formEmail.stats.region = this.statsRegions;
		this.formEmail.stats.metro = this.statsMetro;
		this.formEmail.stats.routes = this.statsRoutes;
		this.formEmail.stats.vehicles = this.statsVehicles;
		this.formEmail.stats.grp = this.statsGrp;
		this.formEmail.stats.ots = this.statsOts;

		this.rangeSliders.grp = this.minMaxGrp;
		this.rangeSliders.ots = this.minMaxOts;

		this.max1 = this.filters.rangeLength[1];
		// }

		this.setRegionType(this.selectedRegion);
		this.currentRegionsDistricts = this.selectedRegionsDistricts;

		if (this.$store.state.savedGrpRange.length) {
			this.filterGrp = this.$store.state.savedGrpRange;
		}

		if (this.$store.state.savedLengthRange.length) {
			this.filterLength = this.$store.state.savedLengthRange;
		}
	},
	created() {
		this.$parent.$on("on-sidebar-toggle", this.onSidebarToggle);
	},
	beforeDestroy() {
		this.$store.state.savedGrpRange = this.filterGrp;
		this.$store.state.savedLengthRange = this.filterLength;
	},
};
</script>

<style lang="scss">
.route-regions {
	text-transform: capitalize;
}

.range {
	&__slider {
		padding: 0 10px !important;
		height: 20px !important;
		background: $grey-light;
		border-radius: $radius-md;

		.vue-slider {
			&-process,
			&-rail {
				background: transparent !important;
			}

			&-dot {
				top: 0 !important;
				transform: translateX(-50%) !important;
				width: auto !important;
				height: auto !important;

				&-handle {
					border: none;
					background: $primary;
					width: 20px !important;
					height: auto !important;
					border-radius: $radius-md;

					&::after {
						content: "";
						display: block;
						width: 100% !important;
						padding-top: 100% !important;
					}

					&-focus {
						box-shadow: none;
					}
				}
			}
		}

		&:hover {
			.vue-slider {
				&-rail {
					background: transparent;
				}

				&-process {
					background: transparent;
				}
			}
		}
	}

	&__text {
		input {
			color: $grey;
			text-decoration: underline;
			text-decoration-style: dashed;
			padding: 0;
			margin: 0;
			border: none;
			outline: none;
			padding: 3px 11px;
			border-radius: 4px;

			&:focus {
				background: #f6f6f6;
				text-decoration: none;
				color: black;
			}
		}
	}
}

.output {
	// position: sticky;
	// top: 40px;
	position: relative;
	padding-top: 9px;

	&::before {
		transition: border $transition;
		border: 2px dashed transparent;
		content: "";
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: calc(100% - 44px);
		pointer-events: none;
	}

	&--border {
		&::before {
			border-color: #a9a9a9;
		}
	}

	&--small {
		&.output--border {
			&::before {
				display: none;
			}
		}
	}

	.filter {
		width: 100%;
		max-width: calc(404px - 40px);
		padding: 52px 0 30px 0 !important;

		& > * {
			width: auto;
		}
	}
}
</style>
