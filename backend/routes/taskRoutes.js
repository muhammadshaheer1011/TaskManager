const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const c = require('../controllers/taskController');

router.use(auth);

router.get('/', c.getTasks);
router.post('/', upload.single('image'), c.createTask);
router.put('/:id', upload.single('image'), c.updateTask);
router.delete('/:id', c.deleteTask);

module.exports = router;
