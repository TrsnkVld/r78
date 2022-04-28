<template>
	<div class="route-page d-flex flex-column ml-auto h-100">
		<transition name="slide-left" mode="out-in">
			<aside
				v-if="isVisible"
				class="route-aside d-flex flex-column"
				key="aside"
			>
				<div v-if="thisRoute" class="d-flex flex-column flex-grow-1">
					<b-link
						:to="{ name: 'Home' }"
						class="route-aside__close"
						@click.native="onRouteClose"
					>
						<svgicon name="plus" />
					</b-link>
					<!-- <div
						class="route-aside__img"
						:style="
							properties.image
								? `background-image: url(${require(`../assets/img/${properties.image}`)})`
								: null
						"
					/> -->
					<div class="aside-section px-2 py-3">
						<h1 :class="routeStr ? 'mb-1' : 'mb-0'">
							{{ properties.type }} {{ properties.title }}
						</h1>
						<template v-if="routeStr">
							<p class="mb-3 d-flex align-items-center">
								<span>{{ routeStr[0] }}</span>
								<svgicon
									name="arrow-select"
									class="svg-left mx-1"
									style="width: 8px"
								/>
								<span>{{ routeStr[routeStr.length - 1] }}</span>
							</p>
							<b-button
								variant="text"
								@click="
									isFullRouteShowing = !isFullRouteShowing
								"
							>
								Улицы следования маршрута

								<svgicon
									name="arrow-select"
									:class="{ 'svg-down': isFullRouteShowing }"
								/>
							</b-button>
						</template>
						<ul v-if="isFullRouteShowing" class="list-icons mt-2">
							<li
								v-for="(item, index) in routeStr"
								:key="`route-item-${index}`"
							>
								— {{ item }}
							</li>
						</ul>
					</div>
					<div
						class="
              aside-section aside-section--options
              px-2
              pt-3
              pb-1
              flex-grow-1
            "
					>
						<div
							class="d-flex align-items-center justify-content-start mb-3"
						>
							<div
								class="
                  route-quantity
                  d-flex
                  justify-content-start
                  align-items-center
                  mr-2
                "
							>
								<b-button
									@click="removeQuantity"
									class="route-quantity__btn mr-1"
								>
									-
								</b-button>
								<input
									type="text"
									placeholder="1"
									v-model.number="quantity"
									class="
                    route-quantity__input
                    selected-item selected-item--number
                    mr-1
                  "
									@keydown="onQuantityChange($event)"
								/>
								<b-button
									class="route-quantity__btn"
									@click="addQuantity"
								>
									+
								</b-button>
							</div>

							<transition name="route" mode="out-in">
								<b-button
									v-if="properties.isPicked"
									variant="delete"
									@click="deleteRoute"
								>
									<svgicon name="bm" />
									Удалить
								</b-button>

								<b-button
									v-else
									variant="primary"
									@click="addRoute"
									class="mr-1"
								>
									<svgicon name="bookmark" />
									Добавить
								</b-button>
							</transition>

							<!-- <b-dropdown :text="`${currentCounter}`" class="mr-2">
						<b-dropdown-item
							v-for="(item, index) in counter"
							:key="`counter-${index}`"
							@click="currentCounter = item"
							:class="{ active: currentCounter === item }"
						>
							{{ item }}
						</b-dropdown-item>
					</b-dropdown> -->
						</div>

						<h2>Статистика по маршруту</h2>
						<ul class="list-icons mb-5">
							<li>
								<svgicon name="buildings" />
								Санкт-Петербург
							</li>
							<li>
								<svgicon name="map-region" />
								{{ properties.districts.join(", ") }}
							</li>
							<li v-if="properties.metro.length">
								<svgicon name="map-marker" />
								{{ properties.metro.join(", ") }}
							</li>
							<li>
								<svgicon name="road-marker" />
								{{ properties.pathLength }} км длина маршрута
							</li>
							<li>
								<svgicon name="bus" />
								{{ properties.quantity }} из 1 т/с на маршруте
							</li>
							<li>
								<svgicon name="road" />
								{{ totalLength }} км общая протяженность
							</li>
							<li>
								<svgicon name="star" />
								{{ properties.grp }} показатель GRP
							</li>
							<li>
								<svgicon name="star" />
								{{ properties.ots }} показатель OTS
							</li>
						</ul>
						<!-- <div class="tabs">
					<div
						v-for="(item, index) in tabs"
						:key="`tab-${index}`"
						class="tabs-item"
						:class="{ active: currentActiveTab === index }"
						@click="currentActiveTab = index"
					>
						{{ item }}
					</div>
				</div> -->
					</div>

					<!-- <transition name="slide-up" mode="out-in">
				<div
					v-if="currentActiveTab === 0"
					class="aside-section flex-grow-1 px-2 py-3"
					key="first-tab"
				>
					<h2 class="mb-3">Размещение рекламы</h2>

					<b-form-checkbox-group
						v-model="selectedCheckboxes"
						:options="checkboxes"
					/>
				</div>
				<div
					v-else
					class="aside-section flex-grow-1 px-2 py-3"
					key="second-tab"
				>
					<h2 class="mb-3">Статистика рекламы</h2>

					<b-form-checkbox-group
						v-model="selectedCheckboxes2"
						:options="checkboxes2"
					/>
				</div>
			</transition> -->
				</div>
			</aside>
		</transition>
	</div>
