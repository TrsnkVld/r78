<template>
	<div class="filter pl-8 pr-6">
		<SidebarRegionsComponent @on-region-change="onRegionChange" />

		<SidebarDistrictComponent
			:selectedRegion="selectedRegion"
			:titleDesc="hintDistricts"
			@on-district-toggle="onDistrictToggle"
			@on-region-toggle="onRegionToggle"
			@on-districts-region-toggle="onDistrictsRegionToggle"
		/>

		<SidebarMetroComponent
			:metroLines="metroLines"
			:titleDesc="hintMetroStations"
			@on-metro-toggle="onMetroToggle"
			@on-all-metro-toggle="onAllMetroToggle"
			@on-station-toggle="onMetroStationToggle"
		/>

		<SidebarSizes
			key="route-type"
			@on-size-check-click="onSizeCheckClick"
		/>

		<SidebarRollingStock
			key="route-size"
			@on-rollingstock-check-click="onRollingstockCheckClick"
		/>

		<SidebarFilterItem
			title="GRP"
			:hint="hintGrp"
			key="grp"
			v-if="filterGrp.length"
		>
			<div class="range">
				<vue-slider
					class="range__slider mb-1"
					:tooltip="'none'"
					v-model="filterGrp"
					:contained="true"
					:enable-cross="false"
					:min="min2"
					:max="max2"
				/>
				<div
					class="range__text d-flex justify-content-between align-items-center"
				>
					<input
						v-model="sliderInputGrpMin"
						type="text"
						:size="
							filterGrp[0].toString().length
								? filterGrp[0].toString().length
								: 1
						"
						@keydown="
							onInputGrpMinChange($event, sliderInputGrpMin)
						"
					/>
					<input
						v-model="sliderInputGrpMax"
						type="text"
						:size="
							filterGrp[1].toString().length
								? filterGrp[1].toString().length
								: 1
						"
						@keydown="
							onInputGrpMaxChange($event, sliderInputGrpMax)
						"
					/>
				</div>
			</div>
		</SidebarFilterItem>

		<SidebarFilterItem
			title="OTS"
			:hint="hintOts"
			key="ots"
			v-if="filterLength.length"
		>
			<div class="range">
				<vue-slider
					class="range__slider mb-1"
					:tooltip="'none'"
					v-model="filterLength"
					:contained="true"
					:enable-cross="false"
					:min="min1"
					:max="max1"
				/>
				<div
					class="range__text d-flex justify-content-between align-items-center"
				>
					<input
						v-model="sliderInputMin"
						type="text"
						:size="
							filterLength[0].toString().length
								? filterLength[0].toString().length
								: 1
						"
						@keydown="onInputMinChange($event, sliderInputMin)"
					/>
					<input
						v-model="sliderInputMax"
						type="text"
						:size="
							filterLength[1].toString().length
								? filterLength[1].toString().length
								: 1
						"
						@keydown="onInputMaxChange($event, sliderInputMax)"
					/>
				</div>
			</div>
		</SidebarFilterItem>

		<SidebarFilterItem>
			<RouteSearch />
		</SidebarFilterItem>

		<div>
			<SidebarFilterBtn key="filter-btn" />
		</div>
	</div>
</template>

<script>
import { debounce } from "debounce";
import { mapActions, mapMutations, mapGetters } from "vuex";
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";
import SidebarDistrictComponent from "@/components/elements/sidebar/SidebarDistrictComponent";
import SidebarRegionsComponent from "@/components/elements/sidebar/SidebarRegionsComponent";
import SidebarFilterBtn from "@/components/elements/sidebar/SidebarFilterBtn";
import SidebarMetroComponent from "@/components/elements/sidebar/SidebarMetroComponent";
import SidebarRollingStock from "@/components/elements/sidebar/SidebarRollingStock";
import SidebarSizes from "@/components/elements/sidebar/SidebarSizes";
import RouteSearch from "@/components/elements/RouteSearch";

