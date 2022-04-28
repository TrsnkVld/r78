<template>
	<div class="toggle">
		<div
			class="toggle__inner d-flex align-items-center justify-content-center"
			@click="onToggle"
			v-b-popover.hover.right="{
				delay: { show: 1000, hide: 0 },
				boundary: 'none',
				customClass: 'toggle-pop',
				content: togglePopContent,
			}"
		>
			<svgicon
				name="arrow-toggle"
				:class="
					isSidebarSmall
						? sidebarStep
							? 'svg-left'
							: 'svg-right'
						: 'svg-left'
				"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: "SidebarToggle",
	data: () => ({}),
	computed: {
		togglePopContent() {
			return this.isSidebarSmall
				? this.sidebarStep
					? "Назад"
					: "Показать фильтр"
				: "Свернуть";
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
		isSidebarMiddle: {
			get: function() {
				return this.$store.state.isSidebarMiddle;
			},
			set: function(newValue) {
				this.$store.state.isSidebarMiddle = newValue;
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
	},
	methods: {
		onToggle() {
			this.$emit("on-sidebar-toggle");

			if (this.sidebarStep) {
				this.$emit("on-back-click", 0);

				if (this.isSidebarMiddle) {
					this.isSidebarMiddle = false;
					this.isSidebarSmall = !this.isSidebarSmall;
				}
			} else {
				this.isSidebarSmall = !this.isSidebarSmall;
				this.isSidebarMiddle = false;
				this.isRouteHome ? null : this.$router.push({ name: "Home" });
			}
		},
	},
};
</script>

<style lang="scss">
.toggle {
	width: 400px;
	position: absolute;
	top: 20px;
	left: calc(100% + 10px);
	z-index: 10;
	pointer-events: none;

	&__inner {
		width: 24px;
		height: 32px;
		cursor: pointer;
		box-shadow: $shadow;
		border-radius: $radius-sm;
		background: #4d4d4d;
		pointer-events: all;

		svg {
			width: 9px;
			transition: 0.4s ease;
			transition-delay: 0.6s;
		}
	}
}
</style>
