const fs = require('fs');
const lineByLine = require('n-readlines');
const mimeTypes = require('mime-types');

const valid_encodings = [
    'ascii', 'utf8', 'utf16le', 'usc2', 'base64', 'binary', 'hex'
];

const conf = {  
        encoding: 'utf8', //ascii, utf8, utf16le, ucs2, base64, binary, hex
        auto_create_file: true,
        auto_create_folder: true,
        debug: false
    };

//////////////////////////////////////////////////////////////// FUNCTION CONFIG START
function config(_json){
    if(_json){
        var array = JSON.parse(JSON.stringify(_json));
        for(let key in array){
            conf[key] = array[key];
        }
    }
    return JSON.stringify(conf);
}
//////////////////////////////////////////////////////////////// FUNCTION CONFIG END

//UTILS START
function validatePath(_path){
    if(typeof _path == 'string')
        if(fs.existsSync(_path))
            if(fs.statSync(_path).isDirectory())
                return true;
    return false;
}
//UTILS END

//////////////////////////////////////////////////////////////// FILE CLASS START
class File{
    //STATIC
    static first(_filePath){
        let finds = this.find(_filePath);
        if(finds.length > 0){
            return finds[0];
        }
        return new File(null);
    }
    static find(_filePath){
        if(typeof _filePath == 'string'){
            //
            let finds = [];
            let fileName;
            let path;
            if(_filePath.lastIndexOf('/') == -1){
                    //NAO TEM BARRA, PROCURAR NO DIRETORIO ATUAL
            path = './';
                fileName = _filePath;
            }else{
                //
                //TEM BARRA, SEPARAR O CAMINHO
                path = _filePath.substr(0, _filePath.lastIndexOf('/')+1);
                fileName = _filePath.replace(path, '');
                //
            }
            while(fileName.charAt(0) == '*')fileName = fileName.substr(1, fileName.length-1);
            while(fileName.charAt(fileName.length-1) == '*')fileName = fileName.substr(0, fileName.length-2);
            //
            if(validatePath(path)){
                //
                fs.readdirSync(path).forEach((v, i) => {
                    if(v.indexOf(fileName) != -1){
                        //
                        if(fs.statSync(path + v).isFile())
                            finds.push( new File( path + v ) );
                        //
                    }
                });
                //
            }

            return finds;
            //
        }
    }
    //CONSTRUCTOR
    constructor(_path){
        if(!_path || typeof _path != 'string'){
            if(conf['debug'])console.log(`== FILE(${_path}): Has not received a valid path for file.`);
            this.valid = false;
            return;
        }
        //VAR
        let treatedPath = _path;
        while(treatedPath.charAt(0) == '/'){
            treatedPath = treatedPath.substr(1);
        }
        while(treatedPath.charAt(treatedPath.length-1) == '/'){
            treatedPath = treatedPath.substr(0, treatedPath.length-2);
        }
        this.path = treatedPath;
        this.valid = false;
        let exists = fs.existsSync(_path);

        //VALID
        if(exists){
            if(conf['debug'])console.log(`== FILE(${_path}): File already exists.`);
            this.valid = true;
        }else{
            if(conf['debug'])console.log(`== FILE(${_path}): File does not exists...`);
            if(conf["auto_create_file"]){
                if(conf['debug'])console.log(`... but i can create it.`);
                try{
                    fs.openSync(this.path, 'w');
                    this.valid = true;
                    if(conf['debug'])console.log(`== FILE(${_path}): File created.`);
                }
                catch(e){
                    if(conf['debug'])console.log(`== FILE(${_path}): ERR: File couldn't be created. Exception raised. This instance has been invalidated.`);
                    this.valid = false;
                }
            }else{
                if(conf['debug'])console.log(`... and i don't have permission to create it. This instance has been invalidated.`);
                this.valid = false;
                return;
            }
        }

        //NAME
        //EXTENSION
        if(this.valid){
            if(conf['debug'])console.log(`== FILE(${_path}): Parsing name and extension for file.`);
            if(this.path.indexOf('/') == -1){
                this.name = this.path;
                if(this.name.lastIndexOf('.') != -1)
                    this.extension = this.name.substring(this.name.lastIndexOf('.')+1);
            }else{
                this.name = this.path.substr(this.path.lastIndexOf('/')+1);
                if(this.name.lastIndexOf('.') != -1)
                    this.extension = this.name.substring(this.name.lastIndexOf('.')+1);
            }
            if(conf['debug'])console.log(`== FILE(${_path}): Name: '${this.name}', Extension: '${this.extension}'.`);
        }

    }
    //WRITE
    clear(){
        if(this.isValid()){
            return fs.writeFileSync(this.path, '');
        }
    }
    removeLine(_index){
        if(this.isValid()){
            if(_index >= 0 && _index < this.getLineCount()){

                let lines = this.getLines(true);
                lines.splice(_index, 1);
                lines = lines.join("\r\n");

                this.writeOver(lines);
            }
        }
    }
    writeOver(_value){
        if(this.isValid()){
            return fs.writeFileSync(this.path, _value);
        }
    }
    appendLine(_value, _index){
        if(this.isValid()){
            if(parseInt(_index) > -1){
                if(this.getLines().trim().length == 0){
                    return fs.writeFileSync(this.path, _value);
                }else{
                    let i = 0;
                    let content = '';
                    while(i < _index){
                        content += this.getLine(i).trim() + "\n";
                        i++;
                    }
                    content += _value.trim();
                    while(this.getLine(i).length > 0){
                        content += "\n" + this.getLine(i).trim();
                        i++;
                    }
                    return fs.writeFileSync(this.path, content);
                }
            }else{
                if(this.getLines().trim().length == 0){
                    return fs.writeFileSync(this.path, _value);
                }else{
                    return fs.writeFileSync(this.path, 
                        this.getLines() + "\n" + _value);
                }
            }
        }
    }
    //READ
    getLines(_returnAsArray, _encoding){
        if(this.isValid()){
            let enc = _encoding ? _encoding : conf['encoding'];
            let v = Buffer.from(fs.readFileSync(this.path).toString()).toString(enc);
            
            if(valid_encodings.includes( enc )){
                if(_returnAsArray)
                    return v.split("\r\n");

                return v;
            }

            return '';
        }
    }
    getLine(_index, _encoding){
        if(this.isValid()){
            // const iterator = new lineByLine(this.path);
            // let line; let i = 0;
            // while(line = iterator.next()){
            //     if(_index == i){
            //         let enc = _encoding && typeof _encoding == 'string' ? _encoding : conf['encoding'];
            //         return Buffer.from(line.toString().trim()).toString(enc);
            //     }
            //     i++;
            // }    
            if(this.getLineCount() > _index && _index >= 0){
                let enc = _encoding && typeof _encoding == 'string' ? _encoding : conf['encoding'];
                if(valid_encodings.includes(enc))
                    return Buffer.from( this.getLines(true)[_index].trim() ).toString( enc );
            }
            return '';
        }
    }
    contains(_value){
        if(this.isValid()){
            return this.getLines().lastIndexOf(_value) == -1 ? false : true;
        }
    }
    search(_value){
        if(this.isValid()){
            if(this.contains(_value)){
                let indexes = [];
                for(let i = 0; i < this.getLineCount(); i++){
                    let line = this.getLine(i);
                    if(line.lastIndexOf(_value) == -1)continue;
                    indexes.push(i);
                }
                return indexes;
            } 
            return false;
        }
    }
    //MANAGE
    move(_newPath){
        let treatedValue = _newPath;
        if(this.getExtension())
            if(treatedValue.lastIndexOf('.') == -1)treatedValue += '.' + this.getExtension();

        if(this.isValid()){
            //let directPath = toString(this.path);
            if(this.getPath() == this.getFilename()){   
                let oldPath = this.path;
                console.log(oldPath);
                this.name = treatedValue;
                this.path = treatedValue;
                //
                if(this.getExtension()){
                    let extension = treatedValue.substr(treatedValue.lastIndexOf('.')+1);
                    if(extension != this.getExtension()){
                        this.extension = extension;
                    }
                }
                //
                return fs.renameSync(oldPath, treatedValue);
            }else{
                let fullPath = this.getPath();
                let justPath = fullPath.substring(0, fullPath.lastIndexOf(this.getFilename())); 
                this.name = treatedValue;
                this.path = justPath + treatedValue;
                //
                if(this.getExtension()){
                    let extension = treatedValue.substr(treatedValue.lastIndexOf('.')+1);
                    if(extension != this.getExtension()){
                        this.extension = extension;
                    }
                }
                //
                return fs.renameSync(fullPath, this.path);
            }
        }
    }
    copy(_newPath){
        if(this.isValid())
            return fs.copyFileSync(this.path, _newPath);
    }
    delete(){
        if(this.isValid()){
            this.valid = false; 
            return fs.rmSync(this.path);
        }
    }

