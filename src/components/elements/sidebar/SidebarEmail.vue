<template>
	<SidebarFilterItem  class="pt-5 pb-5">
		<b-form @submit="onSubmit">
			<b-form-row class="mb-1 align-items-center">
					<b-col cols="5">
						<p class="m-0">Ваше имя</p>
					</b-col>
					<b-col cols="7">
						<input
							v-model="form.name"
							type="text"
							class="selected-item"
							required
						/>
					</b-col>
				</b-form-row>

				<b-form-row class="mb-1 align-items-center">
					<b-col cols="5">
						<p class="m-0">Ваш email</p>
					</b-col>
					<b-col cols="7">
						<input
							v-model="form.email"
							type="email"
							class="selected-item"
							required
						/>
					</b-col>
				</b-form-row>

				<b-form-row class="mb-4 align-items-center">
					<b-col cols="5">
						<p class="m-0">Ваш телефон</p>
					</b-col>
					<b-col cols="7">
						<input
							v-model="form.phone"
							type="text"
							class="selected-item"
							required
							v-mask="'+7 (###) ###-##-##'"
						/>
					</b-col>
				</b-form-row>

			<b-form-checkbox required v-model="form.check" name="formCheck">
				Я подтверждаю своё согласие на обработку моих персональных
				данных
			</b-form-checkbox>

			<div class="mt-3 d-flex">
				<b-button
					variant="primary"
					@click="sidebarStep = 0"
					class="justify-content-center mr-2"
				>
					Назад
				</b-button>
				<b-button
					type="submit"
					variant="danger"
					class="justify-content-center"
				>
					Отправить
				</b-button>
			</div>
		</b-form>
	</SidebarFilterItem>
</template>

<script>
import { mask } from "vue-the-mask";
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";

export default {
	name: "SidebarEmail",
	directives: { mask },
	components: {
		SidebarFilterItem,
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
		form: {
			get: function() {
				return this.$store.state.formEmail;
			},
			set: function(newValue) {
				this.$store.state.formEmail = newValue;
			},
		},
	},
	methods: {
		onSubmit(event) {
			event.preventDefault();
			// console.log(JSON.stringify(this.form));

			this.$store.dispatch("postToEmail");
		},
		onReset(event) {
			event.preventDefault();
			this.form.email = "";
		},
	},
};
</script>

<style lang="scss"></style>
