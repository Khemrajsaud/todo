
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const todo = await Todo.findById(params.id);
    if (!todo) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(todo), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error fetching todo" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const data = await req.json();
    const todo = await Todo.findByIdAndUpdate(params.id, data, { new: true });
    return new Response(JSON.stringify(todo), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error updating todo" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await Todo.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error deleting todo" }), { status: 500 });
  }
}
