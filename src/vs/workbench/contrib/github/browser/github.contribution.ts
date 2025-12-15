/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as ViewContainerExtensions, IViewContainersRegistry, ViewContainerLocation, IViewsRegistry, ViewContentGroups } from '../../../common/views.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { GitHubViewPane } from './githubViewPane.js';
import { GitHubViewPaneContainer } from './githubViewPaneContainer.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';

const GITHUB_VIEWLET_ID = 'workbench.view.github';

const githubViewIcon = registerIcon('github-view-icon', Codicon.github, 'View icon of the GitHub view.');

const viewContainer = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: GITHUB_VIEWLET_ID,
	title: localize2('github', 'GitHub'),
	ctorDescriptor: new SyncDescriptor(GitHubViewPaneContainer),
	storageId: 'workbench.github.views.state',
	icon: githubViewIcon,
	alwaysUseContainerInfo: true,
	order: 6, // Remote is 5, Extensions is 4.
	openCommandActionDescriptor: {
		id: GITHUB_VIEWLET_ID,
		mnemonicTitle: localize('githubMnemonic', "GitHub"),
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI, // Using 'I' for Integration or somesuch freely available key, avoiding conflict
		},
		order: 6,
	}
}, ViewContainerLocation.Sidebar);

const viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);

// Register a default view with GitHubViewPane
const githubViewId = 'workbench.github.welcome';
viewsRegistry.registerViews([{
	id: githubViewId,
	name: localize2('githubWelcome', "Welcome to GitHub"),
	containerTitle: localize('githubContainer', "GitHub"),
	ctorDescriptor: new SyncDescriptor(GitHubViewPane),
	canToggleVisibility: true,
	hideByDefault: false,
	workspace: true,
	order: 1
}], viewContainer);

// Register Welcome Content
viewsRegistry.registerViewWelcomeContent(githubViewId, {
	content: localize('noWorkspaceHelp', "You have not opened a folder.\n[Open Folder](command:workbench.action.files.openFolder)"),
	when: ContextKeyExpr.equals('workspaceFolderCount', 0),
	group: ViewContentGroups.Open,
	order: 1
});
