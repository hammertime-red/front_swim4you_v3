import { createStore } from 'vuex'
import { homeStateModule } from './homeStateModule'
import { globalStateModule } from './globalStateModule'
import { eventsStateModule } from './eventsStateModule'
import { newsStateModule } from './newsStateModule'
import { mediaStateModule } from './mediaStateModule'
import { pageStateModule } from './pageStateModule'
import { resultsStateModule } from './resultsStateModule'
import { formCompetitionModule } from './formCompetitionModule'
import { profileStateModule } from './profileStateModule'
import { orderStateModule } from './orderStateModule'
import { photobankStateModule } from './photobankStateModule'
import { shopStateModule } from './shopStateModule'

export default createStore({
	modules: {
		home: homeStateModule,
		global: globalStateModule,
		formCompetition: formCompetitionModule,
		events: eventsStateModule,
		results: resultsStateModule,
		news: newsStateModule,
		media: mediaStateModule,
		page: pageStateModule,
		profile: profileStateModule,
		order: orderStateModule,
		photobank: photobankStateModule,
		shop: shopStateModule,
	},
})
