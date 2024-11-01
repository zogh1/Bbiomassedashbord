
pipeline {
    agent any
    
    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the code from GitHub
                git  branch: 'main', url: 'https://github.com/zogh1/biomassedashbord_wassim.git', credentialsId: 'git-cred'
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
