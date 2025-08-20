## FOR PRODUCTION : 

# SCRIPT : 

     "scripts": {
        "build": "tsc", 
        "start": "node ./src/dist/main/main.js"  
                
    },

MONGODB_URI="mongodb+srv://varunjoshi426:jhux8l2uvv9Ifgz5@joshi-cluster.vcvph4o.mongodb.net/TalksGram?retryWrites=true&w=majority&appName=JOSHI-CLUSTER
"

# npm run build
# npm start

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

## FOR DEVLOPEMENT : 

    "scripts": {
        "start": "nodemon src/main/main.ts"  
        
    },

MONGODB_URI="mongodb://127.0.0.1:27017/TalksGram?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.2"

# npm start