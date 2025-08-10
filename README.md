# **WATER QUALITY LABORATORY**
A responsive web-based application, using Machine Learning to analyze and predict water quality index which is based on features of water on the observed rivers such as temperature, pH, DO,...
![WQR LABORATORY](https://github.com/user-attachments/assets/45acb8a1-23a6-4b95-a1b2-5d6879fbf166)
# **Table of content**
 - [1. Technologies](#Technologies)
 - [2. Project Structure](#Project-Structure)
 - [3. Machine Learning Model](#Machine-Learning-Model)
 - [4. Application settings](#Application-settings)
# **Technologies**
| Technology| Used in       |
|-----------|---------------|
| React     | Frontend      |
| Material UI   | Frontend       |
| Node.js   | Backend       |
| Express.js   | Backend       |
| FastAPI   | Backend       |
| MySql   | DBMS      |
| Docker  | Deployment       |
| Railway   | Deployment       |
| Google Colab   | Machine Learning       |
# **Project Structure**
```
WQI_Analysis/
├── AI_Model/
|  ├── main.py
|  ├── model.pkl
|  ├── requirements.txt
|  ├── Dockerfile
|  └── .gitignore
├── backend/
|  ├── analysis/
|      ├── service/
|      ├── controller/
|      ├── route/
|      ├── Dockerfile
|      └── server.js
|  ├── auth_service/
|      ├── service/
|      ├── controller/
|      ├── route/
|      ├── Dockerfile
|      └── server.js
|  ├── chatbot_service/
|      ├── service/
|      ├── controller/
|      ├── route/
|      ├── Dockerfile
|      └── server.js
├── frontend/
|  ├── public/
|      ├── assets/
|      └── index.html
|  ├── src/
|      ├── admin/
|      ├── components/
|      ├── pages/
|      ├── style/
|      ├── utils/
|      ├── App.jsx
|      ├── nginx.conf
|      └── Dockerfile
├── docker-compose.yml
└── .gitignore
```
# **Machine Learning Model**
In this project, there are five machine learning models used to make prediction of WQI (Water Quality Index):
1. CatBoost (Categorical Boosting)
   - Definition: CatBoost is an open-source, high-performance machine learning library developed by Yandex for gradient boosting on decision trees. It's particularly powerful for categorical data, which is where its name comes from: Categorical + Boosting.
   - Google Colab: [CatBoost](https://colab.research.google.com/drive/1t0z36tH-a-1I2btgvUwombMisdzMXBai?usp=sharing)
2. MLP (Multi-Layer Perceptron)
   - Definition: Multilayer Perceptron is a type of artificial neural network that consists of multiple layers of nodes (neurons). It learns complex patterns in data by passing inputs through these layers and adjusting weights using a method called backpropagation.
   - Google Colab: [MLP](https://colab.research.google.com/drive/1F3PZSw5r7JPTny_tPt2wkFf8C4LhQRrk?usp=sharing) 
4. Extra Trees
   - Definition: Extra Trees is an ensemble machine learning algorithm that builds multiple decision trees using randomly selected features and random split points.
   - Google Colab: [Extra Trees](https://colab.research.google.com/drive/1VYTRU13LIkkwdHUQATZaMtQ0-fAC-sPB?usp=sharing)
6. Random Forest
   - Definition: Random Forest is an ensemble learning method that builds multiple decision trees using different random samples of the training data (bagging). The final prediction is made by averaging (regression) or voting (classification) the results of all trees.
   - Google Colab: [Random Forest](https://colab.research.google.com/drive/1xpZY63fJ59NWd6dj9IWroFNnOu-Imp9Q?authuser=2#scrollTo=L-Us4FjjSz-D)
8. XGBoost
   - Definition: XGBoost is a highly efficient and scalable gradient boosting library that builds decision trees sequentially, where each tree tries to correct the errors of the previous one.
   - Google Colab: [XGBoost](https://drive.google.com/file/d/1IuMySq1qHPanBBubMapYQZIuYXkyPZJG/view?usp=sharing)
# **Application settings**
Firtly, clone this project from GitHub.
```
git clone https://github.com/duongCyberclone123/WQI_Analysis
```
## **_Docker Container_**
### *1. Frontend/Client*
Build Docker image for Frontend
```
cd frontend
docker build -t fe:v1 .
```
### *2. Backend/Server*
The backend is built based on a microservices architecture. 
Build Docker image for each service.
At first, touch the backend folder.
```cd backend```
Then touch folder of each services.
#### **Analysis service**
This service is used to fetch observed data which will be sent to client and visualized on UI.
```
cd analysis
docker build -t analysis_service:v1 .
```
#### **Auth service**
This service is used to authorize users.
```
cd auth_service
docker build -t auth_service:v1 .
```
#### **Chatbot service**
This service is used to answer client's questions. This service is based on Gemini.
```
cd chatbot_service
docker build -t chatbot_service:v1 .
```
### *3. AI Model*
This service is used to make prediction based on the data client sends to server.
```
cd AI_Model
docker build -t ai_model:v1 .
```
### *4. Build Docker Container*
Run this command in project level.
```
docker compose up -d
```


