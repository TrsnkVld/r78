<template>
	<SidebarFilterItem class="sidebar-metro" :hint="titleDesc">
		<b-dropdown
			:text="isMetroStationsSelected"
			:class="{
				active: selectedMetroStations.length,
			}"
			ref="selectMetroStations"
		>
			<b-dropdown-form>
				<b-form-group @submit.stop.prevent>
					<b-form-input
						placeholder="Поиск"
						v-model="searchStr"
						autocomplete="off"
					/>
				</b-form-group>
				<div class="select-checkbox-wrap">
					<div class="select-checkbox-wrap__toggle">
						<b-form-checkbox
							:indeterminate="isIndeterminate"
							v-model="isAllSelected"
							@change="onAllToggle"
						>
							Все станции метро
						</b-form-checkbox>
					</div>

					<b-form-checkbox-group
						class="b-dropdown-form__checkbox-group select-checkbox__group"
						v-model="selectedMetroStations"
						@change="onMetroStationsChange"
					>
						<b-form-checkbox
							v-for="(item, index) in searchedMetroLines"
							:key="`item-${index}`"
							:value="item.value"
							@change="onSingleCheckClick(item)"
						>
							{{ item.text }}
						</b-form-checkbox>
					</b-form-checkbox-group>
				</div>

				<!-- <template v-for="(item, index) in metroLines">
					<SelectCheckbox
						:key="`line-${index}`"
						:title="item.text"
						:items="item.stations"
						:class="{
							'mb-1 active':
								metroStations.flat().length - 1 !== index,
						}"
						@on-items-update="
							onSelectCheckboxItemUpdate(
								selectedMetroStations,
								index,
								$event
							)
						"
						metro
					/>
				</template> -->
			</b-dropdown-form>
		</b-dropdown>
	</SidebarFilterItem>
</template>

<script>
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";
import SelectCheckbox from "@/components/elements/SelectCheckbox";

