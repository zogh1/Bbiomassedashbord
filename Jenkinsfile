
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
                  
                    withCredentials([string(credentialsId: 'docker-cred', variable: 'dockerpwd')]) {
                        bat '''
                        docker login -u zoghlami19 -p dckr_pat_3TuStXc_EYKdsB8vvv5WMvFo3Ug

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
                     catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
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
    
    
}
