pipeline {
    agent none  // No default agent for the pipeline
    parameters {
        choice(
            name: 'FEATURE_TAG',
            choices: [
                '@HotelFeature', 
                '@FlightFeature', 
                '@BusFeature', 
                '@SchoolFeature'
            ],
            description: 'Pilih fitur yang ingin dijalankan untuk testing'
        )
    }
    environment {
        GIT_CREDENTIALS = credentials('56886b6a-2044-4bea-8434-b13331da1fd9')
        DOCKER_IMAGE = 'wdio-cucumber:latest'
        ALLURE_RESULTS = 'allure-results'
        PROJECT_DIR = 'C:/Users/Ahyar/Documents/website automation proj/webdriverio-cucumber-2'
        CUSTOM_WORKSPACE = 'C:/Users/Ahyar/Documents/jenkins_workspace'
    }
    stages {
        stage('Checkout') {
            agent any  // Use any available agent
            steps {
                script {
                    // Switch to custom workspace before running git checkout
                    dir("${CUSTOM_WORKSPACE}") {
                        deleteDir()  // Clean up the workspace
                        git url: 'https://github.com/yaryaraldebaran/wdio-cucumber', credentialsId: '56886b6a-2044-4bea-8434-b13331da1fd9', branch: 'main'
                    }
                }
            }
        }
        stage('Clean up Docker') {
            agent any  // Use any available agent
            steps {
                script {
                    // Run docker-compose in the custom workspace
                    dir("${CUSTOM_WORKSPACE}") {
                        bat 'docker-compose down --remove-orphans || exit 0'
                    }
                }
            }
        }
        stage('Run Tests') {
            agent any  // Use any available agent
            steps {
                echo 'Running tests with Docker Compose...'
                script {
                    def FEATURE_DESCRIPTION_MAP = [
                        '@HotelFeature'  : 'Fitur Hotel',
                        '@FlightFeature' : 'Fitur Tiket Pesawat',
                        '@BusFeature'    : 'Fitur Bus',
                        '@SchoolFeature' : 'Fitur Sekolah'
                    ]
                    
                    def cucumberTag = params.FEATURE_TAG
                    def featureDescription = FEATURE_DESCRIPTION_MAP[cucumberTag]

                    echo "Running tests for: ${featureDescription} with tag: ${cucumberTag}"
                    
                    // Run docker-compose in the custom workspace
                    dir("${CUSTOM_WORKSPACE}") {
                        bat """
                            docker-compose -f docker-compose.yml run -v ${CUSTOM_WORKSPACE}:/app wdio
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                // Cleanup Docker Compose resources directly without using node
                echo 'Cleaning up Docker Compose resources...'
                dir("${CUSTOM_WORKSPACE}") {
                    bat 'docker-compose down'
                }
            }
            script {
                def reportDir = "${PROJECT_DIR}/allure-results"
                if (fileExists(reportDir)) {
                    archiveArtifacts artifacts: "${reportDir}/**/*", allowEmptyArchive: true
                } else {
                    echo "No reports found to archive."
                }
            }
        }
        success {
            echo 'Tests completed successfully!'
        }
        failure {
            echo 'Tests failed.'
        }
    }
}
