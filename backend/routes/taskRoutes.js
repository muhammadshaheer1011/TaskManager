const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/taskController');


router.use(auth);
router.get('/', c.getTasks);
router.post('/', c.createTask);
router.put('/:id', c.updateTask);
router.delete('/:id', c.deleteTask);


module.exports = router;