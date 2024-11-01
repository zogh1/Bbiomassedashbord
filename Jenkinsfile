
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
                   
                    def dockerImage=docker.build("zoghlami19/devops-node:latest","-f backend/Dockerfile backend")
                }
            }
        }
        

        stage('Build Docker Image (Front)') {
            steps {
                script {
                    
                    def dockerImage = docker.build("zoghlami19/devops-frontend:latest", "-f \"front/Cebb Dashbord/Dockerfile\" \"front/Cebb Dashbord/\"")
                }
            }
        }

         stage('Push Docker Image to DockerHub') {
            steps {
                script {
                     docker.withRegistry('https://index.docker.io/v1/', 'docker-cred') {
                       docker.image("zoghlami19/devops-frontend:latest").push()
                         docker.image("zoghlami19/devops-node:latest").push()
            }
                    // withCredentials([string(credentialsId: 'docker-cred', variable: 'dockerpwd')]) {
                    //     bat '''
                       
                    //     docker push zoghlami19/devops-node:latest
                    //     docker push zoghlami19/devops-frontend:latest
                    //     '''
                    // }
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
