import { App, PluginSettingTab, Setting, SuggestModal, TFolder, Vault, TAbstractFile, TFile, Notice, Events } from "obsidian";
import type MyPlugin from "./main";
import * as utils from "./utils";
import { type } from "os";

//TODO Replace create folder with create job 
export interface ISettings{
    jobFolder: string;
    jobFolderName: string;
    //folderCache: Array<TFolder>;
}

export const defaultSettings = Object.freeze({
    jobFolder: "",
    jobFolderName: "",
    //folderCache: new Array<TFolder>()
  });
  
export class JobSettingsTab extends PluginSettingTab{
    private plugin: MyPlugin;
    
    constructor(app: App, plugin: MyPlugin)
    {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    display(): void{
        

        this.containerEl.empty();
        this.containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});
         let folders; 
         utils.folderHelper.getProjectFolders(this.app)
            .then((res) => {
                folders = res; 
                console.log(folders);
                if(folders.length > 0){this.addJobFolderSelectSetting(folders);}
                else{this.plugin.options.jobFolder = ""; 
                    this.plugin.saveSettings();}

                this.addCreateJobFolderSetting(folders);
            });
         

    }


    addCreateJobFolderSetting(folders: Array<TFolder>): void{
        new Setting(this.containerEl)
            .setName("Create New Job")
            
            //Text field for entering the job name
            .addText((text) => {
                text
                
                .setPlaceholder("New Job Name")
                .onChange(async(value) => {
                    this.plugin.options.jobFolderName = value;
                    await this.plugin.saveSettings();
                })
            })

            //Button for creating a new job folder
            .addButton((button) => {
                button
                .setClass("newfolderbutton")
                .setButtonText("Create New Folder")
                .onClick(async (clicked) => {
                    await utils.folderHelper.createFolder(this.app,this.plugin.options.jobFolderName).then(() => this.display());
                    
                })
            })
        }

    //Adds dropdown menu for selecting job folder(WOULD LIKE TO USE SEARCH)
    addJobFolderSelectSetting(folders: Array<TFolder>): void {
        
        new Setting(this.containerEl)
          .setName("Job Folder")
          .setDesc("The folder containing a list of all jobs")
          .addDropdown((dropdown) => {
            folders.forEach(folder => {
                dropdown.addOption(folder.path, folder.name);
                dropdown.setValue(this.plugin.options.jobFolder);
                dropdown.onChange(async (value) => {
                    this.plugin.options.jobFolder = value;
                    await this.plugin.saveSettings();
                 })
            });
        })  
      } 
}
