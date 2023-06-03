import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Task } from "../models/tasks.js";
import ErrorHandler from "../utils/errorHandler.js";

// create a new task
export const createNewTask = catchAsyncError(async (req, res, next) => {
  // check whether the task has already been created by the user
  const { title } = req.body;
  const { _id } = req.user;
  let task = await Task.findOne({ title, user: _id });
  if (task) return next(new ErrorHandler("Task already exists", 400));

  // create a new task
  task = await Task.create({ ...req.body, user: _id });

  // send the res along with the task
  res.status(201).json({
    success: true,
    message: "The task has been created successfully!",
    task,
  });
});

// get all user tasks
export const getAllTasks = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const tasks = await Task.find({ user: _id });
  res.status(200).json({
    success: true,
    tasks,
  });
});

// update a task
export const updateTask = catchAsyncError(async (req, res, next) => {
  // check whether the task exist or not
  const { id } = req.params;
  let task = await Task.findById(id);
  if (!task) return next(new ErrorHandler("Not task exist", 404));

  // update the task
  task = await Task.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true } // updated task will be returned. See the docs.
  );

  // send the res along with the updated task
  res.status(201).json({
    success: true,
    message: `The task ${task.title} has been updated successfully!`,
    task,
  });
});

// delete a user task
export const deleteATask = catchAsyncError(async (req, res, next) => {
  // check whether the task exist or not
  const { id } = req.params;
  let task = await Task.findById(id);
  if (!task) return next(new ErrorHandler("The task does not exist", 404));

  // delete the task
  task = await Task.findByIdAndDelete(id);

  // send the res along with the deleted task name
  res.status(200).json({
    success: true,
    message: `${task.title} has been deleted successfully!`,
  });
});
