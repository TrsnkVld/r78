<template>
	<div>
		<vue-html2pdf
			:show-layout="false"
			:float-layout="true"
			:enable-download="false"
			:preview-modal="true"
			:paginate-elements-by-height="1400"
			:filename="name"
			:pdf-quality="2"
			:manual-pagination="false"
			pdf-format="a4"
			pdf-orientation="portrait"
			pdf-content-width="100%"
			ref="html2Pdf"
		>
			<section slot="pdf-content" class="pdf-content">
				<div class="pdf-map">
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
				</div>
				<div class="d-flex justify-content-start mb-4 align-items-center">
					<svg
						width="86"
						height="32"
						viewBox="0 0 40 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M23.9999 2.51264V1.78283C23.9999 0.81391 23.2145 0.0284424 22.2455 0.0284424H19.7524H9.31591C9.50104 0.0284424 8.14027 2.24246 10.8106 2.85802H19.9999L10.8106 15H15.1363L23.3732 4.34776C23.7795 3.8223 23.9999 3.17686 23.9999 2.51264Z"
							fill="#E30925"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M31.5049 6.0687H31.6262L34.2395 6.05496C35.5602 6.03664 35.7562 4.97863 35.7516 4.39695C35.7516 3.88397 35.4388 2.86718 34.1835 2.85802H31.8222H31.5096H31.1969H28.8356C27.5803 2.86718 27.2677 3.88397 27.2677 4.39695C27.2677 4.97863 27.459 6.03664 28.7796 6.05496L31.3929 6.0687H31.5049ZM31.5049 12.1374L34.7622 12.1237C36.3395 12.1053 36.5681 11.0473 36.5635 10.4656C36.5635 9.95267 36.1948 8.93588 34.6922 8.92672H31.8736H31.8129H31.5002H31.1876H31.1269H28.3083C26.8103 8.93588 26.4417 9.95267 26.437 10.4656C26.437 11.0473 26.6657 12.1053 28.2383 12.1237L31.5049 12.1374ZM31.5049 0H31.8269H34.1275C38.5748 0.0183206 39.6527 4.58931 37.8888 6.87023C39.5407 7.90992 40.0354 9.65038 39.9981 10.7634C39.9327 12.6137 38.5561 14.8901 35.5042 15H31.8876H31.5002H31.1129H27.4963C24.4444 14.8901 23.0724 12.6137 23.0024 10.7634C22.9604 9.65038 23.4551 7.90992 25.1117 6.87023C23.3478 4.58931 24.4304 0.0183206 28.873 0H31.1736H31.5049Z"
							fill="#E30925"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M0 0.0291581H9.01412C9.17298 0.025228 9.33183 0.0374904 9.48831 0.0657641C13.0671 0.71552 14.0558 3.9826 13.9976 5.83578C13.926 8.03213 12.2529 10.169 9.60015 10.9789C9.36383 11.0585 9.1148 11.0911 8.86649 11.075H3.47144V15.0284H0V11.0613L3.47144 8.00001H8.5C10.9492 7.99409 10.9492 2.85802 8.5 2.85802H0V0.0291581Z"
							fill="#0075A8"
						/>
					</svg>

					<h1 class="pdf-title m-0 ml-2">{{ name }}</h1>
				</div>
				<div class="d-flex flex-column" style="position: relative;">
					<MapComponent />
				</div>
				<div class="d-flex flex-column" style="position: relative;">
					<h2>Статистика</h2>

					<h1>asdasd</h1>
					<h1>asdasd</h1>
					<h1>asdasd</h1>
					<h1>asdasd</h1>
				</div>
			</section>
		</vue-html2pdf>
		<b-button class="asd" @click="generateReport">generateReport</b-button>
	</div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import MapComponent from "@/components/elements/MapComponent";

export default {
	data: () => ({
		name: "Предварительный расчёт № 1",
	}),
	methods: {
		/*
            Generate Report using refs and calling the
            refs function generatePdf()
        */
		generateReport() {
			this.$refs.html2Pdf.generatePdf();
		},
	},

	components: {
		VueHtml2pdf,
		MapComponent,
	},
};
</script>

<style lang="scss" scoped>
.asd {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 100000000000000000000;
}
.vue-html2pdf {
	.pdf-map {
		background-color: grey;
		// &::before {
		// 	content: "";
		// 	display: block;
		// 	width: 100%;
		// 	padding-bottom: 50%;
		// }
	}

	.pdf-title {
		line-height: 86px;
	}

	.map {
		padding: 0 !important;
		width: 500px;
		height: 500px;
		position: relative;
	}

	.pdf-content {
		width: 100%;
		background: #fff;
	}

	.layout-container {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: -100vw;
		top: 0;
		z-index: -9999;
		background: rgba(95, 95, 95, 0.8);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		overflow: auto;
		left: 0;
		z-index: 9999;
		&.show-layout {
			left: 0vw;
			z-index: 9999;
		}
		&.unset-all {
			all: unset;
			width: auto;
			height: auto;
		}
	}
	.pdf-preview {
		position: fixed;
		width: 65%;
		min-width: 600px;
		height: 80vh;
		top: 100px;
		z-index: 9999999;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 5px;
		box-shadow: 0px 0px 10px #00000048;
		button {
			position: absolute;
			top: -20px;
			left: -15px;
			width: 35px;
			height: 35px;
			background: #555;
			border: 0;
			box-shadow: 0px 0px 10px #00000048;
			border-radius: 50%;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 20px;
			cursor: pointer;
		}
		iframe {
			border: 0;
		}
	}
	.transition-anim-enter-active,
	.transition-anim-leave-active {
		transition: opacity 0.3s ease-in;
	}
	.transition-anim-enter,
	.transition-anim-leave-to {
		opacity: 0;
	}
}
</style>