export default {
	name: "SidebarFilters",
	components: {
		SidebarFilterItem,
		SidebarDistrictComponent,
		SidebarRegionsComponent,
		SidebarFilterBtn,
		SidebarMetroComponent,
		SidebarRollingStock,
		SidebarSizes,
		RouteSearch,
	},
	data: () => ({
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

		min1: 0,
		max1: 150000,
		sliderInputMin: 0,
		sliderInputMax: 150000,

		min2: 0,
		max2: 5,
		sliderInputGrpMin: 0,
		sliderInputGrpMax: 5,

		routesRegionType: [],
	}),
	computed: {
		...mapGetters(["isSidebarSmall"]),

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

		formEmail: {
			get: function() {
				return this.$store.state.formEmail;
			},
			set: function(newValue) {
				this.$store.state.formEmail = newValue;
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
		selectedRegion: {
			get: function() {
				return this.$store.state.selectedRegion;
			},
			set: function(newValue) {
				this.$store.state.selectedRegion = newValue;
			},
		},
		metroLines: {
			get() {
				return this.$store.state.metroLines;
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
		routes() {
			return this.$store.state.routes;
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
		rangeSliders: {
			get: function() {
				return this.$store.state.rangeSliders;
			},
			set: function(newValue) {
				this.$store.state.rangeSliders = newValue;
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
	},
	methods: {
		...mapActions(["setHandPickedRoutes", "updateDeletedRoutes"]),
		...mapMutations(["SET_DELETED_ROUTES"]),

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

		setRegionType(val) {
			this.routesRegionType = [];
			if (val.includes("Санкт-Петербург")) {
				this.routesRegionType.push("городские");
			}
			if (val.includes("Ленобласть")) {
				this.routesRegionType.push("областные");
			}
		},

		onRegionToggle(region, checked) {
			this.$emit("on-region-toggle", region, checked);
		},
		onRegionChange(item, checked) {
			this.$emit("on-region-change", item, checked);
		},
		onDistrictToggle(item, checked) {
			this.$emit("on-district-toggle", item, checked);
		},
		onDistrictsRegionToggle(region, checked) {
			this.$emit("on-districts-region-toggle", region, checked);
		},
		onMetroToggle(arr, checked) {
			this.$emit("on-metro-toggle", arr, checked);
		},
		onAllMetroToggle(checked) {
			this.$emit("on-all-metro-toggle", checked);
		},
		onMetroStationToggle(item, arr, checked) {
			this.$emit("on-station-toggle", item, arr, checked);
		},
		onSizeCheckClick(checked) {
			this.$emit("on-size-check-click", checked);
		},
		onRollingstockCheckClick(checked) {
			this.$emit("on-rollingstock-click", checked);
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

		// stats: {
		// 	deep: true,
		// 	handler() {
		// 		this.formEmail.stats.region = this.statsRegions;
		// 		this.formEmail.stats.metro = this.statsMetro;
		// 		this.formEmail.stats.routes = this.statsRoutes;
		// 		this.formEmail.stats.vehicles = this.statsVehicles;
		// 		this.formEmail.stats.grp = this.statsGrp;
		// 		this.formEmail.stats.ots = this.statsOts;
		// 	},
		// },

		statsRegions(val) {
			this.formEmail.stats.region = val;
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
	},

	mounted() {
		if (!this.selectedRegion.length) {
			this.filters.rollingStock = [];
			this.filters.lengthType = [];
		}

		this.min1 = this.minMaxOts[0];
		this.max1 = this.minMaxOts[1];

		if (!this.filterLength.length) {
			this.$set(this.filters, "rangeLength", this.minMaxOts);
			this.sliderInputMin = this.minMaxOts[0];
			this.sliderInputMax = this.minMaxOts[1];
		} else {
			this.sliderInputMin = this.filterLength[0];
			this.sliderInputMax = this.filterLength[1];
		}

		this.min2 = this.minMaxGrp[0];
		this.max2 = this.minMaxGrp[1];

		if (!this.filterGrp.length) {
			this.$set(this.filters, "rangeGrp", this.minMaxGrp);
			this.sliderInputGrpMin = this.minMaxGrp[0];
			this.sliderInputGrpMax = this.minMaxGrp[1];
		} else {
			this.sliderInputGrpMin = this.filterGrp[0];
			this.sliderInputGrpMax = this.filterGrp[1];
		}

		this.rangeSliders.grp = this.minMaxGrp;
		this.rangeSliders.ots = this.minMaxOts;

		this.setRegionType(this.selectedRegion);
		this.currentRegionsDistricts = this.selectedRegionsDistricts;

		if (this.$store.state.savedGrpRange.length) {
			this.filterGrp = this.$store.state.savedGrpRange;
		}

		if (this.$store.state.savedLengthRange.length) {
			this.filterLength = this.$store.state.savedLengthRange;
		}
	},
};
</script>

<style lang="scss">
.filter {
	width: 470px;
	box-sizing: content-box;
	opacity: 1;
	transition: 3s ease;
	flex-shrink: 0;
	// overflow: auto;
	box-sizing: border-box;
	padding-top: 8px;
	position: relative;
	z-index: 8;

	.custom-checkbox .custom-control-label,
	.custom-radio .custom-control-label {
		line-height: 20px;
	}

	& > * {
		width: 310px;
	}

	.btn-text {
		color: $grey-dark;
	}

	.dropdown-toggle {
		width: 100%;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&-leave-active {
		transition: width 0.4s cubic-bezier(0.5, 0.005, 0.075, 0.985),
			padding 0.4s cubic-bezier(0.5, 0.005, 0.075, 0.985),
			opacity 0.2s ease, transform 0.2s ease;
	}

	&-enter-active {
		transition: width 0.4s cubic-bezier(0.5, 0.005, 0.075, 0.985),
			padding 0.4s cubic-bezier(0.5, 0.005, 0.075, 0.985),
			opacity 0.2s ease 0.2s, transform 0.2s ease 0.2s;
	}

	&-enter,
	&-leave-to {
		width: 0px;
		padding: 0px !important;
		// padding-right: 0px !important;
		opacity: 0;
		transform: scale(0.9);
	}
}
</style>