</template>

<script>
import { debounce } from "debounce";

export default {
	name: "Route",
	components: {},
	data: () => ({
		interval: false,
		text: "text",
		count: 1,
		currentCounter: 1,
		isFullRouteShowing: false,
		quantity: 1,
		isVisible: true,
		// selectedCheckboxes: [],
		// checkboxes: [
		// 	{ text: "Бортовое размещение", value: "Бортовое размещение" },
		// 	{
		// 		text: "Оформление заднего борта",
		// 		value: "Оформление заднего борта",
		// 	},
		// ],
		// selectedCheckboxes2: [],
		// checkboxes2: [
		// 	{ text: "Бортовое размещение", value: "qweqew" },
		// 	{ text: "Бортовое размещение", value: "qwr1wfa" },
		// 	{ text: "Бортовое размещение", value: "asd2assca" },
		// 	{ text: "Бортовое размещение", value: "asd3" },
		// 	{ text: "Бортовое размещение", value: "zxc4" },
		// 	{ text: "Бортовое размещение", value: "qweq5" },
		// ],
		// currentActiveTab: 0,
		// tabs: ["Размещение", "Статистика"],
	}),
	computed: {
		counter() {
			let arr = [];
			let amount = 10;
			for (let i = 1; i < amount + 1; i++) {
				arr.push(i.toString());
			}
			return arr;
		},

		isSidebarSmall: {
			get: function() {
				return this.$store.state.isSidebarSmall;
			},
			set: function(newValue) {
				this.$store.state.isSidebarSmall = newValue;
			},
		},

		allRoutes: {
			get: function() {
				return this.$store.state.allRoutes;
			},
			set: function(newValue) {
				this.$store.state.allRoutes = newValue;
			},
		},

		properties() {
			if (!this.thisRoute) return false;

			return this.thisRoute.properties;
		},

		thisRoute() {
			if (!this.allRoutes || this.allRoutes.length === 0) return false;

			let a = this.allRoutes.find((el) => {
				if (el.properties.title === this.$route.params.code) {
					return el;
				} else {
					return null;
				}
			});
			if (a) return a;
			return null;
		},

		totalLength() {
			if (this.properties.count)
				return this.properties.count * this.properties.pathLength;

			return this.properties.pathLength;
		},

		routeStr() {
			if (!this.properties || !this.properties.routeStr) return false;

			let arr = [];

			this.properties.routeStr.split("-").forEach((el) => {
				arr.push(el.trim());
			});

			return arr;
		},

		selectedRoutes: {
			get: function() {
				return this.$store.state.selectedRoutes;
			},
			set: function(newValue) {
				this.$store.state.selectedRoutes = newValue;
			},
		},

		mapObjStore: {
			get: function() {
				return this.$store.state.mapObjStore;
			},
			set: function(newValue) {
				this.$store.state.mapObjStore = newValue;
			},
		},
	},

	methods: {
		removeQuantity() {
			if (this.quantity !== 0) {
				this.quantity--;
				this.properties.quantity = this.quantity;
			}
			if (this.quantity == 0) {
				this.deleteRoute();
			}
		},
		addQuantity() {
			this.quantity++;
			this.properties.quantity = this.quantity;

			if (this.quantity == 1) {
				this.addRoute();
			}
		},

		deleteRoute() {
			// this.quantity = this.properties.quantity = 0;
			this.thisRoute.properties.isPicked = false;
		},
		addRoute() {
			if (this.quantity == 0) this.quantity++;
			this.properties.quantity = this.quantity;
			this.thisRoute.properties.isPicked = true;

			// if (this.properties.quantity > 0) {
			// 	this.thisRoute.properties.isPicked = true;
			// } else {
			// 	this.thisRoute.properties.isPicked = false;
			// }
		},
		onRouteToggle(bool, text) {
			// console.log(thisItem);
			this.thisRoute.properties.isPicked = bool;

			this.$router.push({ name: "Home" });

			if (text === "remove") {
				thisItem.isNotRemove = false;

				// console.log(this.mapObjStore);

				// this.mapObjStore.geoObjects.get(0).each((el) => {
				// console.log(this.mapObjStore);
				// });
			}

			// console.log(thisItem);
			// else if (this.routes.filter((el) => el.id == thisItem.id)) {
			// 	let i = this.routes.filter((el) => el.id == thisItem.id);
			// 	console.log(i[0])
			// 	this.routes.push(i[0]);
			// 	console.log(this.routes)
			// 	console.log(this.selectedRoutes)
			// }

			// console.log(item.properties.name)
			// let currentCar = this.routes.find((i) => i.properties.name === item.properties.name)
		},

		isNumber(evt) {
			evt = evt ? evt : window.event;
			var charCode = evt.which ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				evt.preventDefault();
			} else {
				return true;
			}
		},

		onQuantityChange: debounce(function(evt) {
			let val = evt.target.value;

			evt = evt ? evt : window.event;
			var charCode = evt.which ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				evt.preventDefault();
			} else {
				if (val < 0 || val == "") return (this.quantity = 1);
				if (val > this.properties.count) {
					return (this.quantity = this.properties.count);
				}
				this.properties.quantity = this.quantity;
				// console.log("test");
				return true;
			}
		}, 350),
		onRouteClose() {
			this.$emit("on-route-close");
		},
	},
	watch: {
		properties(val) {
			// this.quantity = this.properties.quantity;
		},
		$route(to, from) {},
	},
	beforeRouteUpdate(to, from, next) {
		this.isVisible = false;
		setTimeout(() => {
			next();
			this.quantity = this.properties.quantity;
			this.isVisible = true;
		}, 300);
	},

	created() {
		if (!this.thisRoute) this.$router.push({ name: "Home" });
	},
	mounted() {
		this.isSidebarSmall = true;
	},
};
</script>

<style lang="scss">
.route {
	&-page {
		.btn {
			min-width: auto;
		}
	}

	&-quantity {
		&__btn {
			width: 40px;
			height: 40px;
			display: flex;
			justify-content: center;
			align-items: center;

			text-align: center;
			background: #f6f6f6;
			border: 1px solid #eaeaea;
			color: black;
		}
	}

	&-aside {
		position: relative;
		top: 0;
		right: 0;
		width: 404px;
		flex-shrink: 0;
		height: 100%;
		box-shadow: $shadow;
		background-color: $grey-light;
		margin-left: auto;

		& > div {
			overflow: auto;
		}

		&__close {
			// width: 32px;
			width: 24px;
			height: 32px;
			box-shadow: $shadow;
			display: block;
			position: absolute;
			top: 20px;
			right: calc(100% + 10px);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 2px;
			background: #4d4d4d;

			svg {
				width: 12px;
				transform: rotate(45deg);

				path {
					fill: white;
				}
			}
		}

		&__img {
			background-color: $grey-light;
			height: 212px;
			background-position: center;
			background-size: cover;
			flex-shrink: 0;
		}

		.aside-section {
			.dropdown {
				width: auto;
			}
		}
	}
}
</style>
