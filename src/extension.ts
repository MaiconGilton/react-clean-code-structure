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

                //Create the index.tsx
                try {
                    let _uri = vscode.Uri.file(newUri.path + "/index.tsx");
                    await vscode.workspace.fs.writeFile(_uri, Buffer.from(generateIndex(name)));
                } catch (error) {
                    vscode.window.showInformationMessage(error.message);
                }

                //Create the view component
                try {
                    let _uri = vscode.Uri.file(`${newUri.path}/${name}View.tsx`);
                    await vscode.workspace.fs.writeFile(_uri, Buffer.from(
                        generateContentView(name, slug, reactType)
                    ));
                } catch (error) {
                    vscode.window.showInformationMessage(error.message);
                }

                //Create the container component
                try {
                    let _uri = vscode.Uri.file(`${newUri.path}/${name}Container.tsx`);
                    await vscode.workspace.fs.writeFile(_uri, Buffer.from(
                        generateContentContainer(name)
                    ));
                } catch (error) {
                    vscode.window.showInformationMessage(error.message);
                }

                if (reactType === 'React') {
                    //Create style.scss
                    try {
                        let _uri = vscode.Uri.file(`${newUri.path}/${slug}.scss`);
                        let content = `.${slug}{}`;
                        await vscode.workspace.fs.writeFile(_uri, Buffer.from(content));
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
