import { Router } from 'express'
import { getIndexView } from '../controllers/indexController.js'

const indexRouter = new Router()

indexRouter.get('/', getIndexView)

export default indexRouter
