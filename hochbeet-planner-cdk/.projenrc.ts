import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.89.0',
  defaultReleaseBranch: 'main',
  name: 'hochbeet-planner-cdk',
  projenrcTs: true,
  minNodeVersion: '18.0.0',
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.addDeps('@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb');
project.addDevDeps('@types/aws-lambda', 'aws-lambda');
project.synth();