
pipeline {
    agent any
    
    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the code from GitHub
                git  branch: 'main', url: 'https://github.com/zogh1/biomassedashbord_wassim.git', credentialsId: 'git-cred'
            }
        }
        
        
        
        stage('Build Docker Image (Back)') {
            steps {
                script {
                    sh 'sudo chmod 666 /var/run/docker.sock'
                    def dockerImage=docker.build("zoghlami19/devops-node:latest")
                }
            }
        }

        stage('Build Docker Image (Front)') {
            steps {
                script {
                    sh 'sudo chmod 666 /var/run/docker.sock'
                    def dockerImage=docker.build("zoghlami19/devops-frontend:latest")
                }
            }
        }

         stage('Push Docker Image to DockerHub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-cred', variable: 'dockerpwd')]) {
                        sh '''
                        docker login -u zoghlami19 -p "$dockerpwd"
                        docker push zoghlami19/devops-node:latest
                        docker push zoghlami19/devops-frontend:latest
                        '''
                    }
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    // Change to the directory containing your docker-compose.yml file
                    dir('path/to/your/docker-compose-directory') {
                        // Run the docker-compose command
                        bat 'docker-compose up -d'
                    }
                }
            }
        }

        
    }
    
    
}
