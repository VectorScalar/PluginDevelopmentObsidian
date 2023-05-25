import { App, Editor, Events, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, SearchComponent, Setting, TFolder} from 'obsidian';
import { ISettings, JobSettingsTab, defaultSettings } from './settings';
import * as utils from "./utils";
import { text } from 'stream/consumers';
// Remember to rename these classes and interfaces!


export default class MyPlugin extends Plugin {
	public options: ISettings;
	
	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "create-new-job-folder",
			name: "Create New Job",
			callback: () => {
				let result : string;
				new CreateJobModal(this.app, (value) => {result = value;}).open();
			}
		})
	

	this.addSettingTab(new JobSettingsTab(this.app, this));
	}

	async loadSettings() {
		
		this.options = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.options);
	}


}

class CreateJobModal extends Modal {
	result : string;
	onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl("h1", { text: "Create New Job" });

		new Setting(contentEl)
		.setName("Name")
		.addText((text) => {
			text
			.onChange((value) => {
				this.result = value
			})
		})

		new Setting(contentEl)
		.addButton(btn => {
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					//let folder : TFolder;
					//utils.folderHelper.createFolder(app, "Folder").then((res) => { folder = res;})
					this.onSubmit(this.result);
				})
		})
	}

	onClose() {
		const {contentEl} = this;
		console.log(this.result);
		contentEl.empty();
	}
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;

// 	}

	

// 	display(): void {
// 		const {containerEl} = this;
// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'a for my awesome plugin.'});
		
				
// 	}	
// }