    //GETTERS
    isValid(){
        return this.valid;
    }
    getPath(){
        if(this.isValid())
            return this.path;
    }
    getName(){
        if(this.isValid())
            return this.name;
    }
    getExtension(){
        if(this.isValid())
            return this.extension;
    }
    getSize(_format, _round){
        if(this.isValid()){
            if(_format){
                let size = parseInt(fs.statSync(this.path).size);
                if(size == 0)return size;
                if(typeof _format != 'string')return size;
                let format = _format.toUpperCase();
                let returnedValue = 0;
                switch(format){
                    case 'B':
                        return size;
                    case 'KB':
                        returnedValue = size/1024;
                        break;
                    case 'MB':
                        returnedValue = size/Math.pow(1024, 2);
                        break;
                    case 'GB':
                        returnedValue = size/Math.pow(1024, 3);
                        break;
                }
                if(_round){
                    if(typeof _round == 'number'){
                        return parseFloat(returnedValue).toFixed(_round);
                    }
                }
                return returnedValue;
            }else{
                return parseInt(fs.statSync(this.path).size);
            }
        }
    }
    getCreationDate(){
        if(this.isValid())
            return fs.statSync(this.path).birthtime;
    }
    getMimeType(){
        if(this.isValid())
            return mimeTypes.lookup(this.name);
    }
    getLineCount(){
        if(this.isValid()){
            const iterator = new lineByLine(this.path);
            let line; let i = 0;
            while(line = iterator.next()){
                i++;
                
            }
            return i;
        }
        return 0;
    }
    //////////////////////////////////////////////// FILE GETTERS END
}
//////////////////////////////////////////////////////////////// FILE CLASS END

