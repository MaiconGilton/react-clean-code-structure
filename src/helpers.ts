function parseComponentName(componentName: string) {
    componentName = componentName?.trim().charAt(0).toUpperCase() + componentName?.slice(1);
    componentName = componentName.replace(/ /g, '-');
    return { name: componentName, slug: componentName.toLowerCase() };
}

function generateIndex(name: string) {
    let content = [
        `import ${name} from './${name}Container'`,
        `export default ${name}`,
    ];
    return content.join('\n');
}

function generateContentView(name: string, slug: string, stack: string) {
    let content;

    if (stack === 'React') {
        content = [
            `import React from 'react';`,
            `import './${slug}.scss';\n`,
            `import {I${name}ViewProps} from './${name}Container';\n`,
            `const ${name}View = (props: I${name}ViewProps) => {`,
            `   const { } = props\n`,
            `   return (`,
            `   <div className='${slug}'>\n`,
            `   </div>`,
            `   )`,
            `} \n`,
            `${name}View.defaultProps = {\n`,
            `} \n`,
            `export default ${name}View;\n`
        ];

    } else {
        content = [
            `import React from 'react';`,
            `import { View, StyleSheet } from 'react-native';`,
            `import {I${name}ViewProps} from './${name}Container';\n`,
            `const ${name}View = (props: I${name}ViewProps) => {`,
            `   const { } = props\n`,
            `   return (`,
            `   <View style={styles.container}>\n`,
            `   </View>`,
            `   )`,
            `} \n`,
            `${name}View.defaultProps = {\n`,
            `} \n`,
            `export default ${name}View;\n`,
            `const styles = StyleSheet.create({`,
            `   container: {`,
            `   }`,
            `});\n`
        ];
    }

    return content.join('\n');
}

function generateContentContainer(name: string) {
    let content = [
        `import React from 'react';`,
        `import ${name}View from './${name}View';\n`,
        `interface I${name}ContainerProps {`,
        `}\n`,
        `export interface I${name}ViewProps {`,
        `}\n`,
        `const ${name}Container=(props: I${name}ContainerProps) => {`,
        `   const { } = props\n`,
        `   const passProps: I${name}ViewProps = {\n`,
        `   }\n`,
        `   return <${name}View {...passProps}/>`,
        `} \n`,
        `${name}Container.defaultProps = {\n`,
        `} \n`,
        `export default ${name}Container;\n`
    ];

    return content.join('\n');
}

export {
    parseComponentName,
    generateIndex,
    generateContentView,
    generateContentContainer
};