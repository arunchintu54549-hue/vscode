/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append } from '../../../../base/browser/dom.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';

export interface IQuickAction {
	id: string;
	title: string;
	description: string;
	command: string;
	icon: ThemeIcon;
}

export class TCSQuickActions {

	private actions: IQuickAction[];
	
	constructor(
		private commandService: ICommandService
	) {
		this.actions = this.createQuickActions();
	}

	private createQuickActions(): IQuickAction[] {
		return [
			{
				id: 'new-project',
				title: localize('quickAction.newProject', "New Project"),
				description: localize('quickAction.newProject.description', "Create a new untitled file"),
				command: 'workbench.action.files.newUntitledFile',
				icon: Codicon.newFile
			},
			{
				id: 'open-folder',
				title: localize('quickAction.openFolder', "Open Folder"),
				description: localize('quickAction.openFolder.description', "Browse and open a folder"),
				command: 'workbench.action.files.openFolder',
				icon: Codicon.folderOpened
			},
			{
				id: 'clone-repository',
				title: localize('quickAction.cloneRepository', "Clone Repository"),
				description: localize('quickAction.cloneRepository.description', "Clone a Git repository"),
				command: 'git.clone',
				icon: Codicon.repoClone
			},
			{
				id: 'create-ai-workspace',
				title: localize('quickAction.createAIWorkspace', "Create AI Workspace"),
				description: localize('quickAction.createAIWorkspace.description', "Open command palette"),
				command: 'workbench.action.showCommands',
				icon: Codicon.sparkle
			}
		];
	}

	private createQuickActionElement(action: IQuickAction): HTMLElement {
		const actionElement = $('button.tcs-btn', {
			'x-dispatch': `quickAction:${action.id}`,
			title: action.description,
		}, 
			$('span.codicon', {
				'class': ThemeIcon.asClassName(action.icon)
			}),
			$('span', {}, action.title)
		);

		// Add click handler
		actionElement.addEventListener('click', () => {
			this.commandService.executeCommand(action.command).catch((error: Error) => {
				// Log error and potentially show user feedback
				console.error(`Error executing command ${action.command}:`, error);
				// Optionally, we can provide user feedback here
				if (action.command === 'git.clone') {
					console.warn(`Git extension may not be available. Command: ${action.command}`);
				}
			});
		});

		return actionElement;
	}

	public render(container: HTMLElement): HTMLElement {
		const quickActionsContainer = $('.tcs-quick-actions', {},
			$('h2', {}, localize('tcsCode.title', "TCS-Code"))
		);

		// Create a grid container for the action buttons
		const gridContainer = $('.tcs-quick-actions-grid', {});

		// Create action buttons in grid format
		for (const action of this.actions) {
			const actionElement = this.createQuickActionElement(action);
			append(gridContainer, actionElement);
		}

		append(quickActionsContainer, gridContainer);
		append(container, quickActionsContainer);
		return quickActionsContainer;
	}
}