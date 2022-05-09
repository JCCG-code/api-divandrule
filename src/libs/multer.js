// General imports for multer
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'


// Storage configuration
const storage = multer.diskStorage({
    destination: 'src/uploads',
    filename: (req, file, callback) => {
        callback(null, uuidv4() + path.extname(file.originalname))
    }
})


// Export the storage
export default multer({storage})