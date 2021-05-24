const fs = require('fs');
const lineByLine = require('n-readlines');
const mimeTypes = require('mime-types');

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
            let finds = [];
            let fileName;
            let path;
            if(_filePath.lastIndexOf('/') == -1){
                    //NAO TEM BARRA, PROCURAR NO DIRETORIO ATUAL
            path = './';
                fileName = _filePath;
            }else{
                //TEM BARRA, SEPARAR O CAMINHO
                path = _filePath.substr(0, _filePath.lastIndexOf('/')+1);
                fileName = _filePath.replace(path, '');
            }
            while(fileName.charAt(0) == '*')fileName = fileName.substr(1, fileName.length-1);
            while(fileName.charAt(fileName.length-1) == '*')fileName = fileName.substr(0, fileName.length-2);
            //
            if(validatePath(path)){
                fs.readdirSync(path).forEach((v, i) => {
                    if(v.indexOf(fileName) != -1){
                        if(fs.statSync(path + v).isFile())
                            finds.push( new File( path + v ) );
                    }
                });
            }

        //
            return finds;
        }
    }
    //CONSTRUCTOR
    constructor(_path){
        if(!_path){
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
            this.valid = true;
        }else{
            if(conf["auto_create_file"]){
                fs.openSync(this.path, 'w');
                this.valid = true;
            }else{
                this.valid = false;
                return;
            }
        }

        //NAME
        //EXTENSION
        if(this.valid){
            if(this.path.indexOf('/') == -1){
                this.name = this.path;
                if(this.name.lastIndexOf('.') != -1)
                    this.extension = this.name.substring(this.name.lastIndexOf('.')+1);
            }else{
                this.name = this.path.substr(this.path.lastIndexOf('/')+1);
                if(this.name.lastIndexOf('.') != -1)
                    this.extension = this.name.substring(this.name.lastIndexOf('.')+1);
            }
        }

    }
    //WRITE
    clear(){
        if(this.isValid()){
            return fs.writeFileSync(this.path, '');
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
            if(_returnAsArray){
                let lines = [];
                for(let i = 0; i < this.getLineCount(); i++){
                    lines.push(this.getLine(i));
                }
                return lines;
            }else{
                let enc = conf['encoding'];
                if(_encoding)enc = _encoding;
                return Buffer.from(fs.readFileSync(this.path).toString()).toString(enc);
            }
        }
    }
    getLine(_index, _encoding){
        if(this.isValid()){
            const iterator = new lineByLine(this.path);
            let line; let i = 0;
            while(line = iterator.next()){
                if(_index == i){
                    let enc = conf['encoding'];
                    if(_encoding)enc = _encoding;
                    return Buffer.from(line.toString().trim()).toString(enc);
                }
                i++;
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
    move(_value){
        let treatedValue = _value;
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
        return this.path;
    }
    getFilename(){
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
        if(typeof _path != 'string'){
            this.valid = false;
            return;
        }
        try{
            if(fs.readdirSync(_path)){
                //
                this.valid = true;
                if(_path.charAt(_path.length-1) != '/'){
                    this.path = _path + '/';
                }else{
                    this.path = _path;
                }
                //
            }else{
                this.valid = false;
            }
        }catch(e){
            try{
                if(conf['auto_create_folder']){
                    fs.mkdirSync(_path);
                    if(fs.existsSync(_path)){
                        //
                        this.valid = true;
                        if(_path.charAt(_path.length-1) != '/'){
                            this.path = _path + '/';
                        }else{
                            this.path = _path;
                        }
                        //
                    }else{
                        this.valid = false;
                    }
                }else{
                    this.valid = false;
                }
            }catch(e2){
                this.valid = false;
            }
            this.valid = false;
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
                fs.renameSync(this.path, path);
            }
        }
        return false;
    }
    putFile(_file){
        if(this.isValid()){
            if(typeof _file == 'object'){
                if(_file.constructor.name == 'File'){
                    if(_file.isValid())
                        _file.move(this.getPath() + _file.getFilename());
                }
            }else if(typeof _file == 'string'){
                let file;
                if(file = File.first(_file)){
                    if(file.isValid())
                        file.move(this.getPath() + _file.getFilename());
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
    //READ
    getFiles(_search){
        if(this.isValid()){
            let fileNames = fs.readdirSync(this.path);
            let files = [];
            fileNames.forEach( (v) => {
                if(_search){
                    if(v.indexOf(_search) != -1){
                        files.push( new File(this.path + v) );
                    }
                }else{
                    files.push( new File(this.path + v) );
                }
            } );
            return files;
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
        return this.valid;
    }
    getPath(){
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

//

let folderF = Folder.first('files/m*');

//TODO if(conf['debug'])console.log();

//

module.exports = {
    File: File, //CLASS
    Folder: Folder, //CLASS
    config: config //FUNCTION
};