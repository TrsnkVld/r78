<template>
	<div class="filter-item">
		<h2 v-if="title" class="mb-3">
			{{ title }}

			<b-button
				v-if="hint"
				href="#"
				variant="popover"
				v-b-popover.focus.rightbottom="{
					content: hint,
				}"
			>
				<svgicon name="tooltip" class="question" />
			</b-button>
		</h2>

		<div class="mb-3">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: "SidebarFilterItem",
	props: {
		title: {
			type: String,
			default: "",
		},
		hint: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss">
.filter-item {
	.dropdown {
		width: 100%;
	}

	h2 {
		transition: opacity $transition;
		opacity: 1;
	}

	&--disabled {
		h2 {
			opacity: 0.4;
			pointer-events: none;
		}
	}
}
</style>
