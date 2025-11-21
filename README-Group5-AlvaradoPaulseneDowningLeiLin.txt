# Classroom_Communication_Aide
1. You need to be in the folder that have all our project code. 

2. You need to download the dependencies by cd to backend and frontend, and type `npm install`

3. Create a file called ".env" on backend folder and paste the following:
PORT=5100
SUPABASE_URL=https://gzhbapdfvphkczwyttha.supabase.co
SUPABASE_SECRET_KEY=sb_secret_f0Gs3lrjANKNGc7QF9nppw_eluOLpmb
JWT_SECRET=32khwk3j52q3214h2jk3j42hkv3fkg3dhdvjlcrkhk45knr5
AZURE_TRANSLATE_KEY=2XfGEu3LsNGVbKqFeSx466g3cPpNhnlymfz5x0em2iQPn3CAHZd7JQQJ99BJAC8vTInXJ3w3AAAbACOGzh4t
AZURE_LOCATION=westus2 

4. Create a file called ".env" on frontend folder and paste the following:
VITE_API_BASE_URL=http://localhost:5100

5. Run the actual website:
5.1 On one terminal enter: cd src/backend && node server.js
5.2 On a seperate one enter: cd src/frontend && npm run dev  

Notes:
Need to have Node js downloaded to run our code.
