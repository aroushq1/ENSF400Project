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
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('SonarQubeServer') {
                        sh '''
                            npx sonar-scanner \
                                -Dsonar.login=$SONAR_TOKEN \
                                -Dsonar.host.url=http://sonarqube:9000
                        '''
                    }
                }
            }
        }

        stage('Security Analysis - OWASP DependencyCheck') {
            steps {
                sh '''
                    echo "Downloading OWASP DependencyCheck..."
                    curl -L -o dependency-check.zip https://github.com/jeremylong/DependencyCheck/releases/download/v8.4.0/dependency-check-8.4.0-release.zip
                    unzip -oq dependency-check.zip
                    chmod +x dependency-check/bin/dependency-check.sh

                    echo "Running Dependency Check..."
                    ./dependency-check/bin/dependency-check.sh --project "Pong-AI" --scan . --format "HTML" --out dependency-check-report --disableAssembly --disableYarnAudit
                '''
            }
        }

        stage('Build & Push Docker Image') {
            environment {
                IMAGE_TAG = "${GIT_COMMIT}"
                IMAGE_NAME = "ghcr.io/aroushq1/pong-ai-game/my-node-app:${GIT_COMMIT}"
            }
            steps {
                script {
                    sh "echo 'Building Docker image...'"
                    sh "docker build -t $IMAGE_NAME ."

                    withCredentials([usernamePassword(credentialsId: 'ghcr-creds', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_TOKEN')]) {
                        sh """
                            echo "Logging in to GitHub Container Registry..."
                            echo \$GHCR_TOKEN | docker login ghcr.io -u \$GHCR_USER --password-stdin

                            echo "Pushing image..."
                            docker push $IMAGE_NAME
                        """
                    }
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
