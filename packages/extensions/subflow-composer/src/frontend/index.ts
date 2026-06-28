import { markRaw } from 'vue';
import { defineFrontendExtension } from '@n8n/extension-sdk/frontend';

export default defineFrontendExtension({
	setup(n8n) {
		// Components will be registered here as they are built
		// n8n.registerComponent('SubflowLibrary', markRaw(SubflowLibrary));
		// n8n.registerComponent('CreateSubflowDialog', markRaw(CreateSubflowDialog));
	},
});
