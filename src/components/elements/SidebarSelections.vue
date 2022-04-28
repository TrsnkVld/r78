<template>
	<aside
		class="sidebar flex-grow-1 d-flex"
		:class="{ 'sidebar--small': isSidebarSmall }"
	>
		<!-- <div @click="$emit('on-selections-close')" class="selections__close">
			<svgicon name="plus" />
		</div>
		<div class="sidebar-inner d-flex flex-column flex-grow-1">
			<div class="aside-section px-2  pb-1 mb-1">
				<SidebarHeader class="mb-3" />

				<h2 class="mb-1">Подборки</h2>
				<p class="mb-5">
					Подберите маршруты, которые проходят вдоль основных
					достопримечательностей города.
				</p>

				<div class="tabs">
					<div
						v-for="(item, index) in tabs"
						:key="`tab-${index}`"
						class="tabs-item"
						:class="{ active: currentActiveTab === item }"
						@click="currentActiveTab = item"
					>
						{{ item }}
					</div>
				</div>
			</div>
			<div class="aside-section px-2 pt-3 flex-grow-1">
				<h2 class="mb-3">
					Все
					{{
						currentActiveTab === "Все"
							? "подборки"
							: currentActiveTab.toLowerCase()
					}}
				</h2>

				<b-row>
					<b-col
						cols="6"
						v-for="(item, index) in filteredSelections"
						:key="`selection-${index}`"
						class="selection mb-2"
						@click="$emit('on-selection-click', item)"
					>
						<div
							class="selection__img mb-1"
							:style="
								item.img
									? `background-image: url(${require(`../../assets/img/${item.img}`)})`
									: null
							"
						/>
						{{ item.title }}
					</b-col>
				</b-row>
			</div>
		</div> -->
	</aside>
</template>

<script>
import { debounce } from "debounce";
import SidebarHeader from "@/components/elements/sidebar/SidebarHeader";

export default {
	name: "SidebarSelections",
	components: {
		SidebarHeader,
	},
	data: () => ({
		currentActiveTab: "Все",
		tabs: ["Все", "Соборы", "Парки", "Улицы", "Вокзалы"],

		selections: [
			{
				img: "",
				title: "Казанский собор",
				type: "Соборы",
			},
			{
				img: "",
				title: "Витебский вокзал",
				type: "Вокзалы",
			},
			{
				img: "",
				title: "Невский проспект",
				type: "Улицы",
			},
			{
				img: "",
				title: "Исаакиевский собор",
				type: "Соборы",
			},
			{
				img: "",
				title: "Дворцовая площадь",
				type: "Улицы",
			},
			{
				img: "",
				title: "Мариинский театр",
				type: "Улицы",
			},
		],
	}),
	computed: {
		filteredSelections() {
			if (this.currentActiveTab === "Все") {
				return this.selections;
			}

			return this.selections.filter(
				(el) => el.type === this.currentActiveTab
			);
		},

		routes() {
			return this.$store.state.routes;
		},

		isSidebarSmall: {
			get: function() {
				return this.$store.state.isSidebarSmall;
			},
			set: function(newValue) {
				this.$store.state.isSidebarSmall = newValue;
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
	methods: {},
	mounted() {},
};
</script>

<style lang="scss">
.selection {
	cursor: pointer;

	&__img {
		background-color: $grey-light;
		background-position: center;
		background-size: cover;
		border-radius: $radius-md;

		&::before {
			padding-top: 100%;
			width: 100%;
			content: "";
			display: block;
		}
	}
}

.selections__close {
	// width: 32px;
	width: 24px;
	height: 32px;
	box-shadow: $shadow;
	display: block;
	position: absolute;
	top: 20px;
	left: calc(100% + 10px);
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 2px;
	background: #4d4d4d;
	cursor: pointer;

	svg {
		width: 12px;
		transform: rotate(45deg);

		path {
			fill: white;
		}
	}
}
</style>
