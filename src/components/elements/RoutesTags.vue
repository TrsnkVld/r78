<template>
	<div class="mb-2">
		<transition-group name="route" mode="out-in">
			<RoutesTagsSearch
				key="results"
				v-if="handPickedRoutes.length"
				@on-route-tag-click="onRouteTagClick"
				@on-route-tag-hover="onRouteTagHover"
			/>
			<template v-if="selectedRegion.length">
				<RoutesTagsRegion
					v-for="(item, index) in computedRegions"
					:key="`region-item-${item.text}`"
					:title="item.text"
					:i="index"
					@on-route-tag-click="onRouteTagClick"
					@on-route-tag-hover="onRouteTagHover"
				/>
				<RoutesTagsRegion
					v-if="deletedRoutesIds.length"
					title="Удаленные маршруты"
					key="region-item-deleted"
					type="deleted routes"
					@on-route-tag-click="onRouteTagClick"
					@on-route-tag-hover="onRouteTagHover"
				/>
			</template>
			<!-- <h2 v-else>Маршруты не выбраны</h2> -->
		</transition-group>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import RoutesTagsRegion from "@/components/elements/routestags/RoutesTagsRegion";
import RoutesTagsSearch from "@/components/elements/routestags/RoutesTagsSearch";

export default {
	name: "RoutesTags",
	components: {
		RoutesTagsRegion,
		RoutesTagsSearch,
	},
	props: {
		items: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		isRoutesShowing: true,
	}),
	computed: {
		...mapGetters([
			"handPickedRoutes",
			"combinedRoutes",
			"deletedRoutes",
			"deletedRoutesIds",
		]),
		notSelectedMetroStations: {
			get: function() {
				return this.$store.state.notSelectedMetroStations;
			},
			set: function(newValue) {
				this.$store.state.notSelectedMetroStations = newValue;
			},
		},
		computedRegions() {
			if (this.selectedRegion.length) {
				let arr = [];

				this.selectedRegion.forEach((el) => {
					arr.push(this.regions.find((item) => el === item.text));
				});

				return this.sort(arr, "id");
			}
			return this.sort(this.regions, "id");
		},
		filteredRoutes: {
			get: function() {
				return this.$store.state.filteredRoutes;
			},
			set: function(newValue) {
				this.$store.state.filteredRoutes = newValue;
			},
		},
		selectedRegion: {
			get: function() {
				return this.sort(this.$store.state.selectedRegion);
			},
			set: function(newValue) {
				this.$store.state.selectedRegion = newValue;
			},
		},
		routes: {
			get: function() {
				return this.$store.state.allRoutes;
			},
			set: function(newValue) {
				this.$store.state.allRoutes = newValue;
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
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
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
		selectedVehicles: {
			get: function() {
				return this.$store.state.selectedVehicles;
			},
			set: function(newValue) {
				this.$store.state.selectedVehicles = newValue;
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
		regions: {
			get: function() {
				return this.$store.state.regions;
			},
			set: function(newValue) {
				this.$store.state.regions = newValue;
			},
		},
		metroLines: {
			get: function() {
				return this.$store.state.metroLines;
			},
			set: function(newValue) {
				this.$store.state.metroLines = newValue;
			},
		},

		metroStations() {
			let arr = [];
			return this.sort(this.metroLines, "text");
		},
	},
	methods: {
		...mapActions(["setCombinedRoutes", "removeAddedElement"]),
		onRouteTagClick(item) {
			this.$emit("on-route-tag-click", item);
		},
		onRouteTagHover(item, mouseenter) {
			this.$emit("on-route-tag-hover", item, mouseenter);
		},
		sort(arr, prop = "") {
			if (prop) {
				arr = arr.sort(function(a, b) {
					if (a[prop] < b[prop]) {
						return -1;
					}
					if (a[prop] > b[prop]) {
						return 1;
					}
					return 0;
				});
			} else {
				arr = arr.sort(function(a, b) {
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
					return 0;
				});
			}
			return arr;
		},
		onSidebarNextClick() {
			this.$emit("on-next-click");
		},
		renderRoutes() {
			this.filteredRoutes = this.items;

			if (!this.isLoaderVisible) {
				this.filteredRoutes = this.filteredRoutes.filter(
					(el) =>
						el.properties.grp >= this.filters.rangeGrp[0] &&
						el.properties.grp <= this.filters.rangeGrp[1]
				);
				this.filteredRoutes = this.filteredRoutes.filter(
					(el) =>
						el.properties.ots >= this.filters.rangeLength[0] &&
						el.properties.ots <= this.filters.rangeLength[1]
				);

				if (this.selectedRegion.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.selectedRegion.some((item) =>
							el.properties.regions.includes(item)
						)
					);
				} else {
					this.filteredRoutes = [];
				}

				if (this.testDistricts.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.testDistricts.some((item) =>
							el.properties.districts.includes(item)
						)
					);
				}

				if (this.selectedMetroStations.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.selectedMetroStations.some((item) =>
							el.properties.metro.includes(
								this.removeRegionFromStr(item)
							)
						)
					);
				}

				if (this.filters.rollingStock.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.filters.rollingStock.includes(
							el.properties.rollingStock
						)
					);
				}

				if (this.filters.size.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.filters.size.includes(el.properties.size)
					);
				}

				if (this.filters.lengthType.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.filters.lengthType.includes(
							el.properties.lengthType
						)
					);
				}
			}

			this.handPickedRoutes.forEach((el) => {
				if (this.filteredRoutes.includes(el))
					this.removeAddedElement(el);
			});

			this.setCombinedRoutes([
				...this.filteredRoutes,
				...this.handPickedRoutes,
			]);
		},
		renderRoutesV1() {
			this.filteredRoutes = this.items;

			if (!this.isLoaderVisible) {
				this.filteredRoutes = this.filteredRoutes.filter(
					(el) =>
						el.properties.grp >= this.filters.rangeGrp[0] &&
						el.properties.grp <= this.filters.rangeGrp[1]
				);
				this.filteredRoutes = this.filteredRoutes.filter(
					(el) =>
						el.properties.ots >= this.filters.rangeLength[0] &&
						el.properties.ots <= this.filters.rangeLength[1]
				);

				if (this.selectedRegion.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.selectedRegion.some((item) =>
							el.properties.regions.includes(item)
						)
					);
				} else {
					this.filteredRoutes = [];
				}

				if (this.testDistricts.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.testDistricts.some((item) =>
							el.properties.districts.includes(item)
						)
					);
				}

				let all = [];
				this.testDistricts.forEach((distr) => {
					let distrSimple = this.removeRegionFromStr(distr);
					let hasStations = this.metroLines.some((station) =>
						station.districts.includes(distrSimple)
					);

					// if (this.selectedMetroStations.length) {

					let arr = [];

					if (hasStations) {
						if (this.selectedMetroStations.length) {
							arr = this.filteredRoutes.filter((route) =>
								this.selectedMetroStations.some((station) =>
									route.properties.metro.includes(
										this.removeRegionFromStr(station)
									)
								)
							);

							// console.log(distrSimple);
							// console.log(this.filteredRoutes);
							// console.log(arr);
						} else {
							// console.log(this.notSelectedMetroStations);
							// arr = this.filteredRoutes;

							let a = this.notSelectedMetroStations.map((el) =>
								this.removeRegionFromStr(el)
							);
							// console.log(a);
							// a = [
							// 	"Автово",
							// 	"Кировский завод",
							// 	"Ленинский проспект",
							// 	"Нарвская",
							// 	"Проспект Ветеранов",
							// ];

							let b = [...this.filteredRoutes];

							this.filteredRoutes.forEach((route) => {
								// let bool = a.some((station) => {
								// 	return route.properties.metro.includes(
								// 		station
								// 	);
								// });

								let bool = route.properties.metro.some(
									(station) => {
										return a.includes(station);
									}
								);

								if (!bool) arr.push(route);
							});

							// let b = [...this.filteredRoutes];

							// arr = b.filter((route) => {
							// 	let bool = route.properties.metro.some(
							// 		(station) => {
							// 			return a.includes(station);
							// 		}
							// 	);

							// 	if (!bool) arr.push(route);
							// });

							// console.log(arr);
						}
					} else {
						// console.log(distrSimple);
						// console.log(this.filteredRoutes);
						arr = this.filteredRoutes.filter((route) =>
							route.properties.districts.includes(distr)
						);

						// arr = this.filteredRoutes;
						// console.log(arr);
					}
					// console.log(distr);
					// console.log(hasStations);
					// console.log(arr);

					all.push(arr);
				});
				this.filteredRoutes = [...new Set(all.flat())];

				// if (this.selectedMetroStations.length) {
				// 	// this.filteredRoutes = this.filteredRoutes.filter((el) => {
				// 	// 	return this.selectedMetroStations.some((item) => {
				// 	// 		return el.properties.metro.includes(
				// 	// 			this.removeRegionFromStr(item)
				// 	// 		);
				// 	// 	});
				// 	// });
				// } else {
				// 	if (
				// 		this.selectedRegion.includes("Ленобласть") &&
				// 		this.selectedRegion.length == 1
				// 	) {
				// 		this.filteredRoutes = this.filteredRoutes.filter(
				// 			(el) => el
				// 		);
				// 	} else {
				// 		// this.filteredRoutes = this.filteredRoutes.filter((el) =>
				// 		// 	this.notSelectedMetroStations.some((item) =>
				// 		// 		el.properties.metro.includes(item)
				// 		// 	)
				// 		// );
				// 		this.filteredRoutes = this.filteredRoutes.filter((el) =>
				// 			this.testDistricts.some((item) =>
				// 				el.properties.districts.includes(item)
				// 			)
				// 		);
				// 	}
				// }

				if (this.filters.rollingStock.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.filters.rollingStock.includes(
							el.properties.rollingStock
						)
					);
				}

				if (this.filters.size.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.filters.size.includes(el.properties.size)
					);
				}

				if (this.filters.lengthType.length) {
					this.filteredRoutes = this.filteredRoutes.filter((el) =>
						this.filters.lengthType.includes(
							el.properties.lengthType
						)
					);
				}

				this.handPickedRoutes.forEach((el) => {
					this.filteredRoutes.push(el);
				});

			}
		},
		removeRegionFromStr(str) {
			return str.replace(/ *\([^)]*\) */g, "");
		},
	},
	watch: {
		handPickedRoutes(val) {
			// console.log(val);
			this.renderRoutes();
		},
		selectedVehicles: {
			deep: true,

			handler() {
				this.renderRoutes();
			},
		},

		selectedMetroStations: {
			deep: true,

			handler() {
				this.renderRoutes();
			},
		},
		filteredRoutes(val) {
			if (val.length) {
				this.isRoutesShowing = true;
			} else {
				this.isRoutesShowing = false;
			}
		},
		selectedRegion(val) {
			this.renderRoutes();
		},
		testDistricts(val) {
			this.renderRoutes();
		},
		filters: {
			deep: true,

			handler() {
				this.renderRoutes();
			},
		},
	},
	mounted() {
		this.renderRoutes();
	},
	created() {
		this.$parent.$on("on-next-click", this.onSidebarNextClick);
	},
};
</script>
