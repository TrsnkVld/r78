<template>
	<div
		class="preloader d-flex flex-grow-1 justify-content-center align-items-center flex-column"
	>
		<svgicon name="logo" class="preloader__logo mb-4" />
		<b-form v-if="isItPasswordPage" @submit="onSubmit">
			<input
				v-model="password"
				type="text"
				placeholder="Введите пароль"
				autocomplete="off"
				class="form-control mb-2"
				required
				style="width:200px;text-align:center"
			/>
			<b-btn
				variant="primary"
				type="submit"
				class="justify-content-center"
				style="width:200px;"
			>
				Войти
			</b-btn>
		</b-form>

		<template v-else>
			<svgicon name="loader" class="preloader__ring mb-2" />
			<h2 class="preloader__text m-0">
				{{ text }}
			</h2>
		</template>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Preloader",
	data: () => ({
		text: "Загружаем маршруты",
		password: "",
	}),
	computed: {
		...mapGetters(["managerPass"]),

		isItPasswordPage() {
			if (this.$route.query.page && this.$route.query.page == "psswrd")
				return true;
			return false;
		},
	},
	methods: {
		onSubmit(e) {
			e.preventDefault();

			if (this.password === this.managerPass) {
				localStorage.setItem("psswrd", this.password);

				this.$router.push("/");
				return (this.$store.state.modalMessage = "Успешно!");
			}

			this.$store.state.modalMessage = "Неверный пароль";
		},
	},
	mounted() {
		if (localStorage.getItem("psswrd")) {
			this.password = localStorage.getItem("psswrd");
		}
	},
};
</script>

<style lang="scss">
.preloader {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	background: white;

	&__logo {
		width: 86px;
	}

	&__ring {
		width: 60px;
	}
}
</style>
