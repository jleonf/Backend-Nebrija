import { getQuery } from "https://deno.land/x/oak@v11.0.0/helpers.ts";
import { 
    Application,
    Router,
    helpers,
 } from "https://deno.land/x/oak@v11.1.0/mod.ts";

//Types statements
type User = {
    name: string,
    surname: string,
    tlf: number,
    email: string,
    dni: string,
    id: string,
    iban: string,
    transaction?:Transaction[]
};

type Transaction = {
    id_sender: string,
    id_receiver: string,
    amount: string
};

//random integer generator -> to create the iban number
const getRandomInt = (max: number):number => {
    return Math.floor(Math.random() * max);
}
//iban generator
const createIban = (n: number) => {
    let a = 0;
    let iban = "";
    while(a < n){
        iban = iban + String(getRandomInt(9));
        a++;
    }
    return iban;
}
//check that the iban is not repeated
const checkIban = (iban1: string, iban2: string):boolean => {
    if(iban1 === iban2) return true;
    else return false;
}
//Initializing the list of users
let users :User[] = [
    {
        name: "javier",
        surname: "leon",
        tlf: 678901432,
        email: "javier@gmail.com",
        dni:"12345678E",
        id: "1",
        iban: "JA98123456789012345667",
        transaction: [
            {
                id_sender: "1",
                id_receiver: "2",
                amount: "3000"
            }
        ]
    },
    {
        name: "cristiano",
        surname: "ronaldo",
        tlf: 623190426,
        email: "cristiano@gmail.com",
        dni:"34926509P",
        id: "2",
        iban: "CR98940367256910284637",
    }
];

const router = new Router();

router
    //get all users
    .get("/users", (context) => {
        context.response.body = users;
        context.response.status = 200;
    })
    //get user by email
    .get("/users/:email", (context) => {
        const params = getQuery(context, { mergeParams: true });
        if (context.params?.email) {
            const user: User | undefined = users.find(
                (user) => user.email === context.params.email
            );

            if (user) {
                context.response.body = user;
                return;
              }
        } 
        context.response.body = "NOT FOUND"
        context.response.status = 404;
    })
    //add user
    .post("/users", async (context) => {
        const result = context.request.body({ type: "json"});
        const value = await result.value;
        let iban = "";
        if(!value?.name || !value?.surname || !value?.tlf || !value?.email || !value?.dni) {
            context.response.status = 404;
            return;
        }
        do {
            iban = value.name.toUpperCase().charAt(0) + value.name.toUpperCase().charAt(1) + createIban(18);
        } while (users.find(user => user.iban === iban));

        const user: User = {
            name: value.name,
            surname: value.surname,
            tlf: value.tlf,
            email: value.email,
            dni: value.dni,
            id: (users.length + 1).toString(),
            iban: iban,
        };
        users.push(user);
        context.response.status = 200;
        context.response.body = user;
    })
    //add transaction
    .put("/users/transaction", async (context) => {
        const result = context.request.body({ type: "json"});
        const value = await result.value;

        if(!value?.id_sender || !value?.id_receiver || !value?.amount) {
            context.response.status = 404;
            return;
        }
        const newTransaction: Transaction = {
            id_sender: value.id_sender,
            id_receiver: value.id_receiver,
            amount: value.amount
        }
        //the transaction is added to the sender user (otherwise the information would be confuse)
        users.forEach( (user: User) => {
            if(user.id === newTransaction.id_sender){
                parseInt(value.id_sender)
                if(user.transaction){
                    user.transaction.push(newTransaction);
                }
                else{
                    user.transaction = [];
                    user.transaction.push(newTransaction);
                }
            }
        })
        context.response.status = 200;
        context.response.body = newTransaction;
    })
    //delete user by email
    .delete("/users/:email", (context) => {
        if (context.params?.email && users.find((user) => user.email === context.params.email)
        ){
            users = users.filter((user) => user.email !== context.params.email);
            context.response.body = "The user " + context.params.email + " has been deleted";
            context.response.status = 200;
            return;
        }
        context.response.status = 404;
    });
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });