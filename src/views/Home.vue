<template>
	<main
		class="home flex-grow-1 d-flex justify-content-start align-items-start"
	>
		<transition name="route" mode="out-in">
			<SidebarSelections
				@on-selection-click="onSelectionClick"
				@on-selections-close="onSelectionClose"
				v-if="isSelectionsOpened"
				key="sidebar-selections"
			/>
			<Sidebar
				ref="sidebar"
				key="sidebar"
				@on-route-tag-click="onRouteTagClick"
				@on-route-tag-hover="onRouteTagHover"
				v-else
			/>
		</transition>

		<transition name="route" mode="out-in">
			<MapComponent
				v-if="isMapVisible"
				:padding="mapPadding"
				@on-selections-open="isSelectionsOpened = !isSelectionsOpened"
			/>
		</transition>

		<transition name="slide-left" mode="out-in">
			<router-view @on-route-close="onRouteClose()" />
		</transition>
	</main>
</template>

<script>
import Sidebar from "@/components/elements/Sidebar";
import SidebarSelections from "@/components/elements/SidebarSelections";
import MapComponent from "@/components/elements/MapComponent";

export default {
	name: "Home",
	components: {
		MapComponent,
		Sidebar,
		SidebarSelections,
	},
	data: () => ({
		mapPadding: {},
		isSelectionsOpened: false,
		isMapVisible: true,
	}),
	computed: {
		isOrderExist() {
			return this.$store.state.isOrderExist;
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
		isSidebarSmall: {
			get: function() {
				return this.$store.state.isSidebarSmall;
			},
			set: function(newValue) {
				this.$store.state.isSidebarSmall = newValue;
			},
		},
	},
	methods: {
		onSelectionClick(item) {
			this.$emit("on-selection-click", item);
		},
		onSelectionClose() {
			this.isSelectionsOpened = false;
			this.$emit("on-selection-close");
		},

		onRouteTagClick(item) {
			// console.log(item);
			this.$emit("on-route-tag-click", item);
		},

		onRouteTagHover(item, mouseenter) {
			// console.log(item);
			this.$emit("on-route-tag-hover", item, mouseenter);
		},
		onRouteClose() {
			console.log("close");
			this.$emit("on-route-close");
		},
	},
	watch: {
		// isSidebarSmall(val) {
		// 	if (val) {
		// 		this.isMapVisible = true;
		// 	} else {
		// 		// setTimeout(() => {
		// 		this.isMapVisible = false;
		// 		// }, 500);
		// 	}
		// },
		isOrderExist(newVal) {
			// colorDeleted = "#000000";
			this.isMapVisible = false;
			// this.mapObjStore.destroy();
			// this.mapShowing = false;

			setTimeout(() => {
				this.isMapVisible = true;
				// this.mapShowing = true;
				// this.mapObjStore.ready(init);
			}, 500);
		},
	},
	mounted() {
		this.mapPadding = { left: this.$refs.sidebar.$el.clientWidth };
	},
};
</script>

<style lang="scss">
main {
	height: 100%;
	height: 100vh;

	& > * {
		z-index: 2;
		position: relative;
	}
}
</style>
