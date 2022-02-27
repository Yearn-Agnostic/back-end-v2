pipeline {
  options {
    disableConcurrentBuilds();
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '1', numToKeepStr: '1'));
  }
  agent any
  environment {
    PRIVATE_KEY = credentials('PRIVATE_KEY_FROM_JENKINS')
  }
  stages {
    stage('env') {
            steps {
                sshPublisher(
                    continueOnError: false, 
                    failOnError: true,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'yearnAgnostic',
                            transfers: [
                             sshTransfer(cleanRemote: false, remoteDirectory: 'yagnostic.backend/${BUILD_TAG}', sourceFiles: ''' docker-compose.yml, docker-compose.yearnagnostic.io.yml, yarn.lock, .env, packages/, package.json, ''',execCommand: "sed -i \'s/PRIVATE_KEY_SECRET/${PRIVATE_KEY}/g\' /home/jenkins-www/yagnostic.backend/${BUILD_TAG}/packages/yagnostic-api/config/production.json; sed -i \'s/PRIVATE_KEY_SECRET/${PRIVATE_KEY}/g\' /home/jenkins-www/yagnostic.backend/${BUILD_TAG}/packages/yagnostic-api/config/default.json", execTimeout: 1200000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectorySDF: false, removePrefix: '')
                            ],
                            usePromotionTimestamp: false,
                            useWorkspaceInPromotion: false,
                            verbose: true
                        )
                    ]
                )
            }
    }
    stage('Deploy') {
          steps {
            //https://www.jenkins.io/doc/pipeline/steps/publish-over-ssh/
            sshPublisher(
              failOnError: true,
              publishers: [
                sshPublisherDesc(
                  configName: 'yearnAgnostic',
                  transfers: [
                    sshTransfer(
                        cleanRemote: false,
                        remoteDirectory: 'yagnostic.backend/${BUILD_TAG}',
                        execCommand: '''
                        set -e
                        set -x
                        BUILD=${BUILD_TAG}
                        SRC=/home/jenkins-www/yagnostic.backend
                        WWW=/var/www/yagnostic.backend
                        cd ${SRC}/${BUILD}/
                        COMPOSE_PROJECT_NAME=yearnagnostic-io COMPOSE_FILE=docker-compose.yml:docker-compose.yearnagnostic.io.yml docker-compose config > stack.yml
                        sudo /usr/local/bin/docker-compose -f stack.yml build
                        DEST=${WWW}/stack.yml
                        rm -f ${DEST}
                        ln -s -f -d ${SRC}/${BUILD}/stack.yml ${DEST}
                        cd ${WWW}
                        sudo /usr/bin/docker stack deploy -c stack.yml yearnagnostic-io
                        docker service update --force yearnagnostic-io_api
                        for i in `ls -d ${SRC}/* | grep -v "${BUILD}$"`;do rm -rf  "${i}"; done
                        ''',
                        execTimeout: 1200000,
                        flatten: false,
                        makeEmptyDirs: false,
                        noDefaultExcludes: false,
                        patternSeparator: '[, ]+',
                        remoteDirectorySDF: false,
                        removePrefix: ''
                      )
                  ],
                  usePromotionTimestamp: false,
                  useWorkspaceInPromotion: false,
                  verbose: true
                )
              ]
            )
          }
        }
  } // stages {
}
