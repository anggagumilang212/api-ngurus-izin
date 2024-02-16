import {fileTypeFromFile} from 'file-type';
import {TYPE_IMAGE} from './uploader';

export default async function checkFileType(req,res,next){
const file = req.file;
const acceptName = Object.keys(TYPE_IMAGE)
const fileType = await fileTypeFromFile(file.path)

if (acceptName.includes(fileType.mime)) {
    req.status(500).json({message: "file bukan gambar"})
}
next();
}