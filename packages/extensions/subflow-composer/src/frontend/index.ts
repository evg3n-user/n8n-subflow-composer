import { markRaw } from 'vue';
import { defineFrontendExtension } from '@n8n/extension-sdk/frontend';
import SubflowLibrary from './SubflowLibrary.vue';
import CreateSubflowDialog from './CreateSubflowDialog.vue';

export default defineFrontendExtension({
	setup(n8n) {
		n8n.registerComponent('SubflowLibrary', markRaw(SubflowLibrary));
		n8n.registerComponent('CreateSubflowDialog', markRaw(CreateSubflowDialog));
	},
});
