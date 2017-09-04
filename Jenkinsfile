#!/usr/bin/env groovy

@Library("utils")

import io.ctek.jenkins.v3.node.NodeComponentBuild

def component = new NodeComponentBuild(this)

if(BRANCH_NAME != "master") {
  node {
    component.build "prepare:dist";
    component.release();
    component.upload();
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

        component.build "prepare:dist";
        component.release "${env.RELEASE_TYPE}";
        component.upload();
      }
    }
  }

}
