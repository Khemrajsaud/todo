
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET(req) {
  await connectDB();
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(todos), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch todos" }), { status: 500 });
  }
}

export async function POST(req) {
  await connectDB
  try {
    const { title, description, status } = await req.json();
    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
    }

    const todo = await Todo.create({ title, description, status });
    return new Response(JSON.stringify(todo), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create todo" }), { status: 500 });
  }
}
