<template>
	<SidebarFilterItem title="Маршрут">
		<b-form-checkbox-group class="mb-2" v-model="filters.lengthType">
			<b-form-row>
				<b-col
					cols="4"
					v-for="(item, index) in optionsSizes"
					:key="`item-${index}`"
				>
					<b-form-checkbox
						:value="item.text"
						@change="onSizeCheckChange(item.text)"
					>
						{{ item.text }}
					</b-form-checkbox>
				</b-col>
			</b-form-row>
		</b-form-checkbox-group>
	</SidebarFilterItem>
</template>

<script>
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";

export default {
	components: {
		SidebarFilterItem,
	},
	data: () => ({
		hintRouteTypes:
			"Тип маршрута (км) - тест описания тест описания тест описания тест описания тест описания тест описания",
	}),
	computed: {
		filters: {
			get: function() {
				return this.$store.state.filters;
			},
			set: function(newValue) {
				this.$store.state.filters = newValue;
			},
		},
		optionsSizes() {
			return this.$store.getters.routeLength;
		},
		selectedRegion: {
			get: function() {
				return this.$store.state.selectedRegion;
			},
			set: function(newValue) {
				this.$store.state.selectedRegion = newValue;
			},
		},
	},
	methods: {
		onSizeCheckChange(item) {
			if (this.filters.lengthType.includes(item)) {
				if (this.filters.lengthType.length === 1) {
					this.$emit("on-size-check-click", true);
				}
			} else {
				if (!this.filters.lengthType.length) {
					this.$emit("on-size-check-click", false);
				}
			}
		},
		onRollingStockCheckClick(checked) {
			if (checked) {
				this.optionsSizes.forEach((el) => {
					this.filters.lengthType.push(el.text);
				});
			} else {
				this.filters.lengthType = [];
			}
		},
	},
	created() {
		this.$parent.$on(
			"on-rollingstock-click",
			this.onRollingStockCheckClick
		);
	},
};
</script>

<style></style>
