pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
                echo "Workspace cleaned"
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Test Coverage Report') {
            steps {
                junit 'test-results/junit.xml'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
