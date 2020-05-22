const file=require('fs');
const deleteFile=(filePath) =>{
    file.unlink(filePath,(err)=>{
        if(err){
            throw(err);
        }
    })
}
exports.deleteFile=deleteFile;