pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
                echo 'Workspace cleaned'
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
                junit 'junit.xml'
            }
        }

        stage('Static Analysis - SonarQube') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh 'npx sonar-scanner'
                }
            }
        }

        stage('Build & Push Docker Image') {
            environment {
                IMAGE_TAG = "${GIT_COMMIT}"
                IMAGE_NAME = "ghcr.io/aroushq1/pong-ai-game/my-node-app:${GIT_COMMIT}"
            }
            steps {
                script {
                    sh '''
                        echo "Building Docker image..."
                        docker build -t $IMAGE_NAME .
                        
                        echo "Logging in to GitHub Container Registry..."
                        echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin
                        
                        echo "Pushing image..."
                        docker push $IMAGE_NAME
                    '''
                }
            }
        }

        stage('Deploy to Codespace') {
            steps {
                script {
                    sh '''
                        echo "[Deploy] Stopping old container if running..."
                        docker stop pong-ai-container || true
                        docker rm pong-ai-container || true

                        echo "[Deploy] Pulling latest image for commit..."
                        docker pull ghcr.io/aroushq1/pong-ai-game/my-node-app:$GIT_COMMIT

                        echo "[Deploy] Running updated container..."
                        docker run -d --name pong-ai-container -p 3000:3000 ghcr.io/aroushq1/pong-ai-game/my-node-app:$GIT_COMMIT
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
