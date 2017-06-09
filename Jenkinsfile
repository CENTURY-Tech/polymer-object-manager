#!/usr/bin/env groovy

@Library("utils")

import io.ctek.jenkins.v2.node.NodeComponentBuild

def component = new NodeComponentBuild(this)

if(BRANCH_NAME != "master") {
  node {
    component.build "build-dev --branch ${BRANCH_NAME}";
    component.release "release-dev --branch ${BRANCH_NAME}";
    component.upload();
    component.updateBuildName();
  }
}
else {

  stage("Release Type") {

    def isReleaseTypeSpecified = false;
    def releaseType;

    try {
      timeout(time:5, unit:'MINUTES') {
        env.RELEASE_TYPE = input (
          message: 'Release Type',
          id: "releaseType",
          parameters: [
            choice(
              choices: "patch\nminor\nmajor\n",
              description: 'Specifies the release type',
              name: 'RELEASE_TYPE'
            )
          ]
        )
        isReleaseTypeSpecified = true;
      }
    } catch(err) {
      echo("No Release Type Specified.");
    }

    if(isReleaseTypeSpecified) {
      node {
        echo("Releasing with type: ${env.RELEASE_TYPE}");

        component.build "build-prod  --bump ${env.RELEASE_TYPE}";
        component.release "release-prod";
        component.upload();
        component.updateBuildName();
      }
    }
  }

}
