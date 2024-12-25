pipeline {
    agent any
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
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                git url: 'https://github.com/yaryaraldebaran/wdio-cucumber', credentialsId: '56886b6a-2044-4bea-8434-b13331da1fd9', branch: 'main'
            }
        }
        stage('Clean up Docker') {
            steps {
                bat 'docker-compose down --remove-orphans || exit 0'
            }
        }
        stage('Run Tests') {
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
                    
                    bat """
                        docker-compose run -e FEATURE_TAG='${cucumberTag}' wdio
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                    def reportDir = "${PROJECT_DIR}/allure-results"
                    if (fileExists(reportDir)) {
                        archiveArtifacts artifacts: "${reportDir}/**/*", allowEmptyArchive: true
                    } else {
                        echo "No reports found to archive."
                    }
                }
            echo 'Cleaning up Docker Compose resources...'
            bat 'docker-compose down'
        }
        success {
            echo 'Tests completed successfully!'
        }
        failure {
            echo 'Tests failed.'
        }
    }
}
