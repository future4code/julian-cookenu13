import dotenv from 'dotenv';
import express from 'express';
import {Request, Response} from 'express';
import { AddressInfo } from 'net';
import { IdGenerator } from './services/IdGenerator';
import { HashManager } from './services/HashManager';
import { UserDataBase } from './data/UserDataBase';
import { Authenticator } from './services/Authenticator';

dotenv.config();

const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
    try {

        if(!req.body.email || req.body.email.indexOf("@") === -1) {
            throw new Error("Invalid email");
        }

        if(!req.body.password || req.body.password.length < 6) {
            throw new Error("Invalid password")
        }

        const userInfos = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        }

        const hashManager = new HashManager();
        const cipherText = await hashManager.hash(userInfos.password);

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const userDb = new UserDataBase();
        await userDb.createUser(
            id, 
            userInfos.email,
            userInfos.name, 
            cipherText,
           );

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({
            id,
        });

        res.status(200).send({
            token,
        })

    } catch(err) {
        res.status(400).send({message: err.message});
    }
})

app.post("/login", async (req:Request, res:Response) =>{
    try{
        if(!req.body.email || req.body.email.indexOf("@") === -1 ){
           throw new Error("Invalid Email :(")

        }

        const useData = {
            email: req.body.email,
            password: req.body.password
        }

        const userDataBase = new UserDataBase() 
        const user = await userDataBase.getByEmail(useData.email)

        const hashManager = new HashManager()
        const compareResult = await hashManager.compare(useData.password, user.password)

        if(!compareResult){
            throw new Error("Invalid Password")
        }

        const authenticator = new Authenticator()
        const token = await authenticator.generateToken({id:user.id})

        res.status(200).send({
            token
        })

    } catch (err){
        res.status(401).send({
            massege: err.massege
        })
    }
})

const server = app.listen(process.env.PORT || 3303, () => {
    if(server) {
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost:${address.port}`)
    } else {
        console.error(`Failure upon starting server.`);
    }
})