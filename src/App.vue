<template>
	<div id="app" class="flex-grow-1">
		<transition name="route" mode="out-in">
			<router-view v-if="routes.length" />
		</transition>

		<transition name="route" mode="out-in">
			<Preloader v-if="isItPasswordPage || isLoaderVisible" />
		</transition>
		<!-- <PdfComponent /> -->

		<b-modal v-model="isModalShowing" hide-footer>
			<div class="d-block text-center py-4">
				<h5>
					{{ modalMessage }}
				</h5>
			</div>
		</b-modal>
	</div>
</template>

<script>
import PdfComponent from "@/components/elements/pdf/PdfComponent";
import Preloader from "@/components/elements/Preloader";
import { mapGetters } from "vuex";

export default {
	components: {
		PdfComponent,
		Preloader,
	},
	data: () => ({
		isModalShowing: false,
		test: [],
		axiosConfig: {
			headers: {
				"Content-Type": "application/json",
			},
		},
	}),
	computed: {
		...mapGetters(["handPickedRoutes", "managerPass"]),

		isItPasswordPage() {
			if (this.$route.query.page && this.$route.query.page == "psswrd")
				return true;
			return false;
		},

		modalMessage: {
			get: function() {
				return this.$store.state.modalMessage;
			},
			set: function(newValue) {
				this.$store.state.modalMessage = newValue;
			},
		},
		isLoaderVisible: {
			get: function() {
				return this.$store.state.isLoaderVisible;
			},
			set: function(newValue) {
				this.$store.state.isLoaderVisible = newValue;
			},
		},
		routes: {
			get: function() {
				return this.$store.state.routes;
			},
			set: function(newValue) {
				this.$store.state.routes = newValue;
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
		filteredRoutes: {
			get: function() {
				return this.$store.state.filteredRoutes;
			},
			set: function(newValue) {
				this.$store.state.filteredRoutes = newValue;
			},
		},
	},
	watch: {
		modalMessage(val) {
			if (val) {
				this.isModalShowing = true;

				setTimeout(() => {
					this.modalMessage = "";
				}, 3000);
			} else {
				this.isModalShowing = false;
			}
		},
	},
	created() {
		this.axios
			.get("routes/", this.axiosConfig)
			.then(({ data }) => {
				let routes = data.features;
				routes.forEach((el) => {
					// if (
					// 	el.properties.title=="167"
					// ) {
					// 	console.log(el);
					// }

					el.properties.pathLength =
						Math.round(el.properties.pathLength * 100) / 100;

					let lengthType = "";

					if (el.properties.pathLength < 5) lengthType = "Короткий";
					else if (el.properties.pathLength > 10)
						lengthType = "Длинный";
					else lengthType = "Средний";

					el.properties.lengthType = lengthType;
					el.properties.isPicked = true;
				});

				this.routes = this.allRoutes = Array.from(
					new Set(routes.map((a) => a.id))
				).map((id) => {
					return routes.find((a) => a.id === id);
				});

				this.isLoaderVisible = false;
			})
			.catch((error) => {
				console.log(error.response);
			});

		this.axios.get("metro/", this.axiosConfig).then(({ data }) => {
			for (let i = 0; i < data.length; i++) {
				this.$store.state.metroLines.push({
					id: data[i].id,
					text: data[i].title,
					value: data[i].value,
					districts: data[i].districts,
					// lineMetro: parseInt(data[i].lineMetro, 10),
					region: data[i].value.match(/\(([^)]+)\)/)[1],
				});
			}

			// this.sort(this.$store.state.metroLines, "text");
		});

		this.axios.get("regions/", this.axiosConfig).then(({ data }) => {
			this.$store.state.regions = [];

			for (let i = 0; i < data.length; i++) {
				let obj = {
					id: data[i].id,
					text: data[i].title,
					value: data[i].title,
					districts: [],
				};

				let districts = data[i].districts;
				// if (data[i].title == "Ленобласть") {
				// 	console.log(data[i]);
				// }

				districts.forEach((el) => {
					obj.districts.push({
						id: el.id,
						text: el.title,
						value: `${el.title} (${data[i].title})`,
					});
				});
				this.$store.state.regions.push(obj);
			}
			// console.log(this.$store.state.regions);

			// console.log(this.$store.state.regions);

			// this.$store.state.regions.forEach((el) => {
			// 	this.$store.state.selectedRegion.push(el.text);
			// });

			// this.sort(this.$store.state.metroLines, "text");
		});
	},
	mounted() {
		if (
			localStorage.getItem("psswrd") &&
			localStorage.getItem("psswrd") === this.managerPass
		) {
			this.$store.state.isManagerLink = true;
		}
	},
};
</script>

<style lang="scss">
#app {
	min-height: 100%;
	display: flex;
	flex-flow: column;
}
</style>
