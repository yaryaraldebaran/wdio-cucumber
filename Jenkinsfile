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
        DOCKER_IMAGE = 'wdio-cucumber_3:latest'
        CUSTOM_WORKSPACE = 'C:/Users/Ahyar/Documents/jenkins_workspace'
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    dir(env.CUSTOM_WORKSPACE) {
                        deleteDir()
                        git url: 'https://github.com/yaryaraldebaran/wdio-cucumber', 
                            credentialsId: env.GIT_CREDENTIALS, 
                            branch: 'main'
                    }
                }
            }
        }
        stage('Install Dependencies Locally') {
            steps {
                script {
                    dir(env.CUSTOM_WORKSPACE) {
                        bat 'npm install'
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    def FEATURE_DESCRIPTION_MAP = [
                        '@HotelFeature'  : 'Fitur Hotel',
                        '@FlightFeature' : 'Fitur Tiket Pesawat',
                        '@BusFeature'    : 'Fitur Bus',
                        '@SchoolFeature' : 'Fitur Sekolah'
                    ]
                    
                    def cucumberTag = params.FEATURE_TAG ?: '@defaultTag'
                    def featureDescription = FEATURE_DESCRIPTION_MAP[cucumberTag]

                    echo "Running tests for: ${featureDescription} with tag: ${cucumberTag}"
                    bat """
                        docker-compose -f docker-compose.yml run \
                        -e FEATURE_TAG=${cucumberTag} wdio
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                echo 'Cleaning up Docker Compose resources...'
                bat 'docker-compose -f docker-compose.yml down'
            }
        }
        success {
            script {
                echo 'Copying Allure results from container to workspace...'
                
                // Copy Allure results from the container to Jenkins workspace
                bat 'docker cp wdio:/app/allure-results C:/Users/Ahyar/Documents/jenkins_workspace/allure-results'
                
                echo 'Generating Allure report...'
                // Generate Allure report
                bat 'allure generate allure-results --clean -o allure-report'
                
                // Publish Allure report
                allure([
                    reportBuildPolicy: 'ALWAYS',
                    reportFiles: '**/allure-report/**/*',
                    allowEmptyResults: true
                ])
            }
        }
        failure {
            script {
                echo 'Test failed, generating Allure report...'
                // You can choose to generate reports even on failure if necessary
                bat 'allure generate allure-results --clean -o allure-report'
            }
        }
    }
}
