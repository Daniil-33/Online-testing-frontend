<template>
	<v-navigation-drawer
		permanent
		v-model="drawer"
		:rail="rail"
		@click="rail = false"
	>
        <v-list-item
			title="John Leider"
			nav
        >
			<template v-slot:prepend>
				<v-icon icon="mdi-account"></v-icon>
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
				title="My Forms"
			>
				<template v-slot:prepend>
					<v-icon icon="mdi-format-list-bulleted"></v-icon>
				</template>
			</v-list-item>

          	<v-list-item
				:to="{ name: 'Submissions List' }"
				exact
				title="My Submissions"
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
        items: [
          { title: 'Home', icon: 'mdi-home-city' },
          { title: 'My Account', icon: 'mdi-account' },
          { title: 'Users', icon: 'mdi-account-group-outline' },
        ],
        rail: true,
      }
    },
	setup(props) {
		const icons = {
			list: mdiListBoxOutline,
		}

		return {
			icons
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
</style>
