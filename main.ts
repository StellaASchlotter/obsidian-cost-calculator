import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'cost',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				var line_count = editor.lineCount()
				var missing_items = 0
				var bought_items = 0
				var cost_remaining = 0
				var cost_payed = 0
				for (let i = 0; i < line_count; i++) {
					var current_line = editor.getLine(i)
					if (current_line.startsWith("- [ ]")){
						missing_items++
						var cost = parseFloat(current_line.substring(
							current_line.indexOf("(") + 1, 
							current_line.lastIndexOf("€")))
						if (isNaN(cost)){
							console.log(current_line);
						}
						cost_remaining += cost
					}
					if (current_line.startsWith("- [x]")){
						bought_items++
						var cost = parseFloat(current_line.substring(
							current_line.indexOf("(") + 1, 
							current_line.lastIndexOf("€")))
						cost_payed += cost
					}
				  }
				  				
				
				let output_string = `
<div data-callout-metadata="fuchsia" data-callout-fold data-callout="note" class="callout">
<div class="callout-title"><div class="callout-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg></div><div class="callout-title-inner">Cost Analysis</div></div>
<div class="callout-content">
<p>missing_items: ${missing_items} - remaining costs ${cost_remaining}</p>
<p>bought_items: ${bought_items} - payed: ${cost_payed}</p>
</div>
</div>
`;
				editor.replaceSelection(output_string);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
