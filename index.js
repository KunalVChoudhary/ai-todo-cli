import { db } from "./db/index.js";
import { todosTable } from "./db/schema.js";
import { ilike, eq } from "drizzle-orm";
import {Groq  } from "groq-sdk"
import readlineSync from 'readline-sync'


//tools
async function getAllTodos(){
    const todo = await db.select().from(todosTable)
    return todo
}

async function createTodo(todo){
    const [result]=await db.insert(todosTable).values({
        todo,
    }).returning(
        {id:todosTable.todo}
    )
    return result.id
}

async function deleteTodo(id){
    await db.delete(todosTable).where(eq(todosTable.id,id))
}

async function searchTodo(search){
    const todo = await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${search}%`))

    return todo
}

//ai
const API_KEY= process.env.API_KEY
const groq = new Groq({ apiKey: API_KEY });

const SYSTEM_PROMPT = `
You are an AI To-Do List Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observations

You can manage tasks by adding, viewing, updating, and deleting them.
You must strictly follow the JSON output format.

Todo DB schema:
- id: Int and Primary Key
- todo: String
- createdAt: Date Time
- updatedAt: Date Time

Available Tools:
- getAllTodos(): Returns all the Todos from Database
- createTodo(todo: string): Creates a new Todo in the DB and takes todo as a string and returns the ID of created todo
- deleteTodo(id: string): Deleted the todo by ID given in the DB
- searchTodo(query: string): Searches for all todos matching teh query string using ilike operator in db

Example:
START
{ "type": "user", "user": "Add a task for shopping groceries." }
{ "type": "plan", "plan": "I will try to get more context on what user needs to shop." }
{ "type": "output", "output": "Can you tell me what all items you want to shop for?" }
{ "type": "user", "user": "I want to shop for milk, kurkure, lays and choco." }
{ "type": "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{ "type": "action", "function": "createTodo", "input": "Shopping for milk, kurkure, lays and choco." }
{ "type": "observation", "observation": "2" }
{ "type": "output:, "output"::Your todo has been added successfully}
`

const tools={
    getAllTodos,
    createTodo,
    deleteTodo,
    searchTodo,
}

const message=[
    {
        role:'system',
        content:SYSTEM_PROMPT
    },]

while (true){
    const query=readlineSync.question('>>')
    const q={
        type:'user',
        user:query
    }
    message.push({
        role:'user',
        content:JSON.stringify(query)
    })

    while(true){
        const chat=await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            tool_choice:'auto',
            response_format:{type:'json_object'},
            messages:message
        })
        const result=chat.choices[0].message.content
        message.push({
            role:'assistant',
            content:result
        })

        const call = JSON.parse(result)
        if(call.type=='output'){
            console.log(call.output);
            break
        }else if (call.type=='action'){
            const fn=tools[call.function]
            if (!fn) throw new Error('Invalid tool call')
            const observation=await fn(call.input)
            const obs = {"type":'observation',"observation":observation}
            message.push({role:'assistant',content:JSON.stringify(obs )})

        }}

}