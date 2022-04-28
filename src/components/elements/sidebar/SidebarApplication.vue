<template>
	<div class="feed pt-5 pb-7">
		<!--
		<SidebarFilterItem title="Период рекламной кампании">
			<div class="filter-item__inner d-flex justify-content-between mb-2">
				<label
					class="filter-item__inner-label position-relative d-flex"
				>
					<div
						v-if="!start"
						class="selected-item selected-item_date-label"
					>
						Начало
					</div>

					<input
						type="date"
						placeholder="Начало"
						class="selected-item selected-item_date"
						required
						v-model="start"
						onkeydown="return false"
					/>
				</label>

				<label
					class="filter-item__inner-label position-relative d-flex"
				>
					<div
						v-if="!finish"
						class="selected-item selected-item_date-label"
					>
						Завершение
					</div>

					<input
						type="date"
						placeholder="Завершение"
						class="selected-item selected-item_date"
						required
						v-model="finish"
						onkeydown="return false"
					/>
				</label>
			</div>

			<b-form-checkbox v-model="withProlongation">
				С пролонгацией
			</b-form-checkbox>
		</SidebarFilterItem>
		
		<SidebarFilterItem title="Требуемое кол-во т/с">
			<input
				v-model="tsCount"
				type="text"
				placeholder="Количество тс"
				class="selected-item"
				required
				disabled
			/>
		</SidebarFilterItem>

		<SidebarFilterItem title="Тип рекламы">
			<b-dropdown
				:text="
					selectedAdvertisiment
						? selectedAdvertisiment
						: 'Выберите тип рекламы'
				"
				class="mb-1"
				ref="dropdown"
			>
				<b-dropdown-form
					v-for="(item, idx) in advertisingTypes"
					:key="idx"
					@click="closeDropdown"
				>
					<b-form-radio
						name="advertisiment"
						:value="item.value"
						v-model="selectedAdvertisiment"
						class="mb-1"
					>
						{{ item.text }}
					</b-form-radio>
				</b-dropdown-form>
			</b-dropdown>
		</SidebarFilterItem>

		 <template v-if="selectedAdvertisiment == 'Бортовая реклама'">
			<SidebarFilterItem title="Тип подвижного состава">
				<b-dropdown
					:text="
						selectedBusTypes.length > 0
							? selectedBusTypes.join(', ')
							: 'Выберите тип подвижного состава'
					"
					class="mb-1"
				>
					<b-dropdown-form>
						<b-form-checkbox-group
							v-model="selectedBusTypes"
							:options="busTypes"
						/>
					</b-dropdown-form>
				</b-dropdown>
			</SidebarFilterItem>

			<SidebarFilterItem title="Требуемые борта">
				<b-dropdown text="Бортовая реклама" ref="selectDistrict">
					<b-dropdown-form>
						<SelectCheckbox
							title="Полное оформление"
							:items="busSidesDecorations"
							:index="0"
							class="mb-1"
						/>
						<b-form-group @submit.stop.prevent class="mb-1">
							<b-form-input
								placeholder="Другое"
								v-model="busDecarationOther"
							/>
						</b-form-group>
					</b-dropdown-form>
				</b-dropdown>
			</SidebarFilterItem>

			<SidebarFilterItem title="Площадь макета, кв. м.">
				<div class="d-flex">
					<input
						v-model="layoutArea.sides"
						type="text"
						placeholder="На бортах"
						class="selected-item mr-1"
						required
						v-mask="'####'"
					/>

					<input
						v-model="layoutArea.glass"
						type="text"
						placeholder="На остеклении"
						class="selected-item"
						required
						v-mask="'####'"
					/>
				</div>
			</SidebarFilterItem>

			<SidebarFilterItem
				title="Количество переклеек в течение р/к"
				:class="{ 'filter-item--disabled': reGlues.withoutReGlues }"
			>
				<div class="d-flex mb-2">
					<input
						v-model="reGlues.full"
						type="text"
						placeholder="Полных"
						class="selected-item mr-1"
						required
						v-mask="'####'"
						:disabled="reGlues.withoutReGlues ? 'disabled' : null"
					/>

					<input
						v-model="reGlues.partial"
						type="text"
						placeholder="Частичных"
						class="selected-item"
						required
						v-mask="'####'"
						:disabled="reGlues.withoutReGlues ? 'disabled' : null"
					/>
				</div>

				<b-form-checkbox v-model="reGlues.withoutReGlues">
					Без переклейки
				</b-form-checkbox>
			</SidebarFilterItem>

			<SidebarFilterItem
				title="Площадь макета переклеек, кв. м."
				:class="{ 'filter-item--disabled': reGlues.withoutReGlues }"
			>
				<div class="d-flex mb-2">
					<input
						v-model="layoutAreaReGlues.full"
						type="text"
						placeholder="Полных"
						class="selected-item mr-1"
						required
						v-mask="'####'"
						:disabled="reGlues.withoutReGlues ? 'disabled' : null"
					/>

					<input
						v-model="layoutAreaReGlues.partial"
						type="text"
						placeholder="Частичных"
						class="selected-item"
						required
						v-mask="'####'"
						:disabled="reGlues.withoutReGlues ? 'disabled' : null"
					/>
				</div>
			</SidebarFilterItem>
		</template>

		<template v-if="selectedAdvertisiment == 'Внутрисалонная реклама'">
			<SidebarFilterItem title="Формат рекламы">
				<b-dropdown
					:text="
						selectedAdvertisementFormat.length > 0
							? selectedAdvertisementFormat.join(', ')
							: 'Выберите формат рекламы'
					"
					class="mb-1"
				>
					<b-dropdown-form>
						<b-form-checkbox-group
							v-model="selectedAdvertisementFormat"
							:options="advertisementFormat"
						/>
					</b-dropdown-form>
				</b-dropdown>
			</SidebarFilterItem>

			<SidebarFilterItem
				title="Маршрутная сеть и требуемое кол-во единиц по городам"
			>
				<b-dropdown
					:text="
						selectedRouteNetwork.length > 0
							? selectedRouteNetwork.join(', ')
							: 'Выберите маршрутную сеть по городам'
					"
					class="mb-1"
				>
					<b-dropdown-form>
						<b-form-checkbox-group
							v-model="selectedRouteNetwork"
							:options="routeNetwork"
						/>
					</b-dropdown-form>
				</b-dropdown>
			</SidebarFilterItem>

			<SidebarFilterItem title="Особые требования и условия">
				<b-textarea
					class="selected-item mb-2 filter-item__textarea"
					placeholder="Комментарии"
					rows="4"
					max-rows="8"
					wrap="soft"
					v-model="comment.text"
				/>

				<label class="btn btn-file d-flex filter-item__file-label">
					<svgicon name="direct-download" />
					Прикрепить файл
					<b-form-file v-model="comment.file" hidden plain />
				</label>
			</SidebarFilterItem>
		</template> -->

		<b-form @submit="onSubmit" @reset="onReset">
			<SidebarFilterItem>
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

				<b-form-row class="mb-5 align-items-center">
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
			</SidebarFilterItem>
			<SidebarFilterItem>
				<b-form-row class="mb-1 align-items-center">
					<b-col cols="5">
						<p class="m-0">Дата начала</p>
					</b-col>
					<b-col cols="7">
						<div
							class="date-picker selected-item mr-2"
							@click="onDatePickerClick"
							ref="pickerBeg"
						>
							<b-form-datepicker
								calendar-width="100%"
								:hide-header="true"
								locale="ru-RU"
								v-bind="labels.ru || {}"
								:boundary="$refs.pickerBeg"
								id="start-datepicker"
								placeholder=" "
								v-model="form.dateStart"
								:date-format-options="{
									day: 'numeric',
									month: 'numeric',
									year: 'numeric',
								}"
							/>
							<svgicon name="calendar" />
						</div>
					</b-col>
				</b-form-row>

				<b-form-row class="mb-1 align-items-center">
					<b-col cols="5">
						<p class="m-0">Дата завершения</p>
					</b-col>
					<b-col cols="7">
						<div
							class="date-picker selected-item"
							@click="onDatePickerClick"
							ref="pickerFin"
						>
							<b-form-datepicker
								calendar-width="100%"
								:hide-header="true"
								v-bind="labels.ru || {}"
								locale="ru"
								:boundary="$refs.pickerFin"
								id="finish-datepicker"
								placeholder=" "
								v-model="form.dateFinish"
								:date-format-options="{
									day: 'numeric',
									month: 'numeric',
									year: 'numeric',
								}"
							/>
							<svgicon name="calendar" />
						</div>
					</b-col>
				</b-form-row>
				<b-form-row class="mb-1 align-items-center">
					<b-col cols="5">
						<p class="m-0">Вид рекламы</p>
					</b-col>
					<b-col cols="7">
						<b-dropdown
							:text="
								form.selectedAdvertisiment.length > 0
									? form.selectedAdvertisiment.join(', ')
									: null
							"
							class="dropdown--overflow"
						>
							<b-dropdown-form >
								<b-form-checkbox-group
									v-model="form.selectedAdvertisiment"
									:options="advertisingTypes"
								/>
							</b-dropdown-form>
						</b-dropdown>
					</b-col>
				</b-form-row>
				<b-form-row
					class="mb-1 align-items-center"
					v-if="
						form.selectedAdvertisiment.includes(
							'Внутрисалонная реклама'
						)
					"
				>
					<b-col cols="5">
						<p class="m-0">Форматы рекламы</p>
					</b-col>
					<b-col cols="7">
						<b-dropdown
							:text="
								form.selectedAdvertisementFormat.length > 0
									? form.selectedAdvertisementFormat.join(
											', '
									  )
									: null
							"
							class="dropdown--overflow"
						>
							<b-dropdown-form>
								<b-form-checkbox-group
									v-model="form.selectedAdvertisementFormat"
									:options="advertisementFormat"
								/>
							</b-dropdown-form>
						</b-dropdown>
					</b-col>
				</b-form-row>
				<b-form-row class="mb-1 align-items-center">
					<b-col cols="5">
						<p class="m-0">Оформление стекол</p>
					</b-col>
					<b-col cols="7">
						<input
							type="text"
							class="selected-item"
							
						/>
					</b-col>
				</b-form-row>
			</SidebarFilterItem>
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
					class=" justify-content-center"
				>
					<svgicon name="route" />
					Сделать КП
				</b-button>
			</div>
		</b-form>
	</div>
