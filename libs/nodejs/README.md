## this is just a placeholder to store node_modules during bundling app
- This folder will be copied into `/opt/` on aws lambda server. Aws Lambda already added `/opt/nodejs` folder to NODE_PATH so that all packages inside this folder will be available to be imported into lambda function code.

## the package.json at the root folder will be copied into this folder
