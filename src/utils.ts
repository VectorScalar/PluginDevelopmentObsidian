import { Console, error } from "console";
import { App, TFolder, Notice, Setting, TAbstractFile, Vault, Plugin } from "obsidian";
import MyPlugin from "./main";
import { resolve } from "path";
import * as path from "path";
import { rejects } from "assert";

export class folderHelper{
    
    private static illegalChars : Array<string> = ['"', '*', '/', '\\', '<', '>', "#", '[', ']', '^', '|', '?', ':']
        
    static getFolderByPath(app : App, path : string) : TFolder | null
    {
        let file = app.vault.getAbstractFileByPath(path);
        if(file instanceof TFolder){
            console.log("Got Folder " + file.name);
            return file as TFolder;
        } else console.log("No folder located At: " + path); return null;
    }


    static containsIllegalChars(string : string) : boolean
    {
        this.illegalChars.forEach(element => {
            console.log(string.includes(element));
            if(string.includes(element))
            {
                return true;
            } 
        });

        return false;
    }
    /**
     * 
     * Returns an array of all current project folders  
     * @returns 
     */
    static getProjectFolders(app : App) : Promise<Array<TFolder>>
    {
        return new Promise((resolve) => {
            let folders = new Array<TFolder>();
            let allFiles = app.vault.getAllLoadedFiles();
            allFiles.forEach(file => {
                if(file instanceof TFolder && !file.isRoot()){
                    folders.push(file as TFolder);
                }
            })

            if(folders.length <= 0) {console.log("0 Project Folders Located");}
            resolve(folders);
       
        })
    }

    static async createFolder(app: App, path: string) : Promise<TFolder>
    { 
        return new Promise(async (resolve) => {
            let folder = this.getFolderByPath(app,path);
            console.log(folder);
            if(folder)
            {
                new Notice("Folder already exists");
                //reject("Folder already exists");
            } else {
                    app.vault.createFolder(path).then(
                    () => resolve(folder as TFolder),
                    (err) => {
                        new Notice(err);}
                    )}
        });
    }
}

// export class jobHelper{
//     static async createNewJob(app : App, plugin : MyPlugin){
//         let folderName = plugin.options.jobFolderName;
//         let jobFolder = plugin.options.jobFolder;
//     if(folderName.length <= 0){
//         new Notice("No foldername has been entered");}
//     else if(folderHelper.containsIllegalChars(folderName)){
//         new Notice("Invalid folder characters entered");}
//     else{
//         //If a job folder has been selected create new job folder inside of it as long as a folder of the same name dosent already exist
//         if(jobFolder.length > 0 && !folderHelper.folderExistsAtPath(app, jobFolder + "/" + folderName)){ 
//             let path = jobFolder + "/" + folderName;
//             new Notice("Created new job folder at " + path);
//             app.vault.createFolder(jobFolder + "/" + folderName);}
//         //If no job folder has been specified create a new job folder and place at path
//         //TODO add all of the jobs folder structure 
//         else if(!folderHelper.folderExistsAtPath(app, folderName)){
//             new Notice("No job folder specified, created folder at path " + folderName);
//             //let folder = folderHelper.createFolder(app, folderName);
//             let folder;
//             folderHelper.createFolder(app, folderName).then((res) => folder = res);
//             console.log(folder); 
//             //app.vault.createFolder(folderName);}
//         }
//     }

// }
// }

