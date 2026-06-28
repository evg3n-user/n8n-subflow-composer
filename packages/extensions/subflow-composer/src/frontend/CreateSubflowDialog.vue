<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWorkflowDocumentStore, createWorkflowDocumentId } from '@/app/stores/workflowDocument.store';
import { useWorkflowsStore } from '@/app/stores/workflows.store';
import { useUIStore } from '@/app/stores/ui.store';
import { useRootStore } from '@n8n/stores/useRootStore';
import { makeRestApiRequest } from '@n8n/rest-api-client';
import { N8nButton, N8nHeading, N8nInput, N8nText } from '@n8n/design-system';
import Modal from '@/app/components/Modal.vue';
import type { ModalKey } from '@/Interface';
import { useI18n } from '@n8n/i18n';

const MODAL_KEY: ModalKey = 'CreateSubflowDialog' as ModalKey;

const props = withDefaults(
	defineProps<{
		name?: string;
	}>(),
	{
		name: MODAL_KEY,
	},
);

const emit = defineEmits<{
	close: [];
	created: [];
}>();

const uiStore = useUIStore();
const rootStore = useRootStore();
const workflowsStore = useWorkflowsStore();
const i18n = useI18n();

const subflowName = ref('');
const subflowDescription = ref('');
const saving = ref(false);
const validationError = ref<string | null>(null);

const workflowDocumentStore = computed(() => {
	const workflowId = workflowsStore.workflowId;
	if (!workflowId) return undefined;
	return useWorkflowDocumentStore(createWorkflowDocumentId(workflowId));
});

function getSelectedNodesAndConnections(): {
	nodes: Array<Record<string, unknown>>;
	connections: Record<string, unknown>;
} | null {
	// Get selected nodes from the VueFlow canvas
	// We access the VueFlow instance through the document store
	const docStore = workflowDocumentStore.value;
	if (!docStore) return null;

	// Get all nodes from the workflow document
	const allNodes = docStore.allNodes;
	const connections = docStore.connections;

	// For simplicity, we use all nodes since we can't easily access
	// the canvas selection state from outside the canvas component.
	// In a full implementation, the extension SDK would provide access
	// to selected nodes. Here we serialize the full workflow nodes.
	if (allNodes.length === 0) return null;

	return {
		nodes: allNodes.map((node) => ({
			id: node.id,
			name: node.name,
			type: node.type,
			typeVersion: node.typeVersion,
			position: node.position,
			parameters: node.parameters,
			credentials: node.credentials,
		})),
		connections: connections as unknown as Record<string, unknown>,
	};
}

async function handleCreate(): Promise<void> {
	validationError.value = null;

	if (!subflowName.value.trim()) {
		validationError.value = i18n.baseText('subflowComposer.create.validation.nameRequired', {
			fallback: 'Subflow name is required',
		});
		return;
	}

	const data = getSelectedNodesAndConnections();
	if (!data) {
		validationError.value = i18n.baseText('subflowComposer.create.validation.noNodes', {
			fallback: 'No workflow is currently open. Open a workflow to create a subflow from it.',
		});
		return;
	}

	saving.value = true;
	try {
		await makeRestApiRequest(rootStore.restApiContext, 'POST', '/rest/subflows', {
			name: subflowName.value.trim(),
			description: subflowDescription.value.trim(),
			nodes: data.nodes,
			connections: data.connections,
		});

		subflowName.value = '';
		subflowDescription.value = '';
		uiStore.closeModal(MODAL_KEY);
		emit('created');
	} catch (e) {
		validationError.value = i18n.baseText('subflowComposer.create.error', {
			fallback: 'Failed to create subflow. Please try again.',
		});
		console.error('Failed to create subflow:', e);
	} finally {
		saving.value = false;
	}
}

function handleCancel(): void {
	subflowName.value = '';
	subflowDescription.value = '';
	validationError.value = null;
	uiStore.closeModal(MODAL_KEY);
	emit('close');
}
</script>

<template>
	<Modal
		:name="props.name"
		:title="i18n.baseText('subflowComposer.create.title', { fallback: 'Create Subflow' })"
		width="500px"
		:show-close="true"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@enter="handleCreate"
	>
		<template #content>
			<div class="create-subflow-dialog">
				<div class="create-subflow-dialog__field">
					<N8nInput
						v-model="subflowName"
						:label="i18n.baseText('subflowComposer.create.name', { fallback: 'Name' })"
						:placeholder="i18n.baseText('subflowComposer.create.namePlaceholder', { fallback: 'e.g., Send Welcome Email' })"
						:disabled="saving"
						required
					/>
				</div>

				<div class="create-subflow-dialog__field">
					<N8nInput
						v-model="subflowDescription"
						:label="i18n.baseText('subflowComposer.create.description', { fallback: 'Description' })"
						:placeholder="i18n.baseText('subflowComposer.create.descriptionPlaceholder', { fallback: 'Describe what this subflow does' })"
						:disabled="saving"
						type="textarea"
						:rows="3"
					/>
				</div>

				<div
					v-if="validationError"
					class="create-subflow-dialog__error"
				>
					<N8nText color="danger" size="small">
						{{ validationError }}
					</N8nText>
				</div>

				<div class="create-subflow-dialog__actions">
					<N8nButton
						:label="i18n.baseText('subflowComposer.create.cancel', { fallback: 'Cancel' })"
						size="medium"
						type="secondary"
						:disabled="saving"
						@click="handleCancel"
					/>
					<N8nButton
						:label="i18n.baseText('subflowComposer.create.submit', { fallback: 'Create Subflow' })"
						size="medium"
						:loading="saving"
						:disabled="saving || !subflowName.trim()"
						@click="handleCreate"
					/>
				</div>
			</div>
		</template>
	</Modal>
</template>

<style scoped lang="scss">
.create-subflow-dialog {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-m);

	&__field {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xs);
	}

	&__error {
		padding: var(--spacing-xs) 0;
	}

	&__actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-s);
		margin-top: var(--spacing-m);
	}
}
</style>
