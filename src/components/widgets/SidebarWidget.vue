<template>
	<v-navigation-drawer
		permanent
		v-model="drawer"
		:rail="rail"
		@click="rail = false"
	>
        <v-list-item
			:title="userName"
			nav
        >
			<template v-slot:prepend>
				<v-icon
					class="user-icon"
					icon="mdi-account"
					:class="{ 'user-icon--spacing': rail }"
				></v-icon>
			</template>

			<template v-slot:append>
				<v-btn
				variant="text"
				icon="mdi-chevron-left"
				@click.stop="rail = !rail"
				></v-btn>
			</template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          	<v-list-item
				:to="{ name: 'Forms List' }"
				exact
				title="Мої форми"
			>
				<template v-slot:prepend>
					<v-icon icon="mdi-format-list-bulleted"></v-icon>
				</template>
			</v-list-item>

          	<v-list-item
				:to="{ name: 'Submissions List' }"
				exact
				title="Мої результати"
			>
				<template v-slot:prepend>
					<v-icon icon="mdi-file-check-outline"></v-icon>
				</template>
			</v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiListBoxOutline } from '@mdi/js';

import { useAuthModule } from '@/modules/Auth/';
import { computed } from 'vue';

export default {
	name: 'SidebarWidget',
	components: {
		SvgIcon,
	},
	props: {
		items: {
			type: Array,
			required: true,
		},
	},
	data () {
      return {
        drawer: true,
        rail: true,
      }
    },
	setup(props) {
		const { currentUser } = useAuthModule();

		const userName = computed(() => {
			return currentUser.value?.userName;
		});
		const icons = {
			list: mdiListBoxOutline,
		}

		return {
			icons,
			userName
		};
	},
};
</script>

<style lang="scss">
.v-navigation-drawer--mini-variant {
	border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.main-sidebar {
	.main-sidebar-item {
		min-height: 36px;
	}
	&.full-screen {
		display: none;
	}
}

.navigation-tooltip.v-tooltip {
	.v-overlay__content {
		position: relative;
		background: #3f464e !important;

		&:after {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			height: 8px;
			width: 8px;
			background: inherit;
			transform: translate(-50%, -50%) rotate(45deg);
		}
	}
}

.user-icon {
	transition: all .1s linear;
}
.user-icon--spacing {
	margin-left: 6px;
}
</style>
