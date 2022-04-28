<template>
	<SidebarFilterItem title="Автобус" >
		<b-form-checkbox-group class="mb-2" v-model="filters.rollingStock">
			<b-form-row>
				<b-col
					cols="4"
					v-for="(item, index) in optionsRollingStock"
					:key="`item-${index}`"
				>
					<b-form-checkbox
						:value="item.text"
						@change="onRollingStockChange(item.text)"
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
	name: "SidebarRollingStock",
	components: {
		SidebarFilterItem,
	},
	data: () => ({
		hintRollingStock:
			"Тип подвижного состава - тест описания тест описания тест описания тест описания тест описания тест описания",
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
		optionsRollingStock() {
			return this.$store.getters.routeSizes;
		},
	},
	methods: {
		onRollingStockChange(item) {
			if (this.filters.rollingStock.includes(item)) {
				if (this.filters.rollingStock.length === 1) {
					this.$emit("on-rollingstock-check-click", true);
				}
			} else {
				if (!this.filters.rollingStock.length) {
					this.$emit("on-rollingstock-check-click", false);
				}
			}
		},

		onSizeCheckClick(checked) {
			if (checked) {
				this.optionsRollingStock.forEach((el) => {
					this.filters.rollingStock.push(el.text);
				});
			} else {
				this.filters.rollingStock = [];
			}
		},
	},
	created() {
		this.$parent.$on("on-size-check-click", this.onSizeCheckClick);
	},
};
</script>
