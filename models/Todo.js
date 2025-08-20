import mongoose, { mongo }  from "mongoose";

const TodoSchema = new mongoose.Schema({

    title: String,
    description: String,
    status: {type:String, default: "pending"}




})

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);