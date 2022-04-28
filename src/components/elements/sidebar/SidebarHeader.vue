<template>
	<div
		class="sidebar-header px-2 mt-2"
		:style="isSidebarSmall ? 'z-index: 10' : ''"
	>
		<b-container class="px-0">
			<Logo class="ml-auto" />
		</b-container>
	</div>
</template>

<script>
import Logo from "@/components/elements/Logo";

export default {
	name: "SidebarHeader",
	components: {
		Logo,
	},
	computed: {
		isSidebarSmall: {
			get() {
				return this.$store.state.isSidebarSmall;
			},
		},
	},
};
</script>

<style lang="scss">
.sidebar-header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;
	pointer-events: none;
	z-index: 7;

	&::before {
		content: "";
		display: block;
		background: white;
		position: absolute;
		top: -20px;
		left: 0;
		width: 100%;
		height: 64px;
		opacity: 0.95;
		z-index: -1;
	}

	.container {
		max-width: 1140px !important;
	}

	// background: grey;
}
</style>
