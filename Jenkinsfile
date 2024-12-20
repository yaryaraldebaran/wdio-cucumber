pipeline {
    agent any
    parameters {
        choice(
            name: 'FEATURE_TAG',
            choices: ['@HotelFeature', '@FlightFeature'],
            description: 'Pilih fitur yang ingin dijalankan untuk testing',
            mapping: [
                '@HotelFeature': 'Fitur Hotel',  // Menampilkan "Fitur Hotel" tetapi menyimpan nilai "@HotelFeature"
                '@FlightFeature': 'Fitur Tiket Pesawat'  // Menampilkan "Fitur Tiket Pesawat" tetapi menyimpan nilai "@FlightFeature"
            ]
        )
    }
    environment {
        GIT_CREDENTIALS = credentials('56886b6a-2044-4bea-8434-b13331da1fd9')  // Nama ID kredensial yang telah Anda simpan di Jenkins
        DOCKER_IMAGE = 'wdio-cucumber:latest'
        ALLURE_RESULTS = 'allure-results'
        PROJECT_DIR = 'C:/Users/Ahyar/Documents/website automation proj/webdriverio-cucumber-2'
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout kode dari GitHub menggunakan kredensial yang aman
                git url: 'https://github.com/username/my-project.git', credentialsId: '56886b6a-2044-4bea-8434-b13331da1fd9', branch: 'main'
            }
        }
        stage('Run Tests') {
            steps {
                echo 'Running tests with Docker Compose...'
                script {
                    // Mendapatkan tag yang dipilih dari parameter
                    def cucumberTag = params.FEATURE_TAG
                    echo "Running tests with tag: ${cucumberTag}"

                    // Menjalankan Docker Compose dengan tag yang dipilih
                    bat """
                        cd ${PROJECT_DIR} && 
                        docker-compose run -e FEATURE_TAG='${cucumberTag}' wdio
                    """
                }
            }
        }
        stage('Archive Reports') {
            steps {
                echo 'Archiving test reports...'
                script {
                    def reportDir = "${PROJECT_DIR}/allure-results"
                    if (fileExists(reportDir)) {
                        archiveArtifacts artifacts: "${reportDir}/**/*", allowEmptyArchive: true
                    } else {
                        echo "No reports found to archive."
                    }
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up Docker Compose resources...'
            bat 'docker-compose down'  // Windows
        }
        success {
            echo 'Tests completed successfully!'
        }
        failure {
            echo 'Tests failed.'
        }
    }
}
