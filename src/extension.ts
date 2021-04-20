import * as vscode from 'vscode';
import {
    parseComponentName,
    generateIndex,
    generateContentView,
    generateContentContainer
} from './helpers';

export function activate(context: vscode.ExtensionContext) {

    console.log('extension is now active!');

    let disposable = vscode.commands.registerCommand(
        'react-clean-code-structure.createComponent',
        async (uri: vscode.Uri) => {

            let reactType = await vscode.window.showQuickPick(
                ['React', 'React Native'],
                { canPickMany: false }
            );

            if (!reactType) { return; };

            let componentName = await vscode.window.showInputBox({ placeHolder: 'Component name' });

            if (componentName) {

                const { name, slug } = parseComponentName(componentName);

                let newUri = vscode.Uri.file(uri.path + '/' + name);
                await vscode.workspace.fs.createDirectory(newUri);

                //Create components folder
                let path = vscode.Uri.file(newUri.path + "/components");
                await vscode.workspace.fs.createDirectory(path);

                //Create constants file
                path = vscode.Uri.file(newUri.path + "/constants.ts");
                await vscode.workspace.fs.writeFile(path, Buffer.from(''));

                //Create the index.tsx
                try {
                    path = vscode.Uri.file(newUri.path + "/index.ts");
                    await vscode.workspace.fs.writeFile(path, Buffer.from(generateIndex(name)));
                } catch (error) {
                    vscode.window.showInformationMessage(error.message);
                }

                //Create the view component
                try {
                    path = vscode.Uri.file(`${newUri.path}/${name}View.tsx`);
                    await vscode.workspace.fs.writeFile(path, Buffer.from(
                        generateContentView(name, slug, reactType)
                    ));
                } catch (error) {
                    vscode.window.showInformationMessage(error.message);
                }

                //Create the container component
                try {
                    path = vscode.Uri.file(`${newUri.path}/${name}Container.tsx`);
                    await vscode.workspace.fs.writeFile(path, Buffer.from(
                        generateContentContainer(name)
                    ));
                } catch (error) {
                    vscode.window.showInformationMessage(error.message);
                }

                if (reactType === 'React') {
                    //Create style.scss
                    try {
                        path = vscode.Uri.file(`${newUri.path}/${slug}.scss`);
                        let content = `.${slug}{}`;
                        await vscode.workspace.fs.writeFile(path, Buffer.from(content));
                    } catch (error) {
                        vscode.window.showInformationMessage(error.message);
                    }
                }

                vscode.window.showInformationMessage(
                    "React file structure has been created successfully.");
            }
        }
    );

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
