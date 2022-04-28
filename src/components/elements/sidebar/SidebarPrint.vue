<template>
	<div class="print sidebar-inner aside-section" ref="advancePaynemt">
		<div class="print__info d-flex flex-column justify-content-between">
			<div class="print__img-wrap">
				<!-- <img class="print__img" src="@/assets/img/map.jpg" alt="map"> -->
			</div>
		
			<div>
				<div class="print__info-inner d-flex align-items-center mb-2">
					<svgicon name="logo" class="logo" />

					<h1 class="print__info-title">Предварительный расчёт № 834569</h1>
				</div>
				
				<h2>Статистика</h2>
				<ul class="list-icons mb-5">
					<li>
						<svgicon name="buildings" />
						Санкт-Петербург
					</li>
					<li>
						<svgicon name="map-marker" />
						Городские и областные
					</li>
					<li>
						<svgicon name="map-region" />
						Василеостровский, Центральный
					</li>
					<li>
						<svgicon name="route" />
						70 км маршрутов
					</li>
					<li>
						<svgicon name="bus" />
						70 транспортных средств
					</li>
					<li>
						<svgicon name="road" />
						150 км общая протяженность
					</li>
					<li>
						<svgicon name="road-marker" />
						8 км средняя протяженность
					</li>
					<li>
						<svgicon name="stars" />
						Общий показатель GRP 420
					</li>
					<li>
						<svgicon name="star" />
						Средний показатель GRP 4
					</li>
				</ul>
			</div>
			

			<div class="print__info-contacts d-flex justify-content-between align-items-center">
				<a href="http://map.r78.tmweb.ru/pre-order/834569" class="print__info-contacts-link">http://map.r78.tmweb.ru/pre-order/834569</a>
				<a href="tel:+78121234567" class="print__info-contacts-number">+7 (812) 123 45 67</a>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: "Print",
	methods: {
		onSubmit(event) {
			event.preventDefault();
			alert(JSON.stringify(this.form));
		},
		onReset(event) {
			event.preventDefault();
			this.form.email = "";
		},
	}
};
</script>

<style lang="scss">
.print {
	height: 100vh;
    width: 100%;
    max-width: 595px;
	margin-left: auto;
	position: relative;
	padding: 280px 20px 20px;

	&__img {
		width: 100%;
    	height: 100%;

		&-wrap {
			height: 261px;
			position: absolute;
			left: 0;
    		top: 0;
		}
	}

	&__info {
		height: 100%;

		&-title {
			margin: 0 0 0 20px;
		}

		&-contacts {
			margin-top: auto;

			&-link,
			&-number {
    			color: #666666;
				
				&:hover {
					color: #333333;
					text-decoration: none;
				}
			}
		}
	}
}
</style>
