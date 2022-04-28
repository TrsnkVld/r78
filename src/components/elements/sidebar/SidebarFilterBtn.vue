<template>
	<b-button
		class="mt-3 mx-auto justify-content-center"
		@click="onClick"
		variant="light"
	>
		Сбросить фильтры
	</b-button>
</template>

<script>
export default {
	name: "SidebarFilterBtn",
	data: () => ({}),
	computed: {
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
			},
		},
		rangeSliders: {
			get: function() {
				return this.$store.state.rangeSliders;
			},
			set: function(newValue) {
				this.$store.state.rangeSliders = newValue;
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
		testDistricts: {
			get: function() {
				return this.$store.state.testDistricts;
			},
			set: function(newValue) {
				this.$store.state.testDistricts = newValue;
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
	},
	methods: {
		onClick() {
			this.$set(this.filters, "rollingStock", []);
			this.$set(this.filters, "lengthType", []);
			this.$set(this.filters, "rangeLength", this.rangeSliders.ots);
			this.$set(this.filters, "rangeGrp", this.rangeSliders.grp);

			this.selectedRegion = [];
			this.testDistricts = [];
			this.selectedMetroStations = [];
		},
	},
};
</script>
