<template>
	<SidebarFilterItem>
		<!-- id="dropdown-form" -->
		<b-dropdown
			:text="isDistrictsSelected"
			:class="{
				'active': selectedDistricts.flat().length,
			}"
			ref="selectDistrict"
		>
			<b-dropdown-form>
				<!-- <b-form-group @submit.stop.prevent class="mb-1">
								<b-form-input placeholder="Поиск" />
							</b-form-group> -->

				<template v-for="(item, index) in regions">
					<SelectCheckbox
						:key="`region-${index}`"
						:title="item.text"
						:items="item.districts"
						:index="index"
						:isDistrictHasMetro="districtHasMetro"
						:class="{
							'mb-1 active': regions.length - 1 !== index,
						}"
						@on-items-update="
							onSelectCheckboxItemUpdate(
								selectedDistricts,
								index,
								$event
							)
						"
						@on-checkbox-change="onDistrictCheckboxClick"
						@on-parent-checkbox-change="onParentCheckboxChange"
					/>
				</template>
			</b-dropdown-form>
		</b-dropdown>
	</SidebarFilterItem>
</template>

<script>
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";
import SelectCheckbox from "@/components/elements/SelectCheckbox";

export default {
	name: "SidebarDistrictComponent",
	components: {
		SidebarFilterItem,
		SelectCheckbox,
	},
	data: () => ({
		indeterminate: false,
	}),
	props: {
		selectedRegion: {
			type: Array,
			default: () => [],
		},
		titleDesc: {
			type: String,
			default: "",
		},
	},
	computed: {
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
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

			return this.regions;
		},
		testDistricts: {
			get: function() {
				return this.$store.state.testDistricts;
			},
			set: function(newValue) {
				this.$store.state.testDistricts = newValue;
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
		selectedDistricts: {
			get: function() {
				return this.$store.state.selectedDistricts;
			},
			set: function(newValue) {
				this.$store.state.selectedDistricts = newValue;
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
		isDistrictsSelected() {
			if (this.testDistricts.length) {
				return this.testDistricts
					.map((el) => this.removeRegionFromStr(el))
					.join(", ");
			} else {
				return "Районы";
			}
		},
		districtHasMetro() {
			return this.selectedDistricts.flat(Infinity);
		},
		metroLines: {
			get() {
				return this.$store.state.metroLines;
			},
		},
	},
	methods: {
		removeRegionFromStr(str) {
			return str.replace(/ *\([^)]*\) */g, "");
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
		onParentCheckboxChange(checked, region) {
			let clickedRegion = this.regions.find((el) => el.text === region);
			if (!checked) {
				// console.log(checked);
				// console.log(region);
				// console.log(this.selectedMetroStations);

				clickedRegion.districts.forEach((el) => {
					if (this.testDistricts.includes(el.value)) {
						const index = this.testDistricts.indexOf(el.value);
						if (index > -1) {
							this.testDistricts.splice(index, 1);
						}
					}
				});

				this.$emit("on-region-toggle", region, false);
				this.$emit("on-districts-region-toggle", region, false);
			} else {
				clickedRegion.districts.forEach((el) => {
					if (!this.testDistricts.includes(el.value)) {
						this.testDistricts.push(el.value);
					}
				});

				this.$emit("on-region-toggle", region, true);
				this.$emit("on-districts-region-toggle", region, true);
			}
		},
		onDistrictCheckboxClick(item) {
			// console.log(item);
			if (this.testDistricts.includes(item.value)) {
				// console.log(item);
				this.$emit("on-district-toggle", item.value, true);
			} else {
				this.$emit("on-district-toggle", item.value, false);
			}



			if (!this.selectedRegion.length) {
				this.filters.lengthType = [];
				this.filters.rollingStock = [];
			} else {
				if (!this.filters.lengthType.length) {
					this.filters.lengthType = [
						"Длинный",
						"Средний",
						"Короткий",
					];
				}

				if (!this.filters.rollingStock.length) {
					this.filters.rollingStock = ["БВ", "СВ"];
				}
			}
			// if (!this.districtHasMetro.includes(item.value)) {
			// }
		},

		onRegionChange(item, checked) {
			// console.log(item);
			// console.log(checked);

			this.onParentCheckboxChange(checked, item.text);
			this.$emit("on-all-toggle");
		},

		onSelectCheckboxItemUpdate(arr, index, item) {
			// return this.$set(arr, index, item);
		},

		ondistrictClick(e) {
			if (this.selectedDistricts.length) {
				this.routes.forEach((route) => {
					for (let i = 0; i < e.length; i++) {
						if (route.district !== e[i]) {
							route.isTagShowing = false;
						} else {
							e.forEach((el) => {
								if (el === route.district) {
									route.isTagShowing = true;
								}
							});
						}
					}
				});
			} else {
				this.routes.forEach((el) => {
					el.isTagShowing = true;
				});
			}
		},
		onMetroStationsToggle(arr, checked) {
			arr.forEach((el) => {
				let b = this.metroLines.find((item) => item.value === el);
				let region = b.value.match(/\(([^)]+)\)/)[1];
				b.districts.forEach((district) => {
					let combined = `${district} (${region})`;
					if (this.testDistricts.includes(combined)) {
					} else {
						// console.log("PUSHED  " + combined);
						this.testDistricts.push(combined);
					}
				});
			});

			this.selectedDistricts.forEach((item) => {
				let districtsMetroStations = this.metroLines.filter((el) =>
					el.districts.includes(item)
				);
			});
		},

		onMetroStationToggle(item, arr, checked) {
			if (checked) {
				this.onMetroStationsToggle(arr);
			} else {
				// let clickedStationDistricts = item.districts;
				// let region = item.value.match(/\(([^)]+)\)/)[1];
				// clickedStationDistricts.forEach((distr) => {
				// 	let combinedDistr = `${distr} (${region})`;
				// 	console.log(this.metroLines);
				// 	let allDistrictStations = [];
				// 	this.metroLines
				// 		.filter((station) => {
				// 			// if (station.districts.includes(combinedDistr)) {
				// 			if (station.districts.includes(distr)) {
				// 				return station.value;
				// 			}
				// 		})
				// 		.forEach((el) => {
				// 			allDistrictStations.push(el.value);
				// 		});
				// 	if (
				// 		allDistrictStations.some((item) => arr.includes(item))
				// 	) {
				// 		// console.log('yes');
				// 		// console.log("includes");
				// 	} else {
				// 		// console.log(allDistrictStations);
				// 		// console.log(item);
				// 		// console.log("not includes");
				// 		const index = this.testDistricts.indexOf(combinedDistr);
				// 		if (index > -1) {
				// 			this.testDistricts.splice(index, 1);
				// 		}
				// 	}
				// });
			}
		},
		onRouteTypeClick(checked) {
			if (checked) {
				let distr = this.regions
					.map((el) => el.districts)
					.flat()
					.map((el) => el.value);

				distr.forEach((el) => {
					this.testDistricts.push(el);
				});
				// this.testDistricts
			} else {
				this.testDistricts = [];
			}
		},
	},

	mounted() {},
	created() {
		// this.$parent.$on("on-metro-toggle", this.onMetroStationsToggle);
		this.$parent.$on("on-station-toggle", this.onMetroStationToggle);
		this.$parent.$on("on-region-change", this.onRegionChange);
		this.$parent.$on("on-size-check-click", this.onRouteTypeClick);
		this.$parent.$on("on-rollingstock-click", this.onRouteTypeClick);
	},
};
</script>
