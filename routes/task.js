import express from 'express'
import { createNewTask, deleteATask, getAllTasks, updateTask } from '../controllers/task.js'
import { isAuthenticated } from '../middleware/auth.js'


const router = express.Router()

// create a new task
router.post('/new', isAuthenticated, createNewTask)

// get all user tasks
router.get('/all',isAuthenticated, getAllTasks )

// update a task
router.put('/update/:id', isAuthenticated, updateTask)

// delete a task
router.delete('/delete/:id', isAuthenticated, deleteATask)

export default router