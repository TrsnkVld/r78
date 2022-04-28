<template>
	<div class="select-checkbox">
		<div class="select-checkbox-wrap" :class="{ active: isSelectOpen }">
			<div class="select-checkbox-wrap__toggle" @click="onToggleClick">
				<b-form-checkbox
					v-model="status"
					@change="onParentCheckboxClick(title)"
					:indeterminate="parentIndeterminate"
				>
					{{ title }}
				</b-form-checkbox>
			</div>

			<b-form-checkbox-group
				v-show="isSelectOpen"
				class="select-checkbox__group"
				v-model="testDistricts"
			>
				<b-form-checkbox
					v-for="(item, index) in sortedItems"
					:key="`item-${index}`"
					:value="item.value"
					@change="onSingleCheckClick(item)"
				>
					{{ item.text }}
				</b-form-checkbox>
			</b-form-checkbox-group>
		</div>
	</div>
</template>

<script>
export default {
	name: "SelectCheckbox",
	props: {
		title: {
			type: String,
			default: "",
		},
		items: {
			type: Array,
			default: () => [],
		},
		districtMetroItems: {
			type: Array,
			default: () => [],
		},
		isDistrictHasMetro: {
			type: Array,
			default: () => [],
		},
		index: {
			type: Number,
			default: 0,
		},
		metro: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		isSelectOpen: true,
		// status: false,
		selectedItems: [],
		status: false,
		dataDistrictMetroItems: [],
		indeterminate: false,
	}),
	computed: {
		allSelectedDistricts() {
			return this.sortedItems.filter((el) =>
				this.testDistricts.includes(el.value)
			);
		},
		parentIndeterminate() {
			if (
				this.allSelectedDistricts.length &&
				this.allSelectedDistricts.length < this.sortedItems.length
			)
				return true;
			return false;
		},
		sortedItems() {
			return this.sort(this.items, "text");
		},
		routes() {
			return this.$store.state.routes;
		},
		testDistricts: {
			get: function() {
				return this.$store.state.testDistricts;
			},
			set: function(newValue) {
				this.$store.state.testDistricts = newValue;
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
	},
	methods: {
		onAllToggle() {
			console.log("toggled");
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
		onParentCheckboxClick(region) {
			this.$emit("on-parent-checkbox-change", this.status, region);
		},
		onSingleCheckClick(item) {
			this.$emit("on-checkbox-change", item);
		},
		onToggleClick() {
			this.isSelectOpen = !this.isSelectOpen;
		},
	},
	watch: {
		allSelectedDistricts(val) {
			if (val.length === this.sortedItems.length) {
				this.status = true;
			}
			if (!val.length) {
				this.status = false;
			}
		},
		districtMetroItems(value) {
			value.forEach((el) => {
				this.items.forEach((item) => {
					//   console.log(item);
					if (item.district === el) {
						this.selectedItems.push(item.text);
						// console.log(item.text);
					} else {
						// console.log("!!!!!!!!!");
						// console.log(this.selectedItems);
						// this.selectedItems.map((i) => i !== item.text);
						// console.log(this.selectedItems);
						// console.log("!!!!!!!!!");
					}
				});
			});
		},
		selectedItems(val) {
			this.$emit("on-items-update", val);

			this.selectedRoutes = [];

			setTimeout(() => {
				if (val.length === this.items.length) {
					this.status = true;

					this.items.forEach((item) => {
						this.routes.forEach((route) => {
							if (
								route.district === item.district ||
								route.metroStations.includes(item)
							) {
								if (this.selectedRoutes.length) {
									let elem = this.selectedRoutes.find(
										(j) => j.id == route.id
									);

									if (elem === undefined) {
										this.selectedRoutes.push(route);
									}
								} else {
									this.selectedRoutes.push(route);
								}
							}
						});
					});
					this.indeterminate = false;
				} else {
					this.status = false;
					if (this.selectedItems.length) this.indeterminate = true;
					else this.indeterminate = false;
				}
			}, 10);
		},
	},
	created() {
		this.$parent.$on("on-all-toggle", this.onAllToggle);
	},
	mounted() {
		if (this.title === "Санкт-Петербург" && this.selectedDistricts.length) {
			this.selectedDistricts.flat(Infinity).forEach((i) => {
				this.selectedItems.push(i);
			});
		}
	},
};
</script>

<style lang="scss">
.select-checkbox {
	&-wrap {
		background: white;
		border-color: white;
		border-radius: $radius-md;
		color: inherit;
		width: 100%;
		font-size: 14px;
		line-height: 16px;

		&__toggle {
			padding: 11px 13px;
			cursor: pointer;
			position: relative;

			.custom-control {
				pointer-events: none;
				&-label::before {
					pointer-events: all;
				}
			}

			&::after {
				content: "";
				background-image: url("../../assets/icons/arrow-select.svg") !important;
				border: none;
				width: 7px;
				height: 6px;
				position: absolute;
				top: 50%;
				right: 20px;
				transform: translateY(-50%);
				transition: 0.3s ease;
			}
		}

		div[roul="group"],
		div[roul="radiogroup"] {
			padding: 11px 13px;
		}

		&:hover {
			background: white;
			color: inherit;
		}

		&.active {
			.select-checkbox-wrap__toggle {
				&::after {
					transform: translateY(-50%) rotate(180deg);
				}
			}
		}
	}

	&__group {
		border-top: 2px solid #f6f6f6;
		padding: 11px 13px !important;
		max-height: 230px;
		overflow: auto;
	}
	// &.shown {
	// 	.dropdown-toggle {
	// 		background: white !important;
	// 		border-color: white !important;
	// 		border-radius: $radius-md !important;
	// 	}
	// }
}
</style>
