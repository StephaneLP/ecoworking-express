const express = require('express')
const router = express.Router()
const evaluationController = require('../controllers/evaluation.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(evaluationController.readEvaluations)
    .post(evaluationController.createEvaluation)

router.route('/liste/')
    .get(evaluationController.readEvaluationList)

router.route('/:id')    
    .get(evaluationController.readEvaluationById)
    .delete(evaluationController.deleteEvaluationById)
    .put(evaluationController.updateEvaluationById)

module.exports = router