
import multer from 'multer';
import path from 'path';

export const upload = multer({storage: multer.diskStorage({
})});