export default {
	name: "SidebarMetroComponent",
	components: {
		SidebarFilterItem,
		SelectCheckbox,
	},
	data: () => ({
		searchStr: "",
		isAllSelected: false,
	}),
	props: {
		metroLines: {
			type: Array,
			default: () => [],
		},
		titleDesc: {
			type: String,
			default: "",
		},
	},
	computed: {
		selectedRegion: {
			get: function() {
				return this.$store.state.selectedRegion;
			},
			set: function(newValue) {
				this.$store.state.selectedRegion = newValue;
			},
		},
		isIndeterminate() {
			if (
				this.selectedMetroStations.length > 0 &&
				this.selectedMetroStations.length < this.metroStations.length
			)
				return true;
			return false;
		},
		searchedMetroLines() {
			return this.metroLines.filter((item) => {
				return item.text
					.toLowerCase()
					.includes(this.searchStr.toLowerCase());
			});
		},
		isMetroStationsSelected() {
			if (this.selectedMetroStations.length) {
				return this.selectedMetroStations
					.map((el) => this.removeRegionFromStr(el))
					.join(", ");
			} else {
				return "Станции метро";
			}
		},

		selectedMetroStations: {
			get: function() {
				return this.$store.state.selectedMetroStations;
			},
			set: function(newValue) {
				this.$store.state.selectedMetroStations = newValue;
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

		testDistricts: {
			get: function() {
				return this.$store.state.testDistricts;
			},
			set: function(newValue) {
				this.$store.state.testDistricts = newValue;
			},
		},
		
		notSelectedMetro: {
			get: function() {
				return this.$store.state.notSelectedMetroStations;
			},
			set: function(newValue) {
				this.$store.state.notSelectedMetroStations = newValue;
			},
		},


		notSelectedMetroStations() {
			let selectedDistrictsStations = this.metroStations.filter(
				(station) =>
					this.testDistricts.some((distr) =>
						station.districts.includes(
							this.removeRegionFromStr(distr)
						)
					)
			);
			let arr = selectedDistrictsStations
				.filter(
					(station) =>
						!this.selectedMetroStations.includes(station.value)
				)
				.map((el) => el.value);
			// console.log(arr)
			return arr

			let notSelectedStations = this.metroStations.filter((el) =>
				this.testDistricts.includes((district) => {
					return el.value == district;
				})
			);

			return notSelectedStations;

			return notSelectedStations
				.filter((el) => !this.selectedMetroStations.includes(el.value))
				.map((el) => el.value);
		},

		selectedDistricts: {
			get: function() {
				return this.$store.state.selectedDistricts;
			},
			set: function(newValue) {
				this.$store.state.selectedDistricts = newValue;
			},
		},

		metroStations() {
			let arr = [];
			return this.sort(this.metroLines, "text");
		},

		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
			},
		},
	},
	methods: {
		removeRegionFromStr(str) {
			return str.replace(/ *\([^)]*\) */g, "");
		},
		onAllToggle() {
			if (this.isAllSelected) {
				this.metroStations.forEach((el) => {
					this.selectedMetroStations.push(el.value);
				});

				this.$emit("on-all-metro-toggle", true);
			} else {
				this.selectedMetroStations = [];
				this.$emit("on-all-metro-toggle", false);
			}
			this.metroStations.forEach((el) => {
				this.onSingleCheckClick(el);
			});
		},
		onSingleCheckClick(item) {
			if (this.selectedMetroStations.includes(item.value)) {
				this.$emit(
					"on-station-toggle",
					item,
					this.selectedMetroStations,
					true
				);

				// if (this.notSelectedMetroStations.includes(item.value)) {
				// 	let index = this.notSelectedMetroStations.indexOf(
				// 		item.value
				// 	);
				// 	this.notSelectedMetroStations.splice(index, 1);
				// }
			} else {
				this.$emit(
					"on-station-toggle",
					item,
					this.selectedMetroStations,
					false
				);

				// if (!this.notSelectedMetroStations.includes(item.value)) {
				// 	this.notSelectedMetroStations.push(item.value);
				// }
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
		},
		onMetroStationsChange() {
			this.$emit("on-metro-toggle", this.selectedMetroStations, false);
		},
		onSelectCheckboxItemUpdate(arr, index, item) {
			return this.$set(arr, index, item);
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
		onDistrictToggle(item, checked) {
			let districtedClean = item.replace(/ *\([^)]*\) */g, "");
			let region = item.match(/\(([^)]+)\)/)[1];

			let regionMetroLines = this.metroLines.filter(
				(el) => el.region === region
			);
			// console.log(item);

			let districtsMetroStations = regionMetroLines.filter((el) =>
				el.districts.includes(districtedClean)
			);
			districtsMetroStations.forEach((el) => {
				if (checked) {
					// if (!this.selectedMetroStations.includes(el.value)) {
					// 	this.selectedMetroStations.push(el.value);
					// }
				} else {
					if (this.selectedMetroStations.includes(el.value)) {
						let index = this.selectedMetroStations.indexOf(
							el.value
						);
						if (index > -1) {
							this.selectedMetroStations.splice(index, 1);
						}
					}
				}
			});
		},
		onRegionToggle(region, checked) {
			let arr = [];

			let clickedRegion = this.$store.state.regions.find(
				(el) => el.text === region
			);
			clickedRegion.districts.forEach((el) => {
				arr.push(el.value);
			});

			arr.forEach((el) => {
				if (checked) {
					// this.onDistrictToggle(el, true);
				} else {
					this.onDistrictToggle(el, false);
				}
			});
		},
		onRouteTypeClick(checked) {
			if (checked) {
				// this.metroStations.forEach((el) => {
				// 	this.selectedMetroStations.push(el.value);
				// });
			} else {
				this.selectedMetroStations = [];
			}
		},
	},
	watch: {
		selectedDistricts(val) {
			// console.log(val);
		},
		selectedMetroStations(val) {},

		notSelectedMetroStations(val) {
			this.notSelectedMetro = val;
			// console.log('----');
			// console.log(this.$store.state.notSelectedMetroStations);
			// console.log('----');
		},
	},
	created() {
		this.$parent.$on("on-district-toggle", this.onDistrictToggle);
		this.$parent.$on("on-region-toggle", this.onRegionToggle);
		this.$parent.$on("on-size-check-click", this.onRouteTypeClick);
		this.$parent.$on("on-rollingstock-click", this.onRouteTypeClick);
	},
	mounted() {
		// this.notSelectedMetroStations = this.metroStations.map(
		// 	(el) => el.value
		// );
	},
};
</script>

<style lang="scss">
.sidebar-metro {
	.b-dropdown-form {
		div[role="group"] {
			max-height: 200px;
			overflow: auto;
		}
	}

	.select-checkbox-wrap__toggle {
		&::after {
			display: none;
		}
		.custom-control {
			pointer-events: all;
		}
	}
}
</style>
