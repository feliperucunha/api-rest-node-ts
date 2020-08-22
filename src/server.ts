import express from 'express';

const app  = express();
app.use(express.json());

app.get("/", (req, res) => {
    const users = [
        { name: 'Felipe', }
        
    ]
})

app.listen(3333);