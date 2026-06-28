<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUIStore } from '@/app/stores/ui.store';
import { useRootStore } from '@n8n/stores/useRootStore';
import { makeRestApiRequest } from '@n8n/rest-api-client';
import { N8nButton, N8nCard, N8nHeading, N8nText, N8nIcon, N8nLoading } from '@n8n/design-system';
import { useI18n } from '@n8n/i18n';
import { VIEWS } from '@/app/constants';

interface SubflowListItem {
	id: string;
	name: string;
	description: string;
	workflowId: string;
	createdAt: string;
	updatedAt: string;
}

const router = useRouter();
const uiStore = useUIStore();
const rootStore = useRootStore();
const i18n = useI18n();

const subflows = ref<SubflowListItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const CREATE_SUBFLOW_MODAL_KEY = 'CreateSubflowDialog';

async function fetchSubflows(): Promise<void> {
	loading.value = true;
	error.value = null;
	try {
		subflows.value = await makeRestApiRequest(rootStore.restApiContext, 'GET', '/rest/subflows');
	} catch (e) {
		error.value = i18n.baseText('subflowComposer.fetchError', { fallback: 'Failed to load subflows' });
		console.error('Failed to fetch subflows:', e);
	} finally {
		loading.value = false;
	}
}

function openCreateDialog(): void {
	uiStore.openModal(CREATE_SUBFLOW_MODAL_KEY);
}

function insertSubflow(subflow: SubflowListItem): void {
	// Navigate to the workflow editor with the subflow's workflow
	router.push({
		name: VIEWS.WORKFLOW,
		params: { workflowId: subflow.workflowId },
	});
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

const hasSubflows = computed(() => subflows.value.length > 0);

onMounted(() => {
	void fetchSubflows();
});

// Expose refresh for parent components
defineExpose({
	fetchSubflows,
});
</script>

<template>
	<div class="subflow-library">
		<div class="subflow-library__header">
			<N8nHeading size="large" tag="h2">
				{{ i18n.baseText('subflowComposer.title', { fallback: 'Subflow Library' }) }}
			</N8nHeading>
			<N8nButton
				size="large"
				label="New Subflow"
				icon="plus"
				@click="openCreateDialog"
			/>
		</div>

		<N8nLoading v-if="loading" :loading="loading" :rows="3" />

		<div
			v-else-if="error"
			class="subflow-library__error"
		>
			<N8nText color="danger">{{ error }}</N8nText>
			<N8nButton
				size="small"
				label="Retry"
				@click="fetchSubflows"
			/>
		</div>

		<div
			v-else-if="!hasSubflows"
			class="subflow-library__empty"
		>
			<N8nIcon icon="cubes" size="xlarge" />
			<N8nHeading size="medium" tag="h3">
				{{ i18n.baseText('subflowComposer.empty.title', { fallback: 'No subflows yet' }) }}
			</N8nHeading>
			<N8nText color="text-base">
				{{ i18n.baseText('subflowComposer.empty.description', { fallback: 'Create your first subflow by selecting nodes in a workflow and saving them as a reusable subflow.' }) }}
			</N8nText>
			<N8nButton
				size="medium"
				label="Create Subflow"
				icon="plus"
				@click="openCreateDialog"
			/>
		</div>

		<div
			v-else
			class="subflow-library__list"
		>
			<N8nCard
				v-for="subflow in subflows"
				:key="subflow.id"
				class="subflow-library__item"
				hoverable
				@click="insertSubflow(subflow)"
			>
				<div class="subflow-library__item-content">
					<div class="subflow-library__item-info">
						<N8nHeading size="small" tag="h4">
							{{ subflow.name }}
						</N8nHeading>
						<N8nText v-if="subflow.description" color="text-base" size="small">
							{{ subflow.description }}
						</N8nText>
					</div>
					<div class="subflow-library__item-meta">
						<N8nText color="text-light" size="small">
							{{ i18n.baseText('subflowComposer.created', { fallback: 'Created' }) }}: {{ formatDate(subflow.createdAt) }}
						</N8nText>
					</div>
				</div>
			</N8nCard>
		</div>
	</div>
</template>

<style scoped lang="scss">
.subflow-library {
	padding: var(--spacing-xl);

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-l);
	}

	&__error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-m);
		padding: var(--spacing-xl);
		text-align: center;
	}

	&__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-s);
		padding: var(--spacing-2xl);
		text-align: center;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	&__item {
		cursor: pointer;

		&-content {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			gap: var(--spacing-m);
		}

		&-info {
			display: flex;
			flex-direction: column;
			gap: var(--spacing-2xs);
			flex: 1;
			min-width: 0;
		}

		&-meta {
			flex-shrink: 0;
		}
	}
}
</style>
