//imports
import { Router } from 'express';

//.setup
const router = Router();

//routes
router.get('/', (req, res) => {
    res.send('Hello, World!');
});
router.get('/api/data', (req, res) => {
    res.json({ message: 'This is some data' });
});

//exports
export default router;