</template>

<script>
import { mask } from "vue-the-mask";
import SidebarFilterItem from "@/components/elements/sidebar/SidebarFilterItem";
import SelectCheckbox from "@/components/elements/SelectCheckbox";

export default {
	name: "SidebarApplication",
	directives: { mask },
	components: {
		SidebarFilterItem,
		SelectCheckbox,
	},
	data: () => ({
		labels: {
			ru: {
				labelPrevDecade: "Предыдущий десяток",
				labelPrevYear: "Предыдущий год",
				labelPrevMonth: "Предыдущий месяц",
				labelCurrentMonth: "Текущий месяц",
				labelNextMonth: "Следующий месяц",
				labelNextYear: "Следующий год",
				labelNextDecade: "Следующий десяток",
				labelToday: "Сегодня",
				labelSelected: "йцуйцуйуц",
				labelNoDateSelected: "Дата не выбрана",
				labelCalendar: "Календарь",
				labelNav: "123123",
				labelHelp: "туц-туц",
			},
		},
		start: "",
		finish: "",
		tsCount: 70,
		withProlongation: true,
		busType: [],

		selectedAdvertisiment: [],
		advertisingTypes: [
			{ text: "Бортовая реклама", value: "Бортовая реклама" },
			{ text: "Внутрисалонная реклама", value: "Внутрисалонная реклама" },
		],
		selectedBusTypes: [],
		busTypes: [
			{ text: "Большой (МАЗ103, ЛиАЗ и пр.)", value: "Большой" },
			{ text: "Средний (ПАЗ, МАЗ206 и пр.)", value: "Средний" },
			{ text: "Малый (VW, Mercedes, Iveco и пр.)", value: "Малый" },
		],
		layoutArea: {
			sides: "",
			glass: "",
		},
		layoutAreaReGlues: {
			sides: "",
			glass: "",
		},
		comment: {
			text: "",
			file: null,
		},
		reGlues: {
			full: "",
			partial: "",
			withoutReGlues: true,
		},

		busSidesDecorations: [
			{
				text: "Правый",
				value: "Правый",
			},
			{
				text: "Левый",
				value: "Левый",
			},
			{
				text: "Задний",
				value: "Задний",
			},
			{
				text: "Микс",
				value: "Микс",
			},
		],
		busDecarationOther: "",

		selectedAdvertisementFormat: [],
		advertisementFormat: [
			{
				text: "Вип-стикеры",
				value: "Вип-стикеры",
			},
			{
				text: "А2",
				value: "А2",
			},
			{
				text: "А3",
				value: "А3",
			},
			{
				text: "А4",
				value: "А4",
			},
			{
				text: "Панорамное окно",
				value: "Панорамное окно",
			},
			{
				text: "Подголовники",
				value: "Подголовники",
			},
			{
				text: "Поручни",
				value: "Поручни",
			},
		],

		selectedRouteNetwork: [],
		routeNetwork: [
			{
				text: "Санкт-Петербург",
				value: "Санкт-Петербург",
			},
			{
				text: "Ленинградская область",
				value: "Ленинградская область",
			},
			{
				text: "Москва И Московская область",
				value: "Москва И Московская область",
			},
			{
				text: "другие города",
				value: "другие города",
			},
		],
	}),
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
				return this.$store.state.form;
			},
			set: function(newValue) {
				this.$store.state.form = newValue;
			},
		},
	},
	methods: {
		onDatePickerClick(evt) {
			evt.target.querySelector("label").click();
		},
		onSubmit(event) {
			event.preventDefault();
			// console.log(JSON.stringify(this.form));

			this.$store.dispatch("postFilters");

			// this.axios({
			// 	method: "post",
			// 	url: "//map.r78.tmweb.ru/email-kp.php",
			// 	headers: {
			// 		"Content-Type": "application/x-www-form-urlencoded",
			// 	},
			// 	data: {
			// 		name: this.form.name,
			// 		email: this.form.email,
			// 		phone: this.form.phone,
			// 		date: `${this.start} - ${this.finish}`,
			// 		transport: this.tsCount,
			// 		advType: this.selectedAdvertisiment,
			// 		routeTypes: this.selectedBusTypes.join(", "),
			// 		squaresGlass: this.layoutArea.glass,
			// 		squaresSides: this.layoutArea.sides,
			// 		reGluesFull: this.reGlues.full,
			// 		reGluesPartial: this.reGlues.partial,
			// 		reGluesSquaresFull: this.layoutAreaReGlues.full,
			// 		reGluesSquaresPartial: this.layoutAreaReGlues.partial,
			// 		advFormat: this.selectedAdvertisementFormat.join(", "),
			// 		network: this.selectedRouteNetwork.join(", "),
			// 		comment: this.comment.text,
			// 	},
			// })
			// 	.then(function() {
			// 		alert("Отправлено");
			// 	})
			// 	.catch(function(response) {
			// 		console.error(response);
			// 	});
		},
		onReset(event) {
			event.preventDefault();
			this.form.email = "";
			this.form.name = "";
			this.form.check = false;

			// Trick to reset/clear native browser form validation state
			// this.show = false;
			// this.$nextTick(() => {
			// 	this.show = true;
			// });
		},
		closeDropdown() {
			this.$refs.dropdown.hide(true);
		},
	},
};
</script>

<style lang="scss">
.feed {
	// overflow: auto;
	height: 100%;
}

.filter-item {
	&__file-label {
		width: fit-content;
		padding: 11px;
		margin: 0;
	}

	&__textarea {
		white-space: wrap;
	}
}
</style>
