


ipeline {
    agent any


    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
                echo " Workspace cleaned before build"
            }
        }

        stage('Checkout') {
            steps {
                git url: 'https://github.com/aroushq1/ENSF400Project.git', branch: 'handleJenkins'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        // stage('Static Code Analysis') {
        //     steps {
        //         sh 'sonar-scanner'
        //     }
        // }

        stage('Run Tests') { // Runs the tests defined by/in package.json
            steps {
                sh 'npm test' 
            }
        }

        stage('Test Coverage Report') {
            steps {
                sh 'npm run coverage' //  Generate test coverage report.. saw this online somewhere
            }
        }
    }

    post {
        always {
            junit '**/test-results.xml' // Publish test results (JUnit stuff)
        }
        failure {
            echo 'Tests failed! Check the logs.'
        }
    }
}
