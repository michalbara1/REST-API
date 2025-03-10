import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'storage/',
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
        cb(null, Date.now() + '.' + ext);
    }
});

const upload = multer({ storage: storage });

export default upload.single('photo');