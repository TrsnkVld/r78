<template>
	<aside
		class="sidebar flex-grow-1 d-flex"
		:class="{
			'sidebar--small': isSidebarSmall,
			'sidebar--middle': isSidebarMiddle,
		}"
	>
		<div
			class="sidebar-inner aside-section flex-grow-1 d-flex flex-column"
			:class="{
				'px-2 pb-3': !isSidebarMiddle,
			}"
		>
			<div id="sidebar-scroll" />
			<b-container class="px-0 pt-2 d-flex flex-column flex-grow-1">
				<SidebarHeader v-if="sidebarStep !== 3" />

				<template v-if="!$store.state.isOrderExist">
					<SidebarToggle
						v-if="isSidebarSmall || isSidebarMiddle"
						@on-back-click="onStepChange"
						@on-sidebar-toggle="$emit('on-sidebar-toggle')"
					/>
				</template>

				<transition name="route" mode="out-in">
					<SidebarMain
						v-if="sidebarStep == 0"
						@on-route-tag-click="onRouteTagClick"
						@on-route-tag-hover="onRouteTagHover"
						@on-step-change="onStepChange"
					/>
					<SidebarApplication v-if="sidebarStep == 1" />
					<SidebarEmail v-if="sidebarStep == 2" />
					<SidebarPrint v-if="sidebarStep == 3" />
				</transition>
			</b-container>
		</div>
	</aside>
</template>

<script>
import SidebarHeader from "@/components/elements/sidebar/SidebarHeader";
import SidebarToggle from "@/components/elements/sidebar/SidebarToggle";
import SidebarMain from "@/components/elements/sidebar/SidebarMain";
import SidebarApplication from "@/components/elements/sidebar/SidebarApplication";
import SidebarEmail from "@/components/elements/sidebar/SidebarEmail";
import SidebarPrint from "@/components/elements/sidebar/SidebarPrint";

export default {
	name: "Sidebar",
	components: {
		SidebarHeader,
		SidebarToggle,
		SidebarMain,
		SidebarApplication,
		SidebarEmail,
		SidebarPrint,
	},
	data: () => ({}),
	computed: {
		sidebarStep: {
			get: function() {
				return this.$store.state.sidebarStep;
			},
			set: function(newValue) {
				this.$store.state.sidebarStep = newValue;
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
		isSidebarMiddle: {
			get: function() {
				return this.$store.state.isSidebarMiddle;
			},
			set: function(newValue) {
				this.$store.state.isSidebarMiddle = newValue;
			},
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
	},
	methods: {
		onRouteTagClick(item) {
			this.$emit("on-route-tag-click", item);
		},
		onRouteTagHover(item, mouseenter) {
			this.$emit("on-route-tag-hover", item, mouseenter);
		},
		onStepChange(step) {
			this.sidebarStep = step;
		},
		scrollToTop() {
			document
				.querySelector(".sidebar-inner")
				.scroll({ top: 0, left: 0, behavior: "smooth" });
		},
	},
	watch: {
		sidebarStep() {
			this.scrollToTop();
		},
		isSidebarSmall() {
			this.scrollToTop();
		},
	},

	created() {
		window.addEventListener("resize", this.scrollToTop);
	},
	destroyed() {
		window.removeEventListener("resize", this.scrollToTop);
	},
	mounted() {},
};
</script>

<style lang="scss">
h2 {
	.btn-popover {
		margin-left: 5px;
	}
}

.toggle-pop {
	border-radius: 12px;
}
.sidebar {
	height: 100%;
	width: 100%;
	//max-width: 384px;
	max-width: 1264px;
	max-width: 100%;
	background-color: #f6f6f6;
	z-index: 10;
	transition: max-width 0.7s cubic-bezier(0.5, 0.005, 0.075, 0.985);
	box-shadow: $shadow;

	&-inner {
		max-height: 100%;
		overflow: auto;

		& > .container {
			max-width: 1140px !important;
			// position: relative;
		}

		& > div {
			&:first-child {
				// height: 100%;
			}
		}

		/* Firefox */
		* {
			scrollbar-width: thin;
			scrollbar-color: #c1c1c1 #ffffff;
		}

		/* Chrome, Edge, and Safari */
		&::-webkit-scrollbar {
			width: 12px;
		}

		&::-webkit-scrollbar-track {
			background: #ffffff;
		}

		&::-webkit-scrollbar-thumb {
			background-color: #c1c1c1;
			border-radius: 10px;
			border: 3px solid #ffffff;
		}
	}

	&__toggle {
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

	&--small {
		max-width: 404px;

		.route-tag {
			cursor: pointer;
		}
	}

	&--middle {
		max-width: 595px;
	}
}
</style>
