import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AngularAppDeployment } from './angular-app-deployment';
import { BackendStackStateful } from './backend-stack-stateful';
import { BackendStackStateless } from './backend-stack-stateless';

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    new AngularAppDeployment(this, 'angular-app-deployment', {
      buildConfiguration: 'production',
      relativeAngularPath: '../frontend',
    });
  }
}


// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

// new FrontendStack(app, 'hochbeet-planner-frontend', { env: devEnv, stackName: 'HochbeetPlanner-Frontend' });
const backendStateful = new BackendStackStateful(app, 'hochbeet-planner-backend-stateful', { env: devEnv, stackName: 'HochbeetPlanner-Backend-Stateful' });
new BackendStackStateless(app, 'hochbeet-planner-backend-stateless', { env: devEnv, stackName: 'HochbeetPlanner-Backend-Stateless', plantsTable: backendStateful.plantsTable });
// new MyStack(app, 'hochbeet-planner-cdk-prod', { env: prodEnv });

app.synth();