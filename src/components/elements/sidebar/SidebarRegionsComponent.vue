<template>
	<SidebarFilterItem>
		<b-form-checkbox-group v-model="selectedRegion">
			<b-form-checkbox
				v-for="(item, index) in sortedRegions"
				:key="`item-${index}`"
				:value="item.value"
				@change="onSingleCheckClick(item)"
				class="mb-0"
			>
				{{ item.text }}
			</b-form-checkbox>
		</b-form-checkbox-group>
	</SidebarFilterItem>
</template>

<script>
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";

export default {
	name: "SidebarRegionsComponent",
	components: {
		SidebarFilterItem,
	},
	data: () => ({
		hint:
			"Маршруты - тест описания тест описания тест описания тест описания тест описания тест описания",
	}),
	computed: {
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
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

		regions: {
			get: function() {
				return this.$store.state.regions;
			},
			set: function(newValue) {
				this.$store.state.regions = newValue;
			},
		},

		sortedRegions() {
			return this.sort(this.regions, "id");
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
	},
	methods: {
		onRouteTypeClick(checked) {
			if (checked) {
				this.regions.forEach((el) => {
					this.selectedRegion.push(el.text);
				});
			} else {
				this.selectedRegion = [];
			}
		},
		onSingleCheckClick(item) {
			let checked = this.selectedRegion.includes(item.text);
			this.$emit("on-region-change", item, checked);
			// this.$emit("on-checkbox-change", item);

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

		onDistrictsToggle(item, checked) {
			let region = item.match(/\(([^)]+)\)/)[1];
			// console.log(item);

			if (checked) {
				if (!this.selectedRegion.includes(region)) {
					this.selectedRegion.push(region);
				}
			} else {
				let currentRegion = this.regions.find(
					(el) => el.text === region
				);

				let arr = [];
				let i = 0;
				currentRegion.districts.forEach((el) => {
					arr.push(el.value);
				});

				if (!arr.some((el) => this.testDistricts.includes(el))) {
					const index = this.selectedRegion.indexOf(region);

					if (index > -1) {
						this.selectedRegion.splice(index, 1);
					}
				}
			}
		},

		onDistrictsRegionToggle(region, checked) {
			if (checked) {
				if (!this.selectedRegion.includes(region)) {
					this.selectedRegion.push(region);
				}
			} else {
				const index = this.selectedRegion.indexOf(region);

				if (index > -1) {
					this.selectedRegion.splice(index, 1);
				}
			}
		},

		onAllMetroToggle(checked) {
			this.selectedRegion = [
				...new Set(
					this.selectedMetroStations.map((el) => {
						return el.match(/\(([^)]+)\)/)[1];
					})
				),
			];
		},

		onMetroToggle(item, arr, checked) {
			let region = item.value.match(/\(([^)]+)\)/)[1];
			// console.log(item);

			if (checked) {
				if (!this.selectedRegion.includes(region)) {
					this.selectedRegion.push(region);
				}
			} else {
				// let metroContains = [
				// 	...new Set(
				// 		this.selectedMetroStations.map((el) => {
				// 			return el.match(/\(([^)]+)\)/)[1];
				// 		})
				// 	),
				// ];
				// if (!metroContains.includes(region)) {
				// 	const index = this.selectedRegion.indexOf(region);
				// 	if (index > -1) {
				// 		this.selectedRegion.splice(index, 1);
				// 	}
				// }
			}
		},
	},
	created() {
		this.$parent.$on(
			"on-districts-region-toggle",
			this.onDistrictsRegionToggle
		);
		this.$parent.$on("on-district-toggle", this.onDistrictsToggle);
		// this.$parent.$on("on-all-metro-toggle", this.onAllMetroToggle);
		this.$parent.$on("on-station-toggle", this.onMetroToggle);
		this.$parent.$on("on-size-check-click", this.onRouteTypeClick);
		this.$parent.$on("on-rollingstock-click", this.onRouteTypeClick);
	},
};
</script>

<style></style>
