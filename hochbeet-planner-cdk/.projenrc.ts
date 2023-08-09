import { awscdk } from 'projen';
import { LambdaRuntime } from 'projen/lib/awscdk';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.89.0',
  defaultReleaseBranch: 'main',
  name: 'hochbeet-planner-cdk',
  projenrcTs: true,
  minNodeVersion: '18.17.0',
  lambdaOptions: { runtime: LambdaRuntime.NODEJS_18_X },
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.addDeps('@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb', 'aws-lambda', '@aws-lambda-powertools/logger');
project.addDevDeps('@types/aws-lambda');
project.synth();