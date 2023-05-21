import { createApp } from 'vue'

import { createPinia } from 'pinia'
import router from './router'
import i18n from './plugins/i18n'

import App from './App.vue'

import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(i18n)
app.use(createPinia())

import UIProgressBar from '@/components/ui/UIProgressBar.vue'
import UILoader from '@/components/ui/UILoader.vue'
import UITimePicker from '@/components/ui/inputs/UiTimePicker.vue'
import UINumberField from '@/components/ui/inputs/UINumberField.vue'

app.component('ui-time-picker', UITimePicker)
app.component('ui-number-field', UINumberField)
app.component('ui-progress-bar', UIProgressBar)
app.component('ui-loader', UILoader)


app.mount('#app')
