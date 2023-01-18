# Scenario 
Accessing un-verified web-pages without proper isolation can expose your environment to different types of risks.</br>
Deploy a headless browser inside a docker file to query websites from an isolated environment can be more secure for your environemnt.</br>

# Web-Sandbox
Node.js HTTPs server to create HTTP requests the website from a secure docker envrionment.</br>
Easy to deploy and to use, configure your own authorization key to query your server. </br>

# Setup
In order to initalize the docker you need to do the following setup:</br>

1. openssl genrsa -out key.pem </br>
2. openssl req -new -key key.pem -out csr.pem</br>
3. openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem</br>
4. Modify auth-header in app.js</br>
5. Modify auth-value in app.js</br>
6. docker-compose up </br>
7. Modify client.py and change auth-header and auth-value</br>


