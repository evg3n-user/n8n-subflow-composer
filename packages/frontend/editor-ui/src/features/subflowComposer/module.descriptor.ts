import { RouterView } from 'vue-router';
import type { FrontendModuleDescription } from '@/app/moduleInitializer/module.types';
import { VIEWS } from '@/app/constants';

const SubflowLibrary = async () =>
	await import('@/features/subflowComposer/views/SubflowLibraryView.vue');

export const SubflowComposerModule: FrontendModuleDescription = {
	id: 'subflow-composer',
	name: 'Subflow Composer',
	description: 'Create reusable subflows from node selections',
	icon: 'cubes',
	routes: [
		{
			path: '/subflows',
			component: RouterView,
			meta: {
				middleware: ['authenticated', 'rbac'],
				middlewareOptions: {
					rbac: {
						scope: ['workflow:create'],
					},
				},
			},
			children: [
				{
					path: '',
					name: VIEWS.SUBFLOWS,
					component: SubflowLibrary,
				},
			],
		},
	],
	modals: [
		{
			key: 'CreateSubflowDialog',
			component: async () =>
				await import('@hermes/n8n-extension-subflow-composer/frontend/CreateSubflowDialog.vue'),
			initialState: {
				open: false,
			},
		},
	],
};
