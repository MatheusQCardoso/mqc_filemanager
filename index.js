const fs = require('fs');
const lineByLine = require('n-readlines');

const conf = {
        encoding: 'utf8', //ascii, utf8, utf16le, ucs2, base64, binary, hex
        auto_create: true
    };

function config(_json){
    if(_json){
        var array = JSON.parse(JSON.stringify(_json));
        for(let key in array){
            conf[key] = array[key];
        }
    }
    return JSON.stringify(conf);
}

class File{
    constructor(_path){
        //VAR
        this.path = _path;
        this.valid = false;
        let exists = fs.existsSync(_path);

        //VALID
        if(exists){
            this.valid = true;
        }else{
            if(conf.auto_create){
                fs.openSync(this.path, 'w');
                this.valid = true;
            }else{
                throw `MQC_FILEMANAGER => FILE => CONSTRUCTOR() => FILE AT '${_path}' DOES NOT EXIST AND CANNOT BE CREATED.`;
            }
        }

        //NAME
        //EXTENSION

        if(this.valid){
            if(this.path.indexOf('/') == -1){
                this.name = this.path;
                this.extension = this.name.substring(this.name.lastIndexOf('.')+1);
            }else{
                this.name = this.path.substr(this.path.lastIndexOf('/')+1);
                this.extension = this.name.substring(this.name.lastIndexOf('.')+1);
            }
        }

    }
    clear(){
        if(this.valid){
            if(fs.appendFileSync(this.path, '')){
                return true;
            }else{
                throw `MQC_FILEMANAGER => FILE => CLEAR() => FILE AT '${this.path}' CANNOT BE CLEAN.`;
            }
        }
    }
    writeOver(_value){
        if(this.valid){
            if(fs.appendFileSync(this.path, _value)){
                return true;
            }else{
                throw `MQC_FILEMANAGER => FILE => WRITEOVER() => FILE AT '${this.path}' CANNOT BE WRITTEN OVER.`;
            }
        }
    }
    appendLine(_value, _index){
        if(this.valid){
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
    getLines(){
        if(this.valid){
            let data = fs.readFileSync(this.path).toString();
            return data;
        }
    }
    getLine(_index){
        if(this.valid){
            const iterator = new lineByLine(this.path);
            let line; let i = 0;
            while(line = iterator.next()){
                if(_index == i){
                    return line.toString().trim();
                }
                i++;
            }
            return '';
        }
    }
    rename(_value){
        //fs.rename('was', 'will', callback())
        if(this.valid){
            //let directPath = toString(this.path);
            let fullPath = toString(this.path);
            let justPath = fullPath.substr();
            return fs.renameSync(this.path, _value);
        }
    }
    delete(){
        this.valid = false;
    }
    isValid(){
        return this.valid;
    }

    getPath(){
        return this.path;
    }
    getFilename(){
        return this.name;
    }
    getExtension(){
        return this.extension;
    }
    getSize(){
        return fs.statSync(this.path).size;
    }
    getCreationDate(){
        return fs.statSync(this.path).birthtime;
    }
}

let file = new File('files/teste.txt');

console.log(file.getPath());
console.log(file.getFilename());
console.log(file.getExtension());
console.log(file.getSize());
console.log(file.getCreationDate());
console.log(file.getLines());

class Folder{
    constructor(){

    }
}

module.exports = {
    File: File, //CLASS
    Folder: Folder, //CLASS
    config: config //CONFIG
}