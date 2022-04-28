<template>
	<div class="route-search" v-click-outside="onClickOutside">
		<b-form-group>
			<b-form-input
				placeholder="Поиск"
				v-model="str"
				autocomplete="off"
				@focus="isResultsShowing = true"
				@keypress="isResultsShowing = true"
				@click="isResultsShowing = true"
			/>
			<!-- @blur="isResultsShowing = false" -->
		</b-form-group>
		<div class="route-search__result" v-if="str.length && isResultsShowing">
			<ul>
				<template v-if="foundItems.length">
					<li
						v-for="(item, index) in foundItems"
						:key="index"
						@click="onItemClick(item)"
						:class="{ added: checkItemAlreadyAdded(item) }"
					>
						{{ item.properties.title }}
					</li>
				</template>
				<li v-else>
					Не найдено
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ClickOutside from "vue-click-outside";

export default {
	data: () => ({
		str: "",
		isResultsShowing: false,
		picked: [],
	}),
	directives: {
		ClickOutside,
	},
	computed: {
		...mapGetters([
			"routes",
			"handPickedRoutes",
			"filteredRoutes",
			"selectedRegion",
			"combinedRoutes",
		]),

		foundItems() {
			return this.routes.filter((route) =>
				route.properties.title
					.toLowerCase()
					.includes(this.str.toLowerCase())
			);
		},
	},
	methods: {
		...mapActions(["pushHandPickedRoute", "removeAddedElement"]),

		onClickOutside() {
			if (this.isResultsShowing) this.isResultsShowing = false;
		},

		checkItemAlreadyAdded(item) {
			if (this.combinedRoutes.includes(item)) return true;
			return false;
		},

		onItemClick(item) {
			// if (!this.picked.includes(item)) {
			// 	// item.properties.isHandPicked = true;
			// 	this.picked.push(item);
			// }
			if (!this.handPickedRoutes.includes(item)) {
				// item.properties.isHandPicked = true;
				this.pushHandPickedRoute(item);
			} else {
				this.removeAddedElement(item);
			}
		},
	},
	watch: {
		picked(val) {
			// this.pushHandPickedRoute(val);
		},
	},
	mounted() {
		if (this.handPickedRoutes.length) this.picked = this.handPickedRoutes;
	},
};
</script>

<style lang="scss">
.route-search {
	position: relative;

	.form-control {
		border-radius: 8px;
	}

	&__result {
		position: absolute;
		bottom: calc(100% + 10px);
		max-height: 50vh;
		overflow: hidden;
		width: 100%;
		padding: 0;
		background: white;
		z-index: 7;
		border: 1px solid #0075a8;
		border-radius: 8px;

		ul {
			overflow: auto;
			max-height: 50vh;
			padding: 10px 0;
			list-style: none;
			margin: 0;

			color: #666666;
			font-size: 14px;
			line-height: 30px;

			li {
				padding: 0 16px;
				// margin-bottom: 10px;
				cursor: pointer;

				&:hover {
					background: #f6f6f6;
					color: black;
				}

				&:last-of-type {
					margin-bottom: 0;
				}

				&.added {
					// pointer-events: none;
					font-weight: bold;
					color: black;

					&::after {
						content: "(уже добавлен)";
					}
				}
			}
		}
	}
}
</style>
