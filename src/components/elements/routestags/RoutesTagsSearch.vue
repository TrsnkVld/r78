<template>
	<div class="routes-tags-search routes-tags-wrap mb-2">
		<div>
			<h2>Добавленные вручную</h2>
			<ol
				class="tags"
				:key="`region-tags-${i}`"
				ref="tags"
				:class="{
					overflow: toggled,
					'cursor-disabled': !isSidebarSmall,
				}"
			>
				<li
					class="tags-wrap"
					v-if="routesMunicipal.length"
					:class="{ 'mb-0': isOverflowed && toggled }"
				>
					<!-- :to="{
						name: 'Route',
						params: { code: item.properties.title },
					}" -->
					<div
						v-for="(item, index) in routesMunicipal"
						:id="`pop-${item.id}-${id}`"
						:key="`route-${item.id}-${index}-${id}`"
						class="route-tag"
						:class="{
							'route-tag--deleted': !item.properties.isPicked,
							'route-tag--active': activeTagId === item.id,
						}"
						@click="isSidebarSmall ? onRouteTagClick(item) : null"
						@mouseenter="onRouteTagHover(item, true)"
						@mouseleave="onRouteTagHover(item, false)"
					>
						{{ item.properties.title }}
						<b-popover
							v-if="item"
							custom-class="route-tag-popup"
							:target="`pop-${item.id}-${id}`"
							triggers="hover"
							placement="top"
							boundary="none"
							delay="0"
						>
							<div
								class="route-tag-popup__inner"
								@click="onTagPopoverClick(item)"
							>
								<transition name="route" mode="out-in">
									<svgicon
										name="trash"
										v-if="item.properties.isPicked || !isSidebarSmall"
										key="remove"
									/>
									<svgicon name="plus" v-else key="add" />
								</transition>
							</div>
						</b-popover>
					</div>
				</li>
				<li class="tags-wrap" v-if="routesCommertial.length">
					<div
						v-for="(item, index) in routesCommertial"
						:key="`route-${item.id}-${index}-${id}`"
						:id="`pop-${item.id}-${id}`"
						class="route-tag"
						:class="{
							'route-tag--deleted': !item.properties.isPicked,
							'route-tag--active': activeTagId === item.id,
						}"
						@click="isSidebarSmall ? onRouteTagClick(item) : null"
						@mouseenter="onRouteTagHover(item, true)"
						@mouseleave="onRouteTagHover(item, false)"
					>
						{{ item.properties.title }}
						<b-popover
							v-if="item"
							custom-class="route-tag-popup"
							:target="`pop-${item.id}-${id}`"
							triggers="hover"
							placement="top"
							boundary="none"
							delay="0"
						>
							<div
								class="route-tag-popup__inner"
								@click="onTagPopoverClick(item)"
							>
								<transition name="route" mode="out-in">
									<svgicon
										name="trash"
										v-if="item.properties.isPicked || !isSidebarSmall"
										key="remove"
									/>
									<svgicon name="plus" v-else key="add" />
								</transition>
							</div>
						</b-popover>
					</div>
				</li>
			</ol>
		</div>
		<b-button
			v-if="isOverflowed"
			@click="onMoreClick"
			class="mt-1 mx-auto"
			variant="light"
		>
			{{ toggled ? "Все выбранные маршруты" : "Свернуть" }}
		</b-button>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
	name: "RoutesTagsSearch",
	props: {
		title: {
			type: String,
			default: "",
		},
		i: {
			type: Number,
			default: null,
		},
	},
	data: () => ({
		currentCode: "",
		isOverflowed: false,
		toggled: true,
		id: null,
	}),
	computed: {
		...mapGetters(["handPickedRoutes", "filteredRoutes", "combinedRoutes"]),

		// combinedRoutes() {
		// 	return [...this.filteredRoutes, ...this.handPickedRoutes]
		// },

		busRoutes() {
			return this.handPickedRoutes.filter(
				(el) => el.properties.type === "Автобус"
			);
		},
		minibusRoutes() {
			return this.handPickedRoutes.filter(
				(el) => el.properties.type === "Маршрутка"
			);
		},
		activeTagId: {
			get: function() {
				return this.$store.state.activeTagId;
			},
			set: function(newValue) {
				this.$store.state.activeTagId = newValue;
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
		routesAreShowing() {
			if (this.filteredRoutes.length) return true;
			return false;
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
		isFilterArraysClear() {
			if (
				this.selectedDistricts.flat(Infinity).length ||
				this.selectedMetroStations.flat(Infinity).length
			)
				return false;
			return true;
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

		currentRegionDistricts() {
			let arr = [];

			if (this.regions.length) {
				let region = this.regions.find((el) => el.text === this.title);

				region.districts.forEach((el) => {
					arr.push(el.value);
				});
			}

			return arr;
		},
		isLoaderVisible: {
			get: function() {
				return this.$store.state.isLoaderVisible;
			},
			set: function(newValue) {
				this.$store.state.isLoaderVisible = newValue;
			},
		},
		routesCommertial() {
			let arr = this.handPickedRoutes.filter((el) =>
				this.isCommertial(el.properties.title)
			);

			return this.sort(arr);
		},
		routesMunicipal() {
			let arr = this.handPickedRoutes.filter(
				(el) => !this.isCommertial(el.properties.title)
			);

			return this.sort(arr);
		},
	},
	methods: {
		...mapActions(["removeAddedElement"]),

		toLowerRemoveChars(str) {
			return parseInt(str.toLowerCase().replace(/\D/g, ""));
		},
		sort(arr) {
			return arr.sort((a, b) => {
				if (
					this.toLowerRemoveChars(a.properties.title) <
					this.toLowerRemoveChars(b.properties.title)
				) {
					return -1;
				}
				if (
					this.toLowerRemoveChars(a.properties.title) >
					this.toLowerRemoveChars(b.properties.title)
				) {
					return 1;
				}
				return 0;
			});
		},
		onTagPopoverClick(item) {
				this.removeAddedElement(item);
			// if (this.isSidebarSmall) {
			// 	if (item.properties.isPicked) {
			// 		this.$store.state.deletedRoutesIds.push(item.id);
			// 		// console.log(this.$store.state.deletedRoutesIds);
			// 	} else {
			// 		const index = this.$store.state.deletedRoutesIds.indexOf(
			// 			item.id
			// 		);
			// 		if (index > -1) {
			// 			this.$store.state.deletedRoutesIds.splice(index, 1);
			// 		}
			// 		// console.log(this.$store.state.deletedRoutesIds);
			// 	}
			// 	item.properties.isPicked = !item.properties.isPicked;
			// } else {
			// 	this.removeAddedElement(item);
			// }
		},

		isCommertial(str) {
			if (str.toLowerCase().startsWith("к")) return true;
			return false;
		},

		onResize() {
			this.toggled = true;
			setTimeout(() => {
				this.isOverflowing();
			}, 200);
		},

		onSidebarNextClick() {
			setTimeout(() => {
				this.onResize();
			}, 300);
		},

		onMoreClick() {
			this.toggled = !this.toggled;
			setTimeout(() => {
				// this.isOverflowing();
			}, 10);
		},

		isOverflowing() {
			var element = this.$refs.tags;
			this.isOverflowed =
				(element ? element.scrollHeight : null) >
				(element ? element.offsetHeight : null);
		},

		isRouteVisible(route) {
			if (this.isFilterArraysClear) {
				return true;
			} else {
				let a = this.selectedMetroStations
					.flat()
					.filter((el) => route.metroStations.includes(el));
				if (a.length > 0) return true;
				return false;
			}
		},

		onRouteTagClick(item) {
			this.activeTagId = item.id;
			this.$emit("on-route-tag-click", item);
		},

		onRouteTagHover(item, mouseenter) {
			this.activeTagId = item.id;
			this.$emit("on-route-tag-hover", item, mouseenter);
			if (!mouseenter) {
				this.activeTagId = null;
			}
		},
	},
	watch: {
		isSidebarSmall(val) {
			if (!val) this.activeTagId = null;

			setTimeout(() => {
				this.isOverflowing();
			}, 720);
		},
		filteredRoutes() {
			setTimeout(() => {
				this.isOverflowing();
			}, 100);
		},
	},
	created() {
		// this.$parent.$on("on-next-click", this.onSidebarNextClick);
		window.addEventListener("resize", this.onResize);
	},
	destroyed() {
		window.removeEventListener("resize", this.onResize);
	},
	mounted() {
		this.isOverflowing();

		this.id = this._uid;
	},
};
</script>

<style lang="scss">
.routes-tags-search {
	.route-tag {
		pointer-events: all;
	}
}
</style>
