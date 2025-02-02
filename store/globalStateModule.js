import axios from 'axios'

export const globalStateModule = {
	state: () => ({
		global: {
			offcanvas: {
				mobile_menu: false,
				add_club: false,
				search_box: false,
				add_athlet: false,
				edit_athlet: false,
				add_documents: false,
				check_documents: false,
				upsell_default: false,
				upsell_for_every: false,
				master_class: false,
				choose_event_form: false,
				camp_shift: false,
			},
			offcanvas_data_name: null,
			offcanvas_data: null,
			footer_top_padding: 30,
			main_menu: [],
			event_categories: [],
			social_links: {},
			offer_block: null,
			search_index: [],
			filter_results_index: [],
			payment_methods: [],
			countries: {},
			russia_subjects: [],
			russia_cities: [],
			/* kz_cities: [],
			by_cities: [], */
			athlete_categories: [
				'Нет разряда',
				'IIIюн',
				'IIюн',
				'Iюн',
				'III',
				'II',
				'I',
				'КМС',
				'МС',
				'МСМК',
			],
			athlete_documents: [
				{
					name: 'Свидетельство о рождении/паспорт',
					desc: '1 разворот паспорта с ФИО и датой рождения участника',
					multiple: false,
					required: true,
				},
				{
					name: 'Зачетная книжка - 1 страница с ФИО участника',
					desc: 'Приложите скан-копию или фото',
					multiple: false,
					required: true,
				},
				{
					name: 'Зачетная книжка - 3 страница с номером и датой приказа о действующем разряде',
					desc: 'Приложите скан-копию или фото',
					multiple: false,
					required: true,
				},
				{
					name: 'Зачетная книжка - 4 страница с приказом о подтверждении разряда',
					desc: 'В случае невыполнения очередного спортивного разряда в течение установленного срока',
					multiple: false,
					required: false,
				},
				{
					name: 'Именная заявка на участие в соревнованиях',
					desc: 'Именная заявка на участие в соревнованиях, подписанная руководителем спортивной школы, клуба или физкультурно-спортивной организации, заверенная печатью физкультурного диспансера и подписью врача, подписью представителя команды (или отдельный медицинский допуск, если это допущено в Положении о соревнованиях). Если документ состоит из нескольких страниц - прикрепите все',
					multiple: true,
					required: true,
				},
				{
					name: 'Спортивная страховка',
					desc: 'Если документ состоит из нескольких страниц - прикрепите все',
					multiple: true,
					required: true,
				},
				{
					name: 'Сертификат РУСАДА',
					desc: 'Приложите скан-копию или фото',
					multiple: false,
					required: true,
				},
				{
					name: 'Полис обязательного медицинского страхования',
					desc: 'Приложите скан-копию или фото',
					multiple: false,
					required: true,
				},
				{
					name: 'Именная заявка (или медицинский допуск, если разрешено Положением)',
					desc: 'Приложите скан-копию или фото',
					multiple: false,
					required: true,
				},
			],
			clubs: [
				{
					name: '"БуряДВ" БГОСОФП "Белогорск"',
					country: 'RUS',
					state: 'АМУР',
					city: 'Белогорск',
					short_name: 'БУРЯБЕЛ',
				},
				{
					name: 'Ant Team Каменск-Уральский',
					country: 'RUS',
					state: 'СВРД',
					city: 'Каменск-Уральский',
					short_name: 'ANTКУ',
				},
				{
					name: 'BIG WAVE Самара',
					country: 'RUS',
					state: 'СМР',
					city: 'Самара',
					short_name: 'BIGWAVE',
				},
				{
					name: 'CШОР №1 Курган',
					country: 'RUS',
					state: 'КУРГ',
					city: 'Курган',
					short_name: 'СШОР1КУР',
				},
				{
					name: 'Froka Боровичи',
					country: 'RUS',
					state: 'НОВГ',
					city: 'Боровичи',
					short_name: 'СК ФРОКА',
				},
				{
					name: 'Kenigswimm Светлогорск',
					country: 'RUS',
					state: 'КЛГД',
					city: 'Светлогорск',
					short_name: 'KENIGСВЕ',
				},
				{
					name: 'SC "Konigsberg" Калининград',
					country: 'RUS',
					state: 'КЛГД',
					city: 'Калининград',
					short_name: 'СК КЛГД',
				},
				{
					name: 'Swimming stars club Санкт - Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт - Петербург',
					short_name: 'SSC СПБ',
				},
				{
					name: 'Ак Буре Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'АКБУРЕ',
				},
				{
					name: 'СК "Альфа-Центр" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'СКАЦ МОС',
				},
				{
					name: 'АНО СК "СКА-Swim" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт - Петербург',
					short_name: 'СКА СВИМ',
				},
				{
					name: 'АНО ЦСП Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'АНО ЦСП',
				},
				{
					name: 'Бассейн "Жемчужина" Чернушка',
					country: 'RUS',
					state: 'ПЕРМ',
					city: 'Чернушка',
					short_name: 'ЖЕМЧЕРНУ',
				},
				{
					name: 'Бассейн "Юбилейный" Лениногорск',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Лениногорск',
					short_name: 'ЮБИЛ ТАТ',
				},
				{
					name: 'Бассейн Бутлерова Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'БУТКАЗН',
				},
				{
					name: 'Бобровская ДЮСШ Бобров',
					country: 'RUS',
					state: 'ВРЖ',
					city: 'Бобров',
					short_name: 'ДЮСШБОБР',
				},
				{
					name: 'Гимназия №179 Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'Г179 ТАТ',
				},
				{
					name: 'Дирекция массового спорта Руза',
					country: 'RUS',
					state: 'МО',
					city: 'Руза',
					short_name: 'МСРУЗА',
				},
				{
					name: 'ДООПЦ Ковдор',
					country: 'RUS',
					state: 'МУРМ',
					city: 'Ковдор',
					short_name: 'КОВДОР',
				},
				{
					name: 'ДС "Восток" Орехово-Зуево',
					country: 'RUS',
					state: 'МО',
					city: 'Орехово-Зуево',
					short_name: 'ДСВОСТОК',
				},
				{
					name: 'ДСК Донской',
					country: 'RUS',
					state: 'ТУЛ',
					city: 'Донской',
					short_name: 'ДСКДОН',
				},
				{
					name: 'ДЮСШ "Заря Востока" Владивосток',
					country: 'RUS',
					state: 'ПРМ',
					city: 'Владивосток',
					short_name: 'ЗАРЯВОСТ',
				},
				{
					name: 'ДЮСШ "Олимп" Конаково',
					country: 'RUS',
					state: 'ТВР',
					city: 'Конаково',
					short_name: 'ОЛИМПКОН',
				},
				{
					name: 'ДЮСШ "Янтарь" Северск',
					country: 'RUS',
					state: 'ТОМ',
					city: 'Северск',
					short_name: 'ЯНТР СЕВ',
				},
				{
					name: 'ДЮСШ № 6 Тамбов',
					country: 'RUS',
					state: 'ТАМ',
					city: 'Тамбов',
					short_name: 'СШ6ТАМБ',
				},
				{
					name: 'ДЮСШ №1 Благовещенск',
					country: 'RUS',
					state: 'АМУР',
					city: 'Благовещенск',
					short_name: 'ДЮСШ1БЛГ',
				},
				{
					name: 'ДЮСШ №10 Иваново',
					country: 'RUS',
					state: 'ИВН',
					city: 'Иваново',
					short_name: 'СШ10ИВАН',
				},
				{
					name: 'ДЮСШ Агинское',
					country: 'RUS',
					state: 'ЗБК',
					city: 'Агинское',
					short_name: 'ДЮСШАГИН',
				},
				{
					name: 'ДЮСШ г.Заречный',
					country: 'RUS',
					state: 'СВРД',
					city: 'Заречный',
					short_name: 'ЗАРЕЧСВР',
				},
				{
					name: 'ДЮСШ г.Нефтегорска',
					country: 'RUS',
					state: 'СМР',
					city: 'Нефтегорска',
					short_name: 'ДЮСШНЕФТ',
				},
				{
					name: 'ДЮСШ Гагарин',
					country: 'RUS',
					state: 'СМОЛ',
					city: 'Гагарин',
					short_name: 'ДЮСШГАГР',
				},
				{
					name: 'ДЮСШ Городище',
					country: 'RUS',
					state: 'ПЕНЗ',
					city: 'Городище',
					short_name: 'ГОРОДИЩЕ',
				},
				{
					name: 'ДЮСШ Кандалакша',
					country: 'RUS',
					state: 'МУРМ',
					city: 'Кандалакша',
					short_name: 'КАНДАЛАШ',
				},
				{
					name: 'ДЮСШ Сергиевск',
					country: 'RUS',
					state: 'СМР',
					city: 'Сергиевск',
					short_name: 'ДЮСШСЕРГ',
				},
				{
					name: 'Истринская СШ Истра',
					country: 'RUS',
					state: 'МО',
					city: 'Истра',
					short_name: 'СШ ИСТ',
				},
				{
					name: 'Казанское СВУ Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'СВУ КЗН',
				},
				{
					name: 'Кировская СШ Кировск',
					country: 'RUS',
					state: 'КИР',
					city: 'Кировск',
					short_name: 'КИРОВСК',
				},
				{
					name: 'КСШ "ПГУФКСиТ" Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'ГАФКСИТ',
				},
				{
					name: 'КСШОР №1 Нижний Новгород',
					country: 'RUS',
					state: 'Н-Н',
					city: 'Нижний Новгород',
					short_name: 'КСШОР1НН',
				},
				{
					name: 'КСШОР №1 Тверь',
					country: 'RUS',
					state: 'ТВР',
					city: 'Тверь',
					short_name: 'КСШОР1',
				},
				{
					name: 'Люблино Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МФСОЦ',
				},
				{
					name: 'МАП Ховрино Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МАПХОВ',
				},
				{
					name: 'МАС пятиборья Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МАСПЯТИБ',
				},
				{
					name: 'МАУ «Спортцентр» Нововоронеж',
					country: 'RUS',
					state: 'ВРЖ',
					city: 'Нововоронеж',
					short_name: 'МАУ ВРЖ',
				},
				{
					name: 'МБУ "СШОР Королев" Королев',
					country: 'RUS',
					state: 'МО',
					city: 'Королев',
					short_name: 'КОРОЛЕВ',
				},
				{
					name: 'МГФСО Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МГФСО',
				},
				{
					name: 'Мир спорта "Сталь" Электросталь',
					country: 'RUS',
					state: 'МО',
					city: 'Электросталь',
					short_name: 'МБУ МСС',
				},
				{
					name: 'МКСШ "Зеленоград" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МКСШЗЕЛ',
				},
				{
					name: 'МКСШОР "Восток" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ВОСТОК',
				},
				{
					name: 'МКСШОР "Запад" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЗАПАД',
				},
				{
					name: 'МКСШОР "Север" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'СЕВЕР',
				},
				{
					name: 'МЭВИС-1 Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МЭВИС1',
				},
				{
					name: 'ООО "Линкор" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЛИНКОР',
				},
				{
					name: 'ОСШОР Одинцово',
					country: 'RUS',
					state: 'МО',
					city: 'Одинцово',
					short_name: 'ОСШОР МО',
				},
				{
					name: 'ПБ "Универсант" Псков',
					country: 'RUS',
					state: 'ПСКВ',
					city: 'Псков',
					short_name: 'ПБУНИВЕР',
				},
				{
					name: 'ПК "МАРЛИН" Сочи',
					country: 'RUS',
					state: 'КРСД',
					city: 'Сочи',
					short_name: 'ПКМАРЛИН',
				},
				{
					name: 'Планета Фитнес Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'ПФ КЗН',
				},
				{
					name: 'ППКУ Петрозаводск',
					country: 'RUS',
					state: 'КАР',
					city: 'Петрозаводск',
					short_name: 'ППКУПЕТ',
				},
				{
					name: 'РОО "ФПТО" Тюмень',
					country: 'RUS',
					state: 'ТЮМ',
					city: 'Тюмень',
					short_name: 'ФПТОТЮМ',
				},
				{
					name: 'РССШ по плаванию РСЯ Якутск',
					country: 'RUS',
					state: 'ЯКТ',
					city: 'Якутск',
					short_name: 'РССШ ЯКТ',
				},
				{
					name: 'РСШОР "Акватика" Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'АКВАТИКА',
				},
				{
					name: 'Самбо-70 "Ясенево" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'С70 ЯС',
				},
				{
					name: 'СДЮШ СКА Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СКА СПБ',
				},
				{
					name: 'СДЮШОР «Энергия» Красноярск',
					country: 'RUS',
					state: 'КРСН',
					city: 'Красноярск',
					short_name: 'ЭНЕРГИЯ',
				},
				{
					name: 'СК "AquaRus" Пятигорск',
					country: 'RUS',
					state: 'СТВР',
					city: 'Пятигорск',
					short_name: 'ПЯТИГОРС',
				},
				{
					name: 'СК "Go swim" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'GOSWIM',
				},
				{
					name: 'СК "Академия Плавания" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'АКПЛАВСП',
				},
				{
					name: 'СК "Аксион" Ижевск',
					country: 'RUS',
					state: 'УДМ',
					city: 'Ижевск',
					short_name: 'АКСИОНИЖ',
				},
				{
					name: 'СК "Арбат" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'АРБАТ',
				},
				{
					name: 'СК "Атлант" Домодедово',
					country: 'RUS',
					state: 'МО',
					city: 'Домодедово',
					short_name: 'АТЛАНТДМ',
				},
				{
					name: 'СК "Динамо" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ДИНАМО',
				},
				{
					name: 'СК "Кайман" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'КАЙМАН',
				},
				{
					name: 'СК "Касатка" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'КАСАТКАС',
				},
				{
					name: 'СК "Плавание всем" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'СКПЛАВАН',
				},
				{
					name: 'СК "Сиверс спорт" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СИВЕРС',
				},
				{
					name: 'ФК "Таурас" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ТАУРАС',
				},
				{
					name: 'СК "Юнтолово" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ЮНТОЛОВО',
				},
				{
					name: 'СК «Изумрудный» Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ФОКИЗУМР',
				},
				{
					name: 'СК ВВС "Волна" Одинцово',
					country: 'RUS',
					state: 'МО',
					city: 'Одинцово',
					short_name: 'ВОЛНА ОД',
				},
				{
					name: 'СК ВМФ Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СКВМФ',
				},
				{
					name: 'СК ВОСВОД Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ВОСВОД',
				},
				{
					name: 'СК Е. Богомазовой Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СКБОГОМА',
				},
				{
					name: 'СК Можга',
					country: 'RUS',
					state: 'УДМ',
					city: 'Можга',
					short_name: 'СКМОЖГА',
				},
				{
					name: 'СКП "Волга" Волгоград',
					country: 'RUS',
					state: 'ВЛГ',
					city: 'Волгоград',
					short_name: 'СКПВОЛГА',
				},
				{
					name: 'СКП "Олимпийский" Владивосток',
					country: 'RUS',
					state: 'ПРМ',
					city: 'Владивосток',
					short_name: 'ОЛИМППРМ',
				},
				{
					name: 'СОК "Тан" Уфа',
					country: 'RUS',
					state: 'БШКТ',
					city: 'Уфа',
					short_name: 'СОКТАН',
				},
				{
					name: 'СОШ "Школа будущего" Калининград',
					country: 'RUS',
					state: 'КЛГД',
					city: 'Калининград',
					short_name: 'СОШБУДЩ',
				},
				{
					name: 'СОШ №27 Мытищи',
					country: 'RUS',
					state: 'МО',
					city: 'Мытищи',
					short_name: 'СОШ27МЫТ',
				},
				{
					name: 'СОШ №8 Мытищи',
					country: 'RUS',
					state: 'МО',
					city: 'Мытищи',
					short_name: 'СОШ8МЫТ',
				},
				{
					name: 'Спортсервис Сочи',
					country: 'RUS',
					state: 'КРСД',
					city: 'Сочи',
					short_name: 'СС КРСД',
				},
				{
					name: 'ССШОР Ижевск',
					country: 'RUS',
					state: 'УДМ',
					city: 'Ижевск',
					short_name: 'СШОРИЖЕВ',
				},
				{
					name: 'СШ "Быстрица" Киров',
					country: 'RUS',
					state: 'КИР',
					city: 'Киров',
					short_name: 'БЫСТРИЦА',
				},
				{
					name: 'СШ "Весна" Подольск',
					country: 'RUS',
					state: 'МО',
					city: 'Подольск',
					short_name: 'СШ ВЕСНА',
				},
				{
					name: 'СШ "Виктория" Екатеринбург',
					country: 'RUS',
					state: 'СВРД',
					city: 'Екатеринбург',
					short_name: 'ВИКТОРИЯ',
				},
				{
					name: 'СШ "Дельфин" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ДЕЛЬФИНС',
				},
				{
					name: 'СШ "ДС "Зарече" Нижний Новгород',
					country: 'RUS',
					state: 'Н-Н',
					city: 'Нижний Новгород',
					short_name: 'ФОКЗАРЕЧ',
				},
				{
					name: 'СШ "Звезда" Серпухов',
					country: 'RUS',
					state: 'МО',
					city: 'Серпухов',
					short_name: 'СШЗВЕЗДА',
				},
				{
					name: 'СШ "Зилант" Кукмор',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Кукмор',
					short_name: 'СШЗИЛАНТ',
				},
				{
					name: 'СШ "Ивантеевка" Ивантеевка',
					country: 'RUS',
					state: 'МО',
					city: 'Ивантеевка',
					short_name: 'ИВАНТЕЕВ',
				},
				{
					name: 'СШ "Керамик" Балашиха',
					country: 'RUS',
					state: 'МО',
					city: 'Балашиха',
					short_name: 'КЕРАМИК',
				},
				{
					name: 'СШ "Косино" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'КОСИНО',
				},
				{
					name: 'СШ "Краснознаменск" Краснознаменск',
					country: 'RUS',
					state: 'МО',
					city: 'Краснознаменск',
					short_name: 'СШ КРЗН',
				},
				{
					name: 'СШ "Лыткарино" Лыткарино',
					country: 'RUS',
					state: 'МО',
					city: 'Лыткарино',
					short_name: 'ЛЫТКАРИН',
				},
				{
					name: 'СШ "Малахит" Асбест',
					country: 'RUS',
					state: 'СВРД',
					city: 'Асбест',
					short_name: 'МАЛАХИТА',
				},
				{
					name: 'СШ "Манеж" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'МАНЕЖ',
				},
				{
					name: 'СШ "Маяк" Оренбург',
					country: 'RUS',
					state: 'ОРНБ',
					city: 'Оренбург',
					short_name: 'СШМАЯК',
				},
				{
					name: 'СШ "Нижегородец" Нижний Новгород',
					country: 'RUS',
					state: 'Н-Н',
					city: 'Нижний Новгород',
					short_name: 'НИЖЕГОР',
				},
				{
					name: 'СШ "Ока" Ступино',
					country: 'RUS',
					state: 'МО',
					city: 'Ступино',
					short_name: 'СК ОКА',
				},
				{
					name: 'СШ "Олимп" Богатые Сабы',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Богатые Сабы',
					short_name: 'ОЛИМПТАТ',
				},
				{
					name: 'СШ "Олимп" Мамадыш',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Мамадыш',
					short_name: 'ОЛИМПМАМ',
				},
				{
					name: 'СШ "Олимп" Уруссу',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Уруссу',
					short_name: 'ОЛИМПУРУ',
				},
				{
					name: 'СШ "Олимп" Фрязино',
					country: 'RUS',
					state: 'МО',
					city: 'Фрязино',
					short_name: 'ОЛИМПФРЯ',
				},
				{
					name: 'СШ "Олимпия" Пермь',
					country: 'RUS',
					state: 'ПЕРМ',
					city: 'Пермь',
					short_name: 'ОЛИМПИЯ',
				},
				{
					name: 'СШ "Пушкино" Пушкино',
					country: 'RUS',
					state: 'МО',
					city: 'Пушкино',
					short_name: 'ПУШКИНО',
				},
				{
					name: 'СШ "Сатурн" Раменское',
					country: 'RUS',
					state: 'МО',
					city: 'Раменское',
					short_name: 'СШСАТУРН',
				},
				{
					name: 'СШ "Синий кит" Кунгур',
					country: 'RUS',
					state: 'ПЕРМ',
					city: 'Кунгур',
					short_name: 'СШСНКИТ',
				},
				{
					name: 'СШ "Тюлячи"',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Тюлячи',
					short_name: 'СШТЮЛЯЧИ',
				},
				{
					name: 'СШ "Центр" Сергиев Посад',
					country: 'RUS',
					state: 'МО',
					city: 'Сергиев Посад',
					short_name: 'СШЦЕНТР',
				},
				{
					name: 'СШ "Черноголовка" Черноголовка',
					country: 'RUS',
					state: 'МО',
					city: 'Черноголовка',
					short_name: 'ДЮСШЧЕРН',
				},
				{
					name: 'СШ "Юность" Екатеринбург',
					country: 'RUS',
					state: 'СВРД',
					city: 'Екатеринбург',
					short_name: 'ЮНОСТЬЕК',
				},
				{
					name: 'СШ "Юность" Ухта',
					country: 'RUS',
					state: 'КОМИ',
					city: 'Ухта',
					short_name: 'ЮНОСТЬУХ',
				},
				{
					name: 'СШ “Полет” Арсеньев',
					country: 'RUS',
					state: 'ПРМ',
					city: 'Арсеньев',
					short_name: 'АРС ПРМ',
				},
				{
					name: 'СШ № 12  Воронеж',
					country: 'RUS',
					state: 'ВРЖ',
					city: 'Воронеж',
					short_name: 'СШ12 ВРЖ',
				},
				{
					name: 'СШ № 2 Протвино',
					country: 'RUS',
					state: 'МО',
					city: 'Протвино',
					short_name: 'СШ2ПРОТВ',
				},
				{
					name: 'СШ №1 Елец',
					country: 'RUS',
					state: 'ЛПЦ',
					city: 'Елец',
					short_name: 'СШ1ЕЛЕЦ',
				},
				{
					name: 'СШ №1 Тюмень',
					country: 'RUS',
					state: 'ТЮМ',
					city: 'Тюмень',
					short_name: 'ДЮСШ1ТЮ',
				},
				{
					name: 'СШ №18 Уфа',
					country: 'RUS',
					state: 'БШКТ',
					city: 'Уфа',
					short_name: 'СШ18БШКТ',
				},
				{
					name: 'СШ №3 "Мелодия" Апрелевка',
					country: 'RUS',
					state: 'МО',
					city: 'Апрелевка',
					short_name: 'МЕЛОДИЯ',
				},
				{
					name: 'СШ №6 Кострома',
					country: 'RUS',
					state: 'КСТР',
					city: 'Кострома',
					short_name: 'СШ6КСТР',
				},
				{
					name: 'СШ ВВС "Волна" Рязань',
					country: 'RUS',
					state: 'РЯЗ',
					city: 'Рязань',
					short_name: 'ВОЛНАРЯЗ',
				},
				{
					name: 'СШ ВВС Астрахань',
					country: 'RUS',
					state: 'АСТР',
					city: 'Астрахань',
					short_name: 'ВВСАСТРА',
				},
				{
					name: 'СШ Губаха',
					country: 'RUS',
					state: 'ПЕРМ',
					city: 'Губаха',
					short_name: 'СШГУБАХА',
				},
				{
					name: 'СШ им. Богдановского Вышневолоцкий го',
					country: 'RUS',
					state: 'ТВР',
					city: 'Вышний Волочек',
					short_name: 'ДЮСШВЫШВ',
				},
				{
					name: 'СШ Красногвардейского р-на СПб',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШ2 КГВ',
				},
				{
					name: 'СШ Кронштадтского р-на СПб',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШ КРНШТ',
				},
				{
					name: 'СШ Петроградского р-на СПб',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШПЕТРОГ',
				},
				{
					name: 'СШ по ВВС Южно-Сахалинск',
					country: 'RUS',
					state: 'САХ',
					city: 'Южно-Сахалинск',
					short_name: 'СШВВССАХ',
				},
				{
					name: 'СШ Тетюши',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Тетюши',
					short_name: 'ТЕТЮШИ',
				},
				{
					name: 'СШ ЦСКА Одинцово',
					country: 'RUS',
					state: 'МО',
					city: 'Одинцово',
					short_name: 'ЦСКА МО',
				},
				{
					name: 'СШОР "Академия спорта" Воскресенск',
					country: 'RUS',
					state: 'МО',
					city: 'Воскресенск',
					short_name: 'СШАКАДСП',
				},
				{
					name: 'СШОР "Дельта" Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'ДЕЛЬТА',
				},
				{
					name: 'СШОР "Дельфин" Брянск',
					country: 'RUS',
					state: 'БРЯН',
					city: 'Брянск',
					short_name: 'ДЕЛЬФИНБ',
				},
				{
					name: 'СШОР "Дельфин" Хабаровск',
					country: 'RUS',
					state: 'ХАБ',
					city: 'Хабаровск',
					short_name: 'ДЕЛЬФИНХ',
				},
				{
					name: 'СШОР "Ижора" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОРИЖОР',
				},
				{
					name: 'СШОР "Касатка" Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'КАСАТКА',
				},
				{
					name: 'СШОР "Комета" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'КОМЕТА',
				},
				{
					name: 'СШОР "Метеор" Балашиха',
					country: 'RUS',
					state: 'МО',
					city: 'Балашиха',
					short_name: 'МЕТЕОРБЛ',
				},
				{
					name: 'СШОР "Москвич" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'МОСКВИЧ',
				},
				{
					name: 'СШОР "Олимпийский" Набережные Челны',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Набережные Челны',
					short_name: 'СШОР НЧ',
				},
				{
					name: 'СШОР "Олимпия" Кирово-Чепецк',
					country: 'RUS',
					state: 'КИР',
					city: 'Кирово-Чепецк',
					short_name: 'ОЛИМПКИР',
				},
				{
					name: 'СШОР "Поморье" Архангельск',
					country: 'RUS',
					state: 'АРХ',
					city: 'Архангельск',
					short_name: 'ПОМОРЬЕ',
				},
				{
					name: 'СШОР "Радуга" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'РАДУГАСП',
				},
				{
					name: 'СШОР "Фаворит" Выборг',
					country: 'RUS',
					state: 'ЛЕН',
					city: 'Выборг',
					short_name: 'ФАВОРИТЛ',
				},
				{
					name: 'СШОР "ЮНИКА" Челябинск',
					country: 'RUS',
					state: 'ЧЛБ',
					city: 'Челябинск',
					short_name: 'ЮНИКА ЧЛ',
				},
				{
					name: 'СШОР "Юность Москвы "Скифы" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЮМ СКИФЫ',
				},
				{
					name: 'СШОР "Юность Москвы "Труд" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЮМ ТРУД',
				},
				{
					name: 'СШОР "Юность Москвы" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЮМ',
				},
				{
					name: 'СШОР "Юность" Торжок',
					country: 'RUS',
					state: 'ТВР',
					city: 'Торжок',
					short_name: 'ЮНОСТЬТО',
				},
				{
					name: 'СШОР "Юпитер" Нижний Тагил',
					country: 'RUS',
					state: 'СВРД',
					city: 'Нижний Тагил',
					short_name: 'ЮПИТЕРНТ',
				},
				{
					name: 'СШОР № 3 Петрозаводск',
					country: 'RUS',
					state: 'КАР',
					city: 'Петрозаводск',
					short_name: 'ПЕТРОЗАВ',
				},
				{
					name: 'СШОР № 64 Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'СШОР64',
				},
				{
					name: 'СШОР № 7 Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'СШ7 МОС',
				},
				{
					name: 'СШОР №1 Воронеж',
					country: 'RUS',
					state: 'ВРЖ',
					city: 'Воронеж',
					short_name: 'СШОР1ВРЖ',
				},
				{
					name: 'СШОР №1 Севастополь',
					country: 'RUS',
					state: 'СЕВ',
					city: 'Севастополь',
					short_name: 'СШОР1СЕВ',
				},
				{
					name: 'СШОР №10 "Олимп" Тольятти',
					country: 'RUS',
					state: 'СМР',
					city: 'Тольятти',
					short_name: 'ОЛИМПТОЛ',
				},
				{
					name: 'СШОР №2 Сызрань',
					country: 'RUS',
					state: 'СМР',
					city: 'Сызрань',
					short_name: 'СЫЗРАНЬ',
				},
				{
					name: 'СШОР №22 Ростов-на-Дону',
					country: 'RUS',
					state: 'Р-Д',
					city: 'Ростов-на-Дону',
					short_name: 'СШОР22 Р',
				},
				{
					name: 'СШОР №3 "Невская" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОР3НЕВ',
				},
				{
					name: 'СШОР №3 Калининского р-на Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОР3КЛН',
				},
				{
					name: 'СШОР ВВС Новосибирск',
					country: 'RUS',
					state: 'НВСБ',
					city: 'Новосибирск',
					short_name: 'ВВС НВСБ',
				},
				{
					name: 'СШОР Кировского р-на Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОР КИР',
				},
				{
					name: 'СШОР Ногинск',
					country: 'RUS',
					state: 'МО',
					city: 'Ногинск',
					short_name: 'НОГИНСК',
				},
				{
					name: 'СШОР Петродворцового р-на Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОР ПДВ',
				},
				{
					name: 'СШОР по ВВC "Экран" Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ЭКРАН',
				},
				{
					name: 'СШОР по ВВС "Электросталь"',
					country: 'RUS',
					state: 'МО',
					city: 'Электросталь',
					short_name: 'ВВС ЭЛЕК',
				},
				{
					name: 'СШОР по ВВС «Невская волна» СПб',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОР НВ',
				},
				{
					name: 'СШОР по ВВС Калининград',
					country: 'RUS',
					state: 'КЛГД',
					city: 'Калининград',
					short_name: 'ВВС КЛГД',
				},
				{
					name: 'СШОР по ВВС Руза',
					country: 'RUS',
					state: 'МО',
					city: 'Руза',
					short_name: 'РУЗА',
				},
				{
					name: 'СШОР по ВВС Чехов',
					country: 'RUS',
					state: 'МО',
					city: 'Чехов',
					short_name: 'ВВСЧЕХОВ',
				},
				{
					name: 'СШОР по плаванию Йошкар-Ола',
					country: 'RUS',
					state: 'МЭ',
					city: 'Йошкар-Ола',
					short_name: 'СШОРМЭ',
				},
				{
					name: 'СШОР по плаванию Мытищи',
					country: 'RUS',
					state: 'МО',
					city: 'Мытищи',
					short_name: 'СШОРМЫТИ',
				},
				{
					name: 'СШОР Приморского р-на',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'СШОР ПРМ',
				},
				{
					name: 'СШОР ЦСКА "Волга" Волгоград',
					country: 'RUS',
					state: 'ВЛГ',
					city: 'Волгоград',
					short_name: 'ЦСКАВЛГ',
				},
				{
					name: 'СШОР Электросталь ',
					country: 'RUS',
					state: 'МО',
					city: 'Электросталь',
					short_name: 'СШОРЭЛЕК',
				},
				{
					name: 'УОР №1 Екатеринбург',
					country: 'RUS',
					state: 'СВРД',
					city: 'Екатеринбург',
					short_name: 'УОР1ЕКБ',
				},
				{
					name: 'УОР №1 Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'УОР1СПБ',
				},
				{
					name: 'УОР №4 Чехов',
					country: 'RUS',
					state: 'МО',
					city: 'Чехов',
					short_name: 'УОР4ЧЕХ',
				},
				{
					name: 'УСК "Олимпиец" Екатеринбург',
					country: 'RUS',
					state: 'СВРД',
					city: 'Екатеринбург',
					short_name: 'ОЛИМПЕКБ',
				},
				{
					name: 'ФИТкультура Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ФИТКУЛ',
				},
				{
					name: 'ФК "Fitron" Ростов-на-Дону',
					country: 'RUS',
					state: 'Р-Д',
					city: 'Ростов-на-Дону',
					short_name: 'FITRON',
				},
				{
					name: 'ФК "Life Clab" Домодедово',
					country: 'RUS',
					state: 'МО',
					city: 'Домодедово',
					short_name: 'ФКЛКДОМ',
				},
				{
					name: 'ФК "Бурановский" Нижний Новгород',
					country: 'RUS',
					state: 'Н-Н',
					city: 'Нижний Новгород',
					short_name: 'БУРАННН',
				},
				{
					name: 'ФК "Нептун" Балашиха',
					country: 'RUS',
					state: 'МО',
					city: 'Балашиха',
					short_name: 'НЕПТУНБЛ',
				},
				{
					name: 'ФОК "Авангард" Солнечногорск',
					country: 'RUS',
					state: 'МО',
					city: 'Солнечногорск',
					short_name: 'АВАНГСОЛ',
				},
				{
					name: 'ФОК "Искра" Ульяновск',
					country: 'RUS',
					state: 'УЛН',
					city: 'Ульяновск',
					short_name: 'ИСКРАУЛ',
				},
				{
					name: 'ФОК "Красная Горка" Бор',
					country: 'RUS',
					state: 'Н-Н',
					city: 'Бор',
					short_name: 'КРАСГОР',
				},
				{
					name: 'ФОЦ ОАО «РЖД» Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ФОЦ РЖД',
				},
				{
					name: 'ФП КБР Нальчик',
					country: 'RUS',
					state: 'КБР',
					city: 'Нальчик',
					short_name: 'ФПКБР',
				},
				{
					name: 'ФРДС "Сфера спорта" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ФРДССФЕР',
				},
				{
					name: 'ФСО "ЦСПП "Мельцер" Сочи',
					country: 'RUS',
					state: 'КРСД',
					city: 'Сочи',
					short_name: 'MELTSERС',
				},
				{
					name: 'ФЦ "Олимп" Хотьково ',
					country: 'RUS',
					state: 'МО',
					city: 'Хотьково',
					short_name: 'ОЛИМПХОТ',
				},
				{
					name: 'ЦВВС "Спартак" Волгоград',
					country: 'RUS',
					state: 'ВЛГД',
					city: 'Волгоград',
					short_name: 'СПАРТВЛГ',
				},
				{
					name: 'ЦВР "Алиса" Бор',
					country: 'RUS',
					state: 'Н-Н',
					city: 'Бор',
					short_name: 'ЦВРАЛИСА',
				},
				{
					name: 'ЦО №49 ШСК "Комета" Тверь',
					country: 'RUS',
					state: 'ТВР',
					city: 'Тверь',
					short_name: 'КОМЕТТВР',
				},
				{
					name: 'ЦСКА Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЦСКА МОС',
				},
				{
					name: 'ЦСКА Одинцово',
					country: 'RUS',
					state: 'МО',
					city: 'Одинцово',
					short_name: 'ЦСКА ОДЦ',
				},
				{
					name: 'ЦСКА Самара',
					country: 'RUS',
					state: 'СМР',
					city: 'Самара',
					short_name: 'ЦСКА СМР',
				},
				{
					name: 'ЦСП "Динамо"',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ЦСП ДИН',
				},
				{
					name: 'ЦСШ №1 Наро-Фоминск',
					country: 'RUS',
					state: 'МО',
					city: 'Наро-Фоминск',
					short_name: 'ЦСШ НФ',
				},
				{
					name: 'ЦФКиС "Юный Чемпион" СПб',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ШП ЮЧ',
				},
				{
					name: 'Школа № 2005 Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'СОШ 2005',
				},
				{
					name: 'ШП "Mighty Sharks" Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'MSHARKSМ',
				},
				{
					name: 'ШП "SwimMoscow" Краснознаменск',
					country: 'RUS',
					state: 'МО',
					city: 'Краснознаменск',
					short_name: 'SWIMOSC',
				},
				{
					name: 'ШП "Нептун" Воронеж',
					country: 'RUS',
					state: 'ВРЖ',
					city: 'Воронеж',
					short_name: 'ШПНЕПТУН',
				},
				{
					name: 'ШП "Свиммастер" Омск',
					country: 'RUS',
					state: 'ОМС',
					city: 'Омск',
					short_name: 'СВИММАСТ',
				},
				{
					name: 'ШП "Чемпион" Тула',
					country: 'RUS',
					state: 'ТУЛ',
					city: 'Тула',
					short_name: 'ЧЕМПИОН',
				},
				{
					name: 'ШП MY CHAMPS Казань',
					country: 'RUS',
					state: 'ТАТР',
					city: 'Казань',
					short_name: 'MYCHAMPS',
				},
				{
					name: 'ШП SPN Химки',
					country: 'RUS',
					state: 'МО',
					city: 'Химки',
					short_name: 'ШП SPN',
				},
				{
					name: 'ШП С.Комаровой Москва',
					country: 'RUS',
					state: 'МОС',
					city: 'Москва',
					short_name: 'ШП СК М',
				},
				{
					name: 'ШСК “Акме” Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ШПАКМЕСП',
				},
				{
					name: 'ШСК «Марлин» Санкт-Петербург',
					country: 'RUS',
					state: 'СПБ',
					city: 'Санкт-Петербург',
					short_name: 'ШСК МАРЛ',
				},
			],
		},
	}),
	getters: {
		getOffcanvas: (state) => (el) => {
			return state.global.offcanvas[el]
		},
		getOffcanvasData(state) {
			return state.global.offcanvas_data
		},
		getOffcanvasDataName(state, str) {
			return state.global.offcanvas_data_name
		},
		getBackgroundStatus(state) {
			return Object.values(state.global.offcanvas).indexOf(true) > 0
		},
		getMainMenu(state) {
			return state.global.main_menu
		},
		getEventCategories(state) {
			return state.global.event_categories
		},
		CLUBS(state) {
			return state.global.clubs
		},
		getCountries(state) {
			return state.global.countries
		},
		RUSSIA_SUBJECTS(state) {
			return state.global.russia_subjects.sort((a, b) => {
				return a.name.localeCompare(b.name)
			})
		},
		RUSSIA_CITIES(state) {
			return state.global.russia_cities
		},
		/* KZ_CITIES(state) {
			return state.global.kz_cities
		},
		BY_CITIES(state) {
			return state.global.by_cities
		}, */
		getRussiaCitiesBySubject: (state) => (el) => {
			if (!el) return []
			let subject = state.global.russia_subjects.find((item) => item.code == el)
			if (!subject) return []
			return state.global.russia_cities.filter((item) => item.subject == subject.name)
		},
		getCities(state) {
			let cities = [...state.global.russia_cities]
			return cities.sort((a, b) => b.population - a.population)
		},
		getAthleteCategories(state) {
			return state.global.athlete_categories
		},
		getAthleteDocuments(state) {
			return state.global.athlete_documents
		},
		getSearchIndex(state) {
			return state.global.search_index
		},
		getFilterResultsIndex(state) {
			return state.global.filter_results_index
		},
		getPaymentMethods(state) {
			return state.global.payment_methods
		},
		getSocialLinks(state) {
			return state.global.social_links
		},
		getOfferBlock(state) {
			return state.global.offer_block
		},
		getFooterTopPadding(state) {
			return state.global.footer_top_padding
		},
	},
	mutations: {
		toggleOffcanvas(state, el) {
			state.global.offcanvas[el] = !state.global.offcanvas[el]
		},
		closeOffcanvas(state, el) {
			state.global.offcanvas[el] = false
		},
		setOffcanvasDataName(state, str) {
			state.global.offcanvas_data_name = str
		},
		setOffcanvasData(state, data) {
			state.global.offcanvas_data = data
		},
		openOffcanvas(state, el) {
			state.global.offcanvas[el] = true
		},
		closeAllOffcanvas(state) {
			for (var index in state.global.offcanvas) {
				state.global.offcanvas[index] = false
			}
		},
		setMenu(state, main_menu) {
			let menuArray = main_menu.map(function (item) {
				item.isActive = false
				return item
			})
			state.global.main_menu = menuArray
		},
		setPaymentMethods(state, response) {
			state.global.payment_methods = response
		},
		setEventCategories(state, response) {
			state.global.event_categories = response
		},
		setСountries(state, response) {
			state.global.countries = response
		},
		setRussiaSubjects(state, subjects) {
			state.global.russia_subjects = subjects
		},
		setRussiaCities(state, cities) {
			state.global.russia_cities = cities
		},
		/* setKzCities(state, cities) {
			state.global.kz_cities = cities
		},*/
		setSocialLinks(state, links) {
			state.global.social_links = links
		},
		setOfferBlock(state, response) {
			state.global.offer_block = response
		},
		setSearchIndex(state, response) {
			let order = {
				EventStage: 0,
				EventCompetition: 1,
				EventCamp: 2,
				EventMasterClass: 3,
				Post: 4,
				MediaPhoto: 5,
				MediaVideo: 6,
				Page: 7,
			}

			function compare(a, b) {
				if (a === b) {
					return 0
				}
				return a < b ? -1 : 1
			}

			state.global.search_index = Object.keys(response)
				.sort(function (a, b) {
					var index_result = compare(
						order[a],
						order[b]
					)

					return index_result
				})
				.reduce((obj, key, index) => {
					obj[index + '__' +key] = response[key]
					return obj
				}, {})
		},
		setFilterResultIndex(state, response) {
			state.global.filter_results_index = response
		},
		setFooterTopPadding(state, response) {
			state.global.footer_top_padding = response + 30
		},
	},
	actions: {
		async fetchSettings({ state, commit }) {
			if (_.isEmpty(state.global.main_menu)) {
				try {
					const response = await axios.get(process.env.VUE_APP_BASE_URL + 'settings')
					commit('setMenu', response.data.menu)
					commit('setPaymentMethods', response.data.payment_methods)
					commit('setEventCategories', response.data.event_categories)
					commit('setSocialLinks', response.data.social_links)
					commit('setOfferBlock', response.data.offer_block)
				} catch (e) {
					alert('Ошибка получения данных с сервера о меню')
				}
			}
		},
		async fetchGeo({ state, commit }) {
			if (
				_.isEmpty(state.global.russia_subjects) ||
				_.isEmpty(state.global.russia_cities)
			) {
				try {
					const response = await axios.get(process.env.VUE_APP_BASE_URL + 'settings/geo')
					commit('setСountries', response.data.countries)
					commit('setRussiaSubjects', response.data.russia_subjects)
					commit('setRussiaCities', response.data.russia_cities)
					/* commit('setKzCities', response.data.kz_cities)
					commit('setByCities', response.data.by_cities) */
				} catch (e) {
					alert('Ошибка получения данных с сервера о гео-метках')
				}
			}
		},
		async fetchSearchIndex({ state, commit }) {
			if (_.isEmpty(state.global.search_index)) {
				try {
					const response = await axios.get(process.env.VUE_APP_BASE_URL + 'search/index')
					commit('setSearchIndex', response.data)
				} catch (e) {
					alert('Ошибка получения данных с сервера о поисковом индексе')
				}
			}
		},
		async fetchFilterResultIndex({ state, commit }) {
			if (_.isEmpty(state.global.filter_results_index)) {
				try {
					const response = await axios.get(
						process.env.VUE_APP_BASE_URL + 'results/filter/index'
					)
					commit('setFilterResultIndex', response.data)
				} catch (e) {
					alert('Ошибка получения данных с сервера о фильтрах результатов')
				}
			}
		},
	},
	namespaced: true,
}