//config({
//    encoding: 'binary'
//});

//////////////////////////////////////////////////////////////// FOLDER CLASS START
class Folder{
    static first(_path){
        if(typeof _path == 'string'){
            let finds = this.find(_path);
            if(finds.length > 0)return finds[0];
        }
        return new Folder(null);
    }
    static find(_path){
        if(typeof _path == 'string'){
            let finds = [];

            let path = _path;

            if(path.lastIndexOf('/') == -1)path = './' + path;

            if(path.charAt(0) == '/')path = path.substring(1, path.length);
            if(path.charAt(path.length-1) == '/')path = path.substring(0, path.length-1);
            let parts = path.split('/');

            let search = parts[parts.length-1];
            parts.pop();
            while(search.lastIndexOf('*') != -1)search = search.replace('*', '');
            
            let treatedPath = parts.join('/');
            if(validatePath(treatedPath)){
                fs.readdirSync(treatedPath).forEach((v, i) => {
                    if(v.indexOf(search) != -1){
                        if(fs.statSync(treatedPath + '/' + v).isDirectory())
                            finds.push( new Folder(treatedPath + '/' + v) );
                    }
                });
            }

            return finds;
        }
        return [];
    }
    constructor(_path){
        if(!_path || typeof _path != 'string'){
            this.valid = false;
            if(conf['debug'])console.log(`== FOLDER(${_path}): Has not received a valid path for folder.`);
            return;
        }
        try{
            //
            if(fs.readdirSync(_path)){
                //
                if(conf['debug'])console.log(`== FOLDER(${_path}): Folder found!`);
                //
                this.valid = true;
                if(_path.charAt(_path.length-1) != '/'){
                    this.path = _path + '/';
                }else{
                    this.path = _path;
                }
                if(conf['debug'])console.log(`== FOLDER(${_path}): Validity and Path variables set. The folder is ready to use.`);
                //
            }else{
                //
                this.valid = false;
                //
            }
            //
        }catch(e){
            //
            if(conf['debug'])console.log(`== FOLDER(${_path}): Folder has not been found at path ...`);
            try{
                if(conf['auto_create_folder']){
                    //
                    if(conf['debug'])console.log(`... but i have permission to create a folder if it does not exist.`);
                    if(conf['debug'])console.log(`== FOLDER(${_path}): Attempting to create folder.`);
                    //
                    if(fs.existsSync(_path) && fs.statSync(_path).isFile()){
                        if(conf['debug'])console.log(`== FOLDER(${_path}): ERR: You cannot have a directory and file with the same name when the file doesn't have an extension.`);
                        this.valid = false;
                    }else
                        fs.mkdirSync(_path);
                    //
                    if(fs.existsSync(_path)){
                        //
                        if(conf['debug'])console.log(`== FOLDER(${_path}): Folder has been created dinamically!`);
                        //
                        this.valid = true;
                        if(_path.charAt(_path.length-1) != '/'){
                            this.path = _path + '/';
                        }else{
                            this.path = _path;
                        }
                        if(conf['debug'])console.log(`== FOLDER(${_path}): Validity and Path variables set. The folder is ready to use.`);
                        //
                    }else{
                        //
                        if(conf['debug'])console.log(`== FOLDER(${_path}): ERR: Could not create folder dinamically.`);
                        this.valid = false;
                        //
                    }
                    //
                }else{
                    //
                    if(conf['debug'])console.log(`... and i do not have permission to create a folder. This instance has been invalidated.`);
                    this.valid = false;
                    //
                }
            }catch(e2){
                //
                if(conf['debug'])console.log(`== FOLDER(${_path}): ERR: Could not treat the DirectoryNotFound exception by creating it. Returned another error.`);
                this.valid = false;
                //
            }
            this.valid = false;
            //
        }
    }
    //MANAGE
    move(_newPath){
        if(this.isValid()){
            if(typeof _newPath == 'string'){
                let path = _newPath;
                if(path.charAt(0) == '/')path = path.substring(1, path.length);
                if(path.charAt(path.length-1) == '/')path = path.substring(0, path.length-1);
                console.log(this.path);
                console.log(path);
                if(conf['debug'])console.log(`==> MOVE(${_newPath}): Moving from ${this.path} to ${path}. `);
                fs.renameSync(this.path, path);
            }
        }
        return false;
    }
    putFile(_file){
        if(this.isValid()){
            if(typeof _file == 'object'){
                if(_file.constructor.name == 'File'){
                    if(_file.isValid()){
                        if(conf['debug'])console.log(`==> PUTFILE(${_file}): Putting '${_file.getFilename()}' at '${this.getPath()}'. `);
                        _file.move(this.getPath() + _file.getFilename());
                    }
                }
            }else if(typeof _file == 'string'){
                let file;
                if(file = File.first(_file)){
                    if(file.isValid()){
                        if(conf['debug'])console.log(`==> PUTFILE(${file}): Putting '${file.getFilename()}' at '${this.getPath()}'. `);
                        file.move(this.getPath() + _file.getFilename());
                    }
                }
            }
        }
    }
    putFolder(_folder){
        if(this.isValid()){
            if(typeof _folder == 'object'){
                if(_folder.constructor.name == 'Folder'){
                    if(_folder.isValid())
                        _folder.move(this.getPath() + _folder.getName());
                }
            }else if(typeof _folder == 'string'){
                let folder;
                if(folder = new Folder(_folder)){
                    if(folder.isValid())
                        folder.move(this.getPath() + _folder.getName());
                }
            }
        }
    }
    copy(_newPath){
        if(this.isValid()){
            let files = fs.readdirSync(_newPath);
        
            let old_auto_create_folder = conf['auto_create_folder'];
            let old_auto_create_file = conf['auto_create_file'];
            //
            config({
                auto_create_file: true,
                auto_create_folder: true
            });
            
            //
            config({
                auto_create_file: old_auto_create_file,
                auto_create_folder: old_auto_create_folder
            });

        }
    }
    delete(){
        if(this.isValid()){
            this.valid = false; 
            return fs.rmdirSync(this.path);
        }
    }
    //READ
    getChildren(_search, _filter){
        if(this.isValid()){
            let childrenNames = fs.readdirSync(this.path);
            let children = [];

            let filter = false; //1- ONLY FILE, 2- ONLY FOLDER, FALSE- NO FILTER
            if(typeof _filter == 'string'){
                switch(_filter){
                    case 'files':
                        filter = 1;
                        break;
                    case 'folders':
                        filter = 2;
                        break;
                    default:
                        filter = false;
                        break;
                }
            }

            childrenNames.forEach( (v) => {
                if(_search){
                    if(v.indexOf(_search) != -1){
                        if(fs.statSync( this.path + v ).isFile()){
                            if( filter != false ?/**/ filter == 1 ? true : false /**/: true )
                                children.push( new File( this.path + v ) );
                        }else{
                            if( filter != false ?/**/ filter == 2 ? true : false /**/: true )
                                children.push( new Folder( this.path + v ) );
                        }
                    }
                }else{
                    if(fs.statSync( this.path + v ).isFile()){
                        if( filter != false ?/**/ filter == 1 ? true : false /**/: true )
                            children.push( new File( this.path + v ) );
                    }else{
                        if( filter != false ?/**/ filter == 2 ? true : false /**/: true )
                            children.push( new Folder( this.path + v ) );
                    }
                }
            });
            return children;
        }
    }
    getFileByIndex(_param){
        if(this.isValid()){
            if(typeof _param == 'number'){

                let files = fs.readdirSync(this.getPath());
                if(_param >= 0 && _param < files.length){
                    return File.first(this.getPath() + files[_param]);
                }
    
            }
        }
    }
    getFileByName(_param){
        if(this.isValid()){
            if(typeof _param == 'string'){

                return File.first(this.getPath() + _param);
    
            }
        }
    }
    //GETTERS
    isValid(){
        if(conf['debug'])console.log(`== ISVALID(): Checking wheter or not the file is valid and exists: ${this.valid}`);
        return this.valid;
    }
    getPath(){
        if(this.isValid())
            return this.path;
    }
    getName(){
        if(this.isValid()){
            if(this.name){
                return this.name;
            }else{
                let name;
                let path = this.getPath();
                while(path.lastIndexOf('\\') != -1)path = path.replace('\\', '/');
                name = path.split('/')[path.split('/').length-2];
                if(name == '.' || name.trim() == ''){
                    let cwdPath = process.cwd();
                    while(cwdPath.lastIndexOf('\\') != -1)cwdPath = cwdPath.replace('\\', '/');
                    name = cwdPath.split('/')[cwdPath.split('/').length-1];
                }
                this.name = name;
                return this.getName();
            }
        }
    }
    getFolderCount(){
        if(this.isValid()){
            return (fs.readdirSync(this.getPath()).length - this.getFileCount());
        }
    }
    getFileCount(){
        if(this.isValid()){
            let fileCount = 0;
            fs.readdirSync(this.getPath()).map(v => fs.statSync(v).isFile() ? 1 : 0).forEach((v)=>{fileCount += v;});
            return fileCount;
        }
    }
    getCreationDate(){
        if(this.isValid())
            return fs.statSync(this.path).birthtime;
    }
    getBytes(){
        if(this.isValid()){
            let bytes = 0;
            this.getFiles().forEach( (v, i) => {
                bytes += v.getSize();
            } );
            return bytes;
        }
    }
    getSize(_format, _round){
        if(this.isValid()){
            if(_format){
                let size = this.getBytes();
                if(size == 0)return size;
                if(typeof _format != 'string')return size;
                let format = _format.toUpperCase();
                let returnedValue = 0;
                switch(format){
                    case 'B':
                        return size;
                    case 'KB':
                        returnedValue = size/1024;
                        break;
                    case 'MB':
                        returnedValue = size/Math.pow(1024, 2);
                        break;
                    case 'GB':
                        returnedValue = size/Math.pow(1024, 3);
                        break;
                }
                if(_round){
                    if(typeof _round == 'number'){
                        return parseFloat(returnedValue).toFixed(_round);
                    }
                }
                return returnedValue;
            }else{
                return this.getBytes();
            }
        }
    }
}
//////////////////////////////////////////////////////////////// FOLDER CLASS END

module.exports = {File, Folder, config};
//export default {File, Folder, config};