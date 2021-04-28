const fs = require('fs');
const lineByLine = require('n-readlines');
const mimeTypes = require('mime-types');

const conf = {
        encoding: 'utf8', //ascii, utf8, utf16le, ucs2, base64, binary, hex
        auto_create: true
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

//////////////////////////////////////////////////////////////// FILE CLASS START
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
            if(conf["auto_create"]){
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
            return fs.writeFileSync(this.path, '');
        }
    }
    writeOver(_value){
        if(this.valid){
            return fs.writeFileSync(this.path, _value);
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
    getLines(_returnAsArray){
        if(this.valid){
            if(_returnAsArray){
                let lines = [];
                for(let i = 0; i < this.getLineCount(); i++){
                    lines.push(this.getLine(i));
                }
                return lines;
            }else{
                return Buffer.from(fs.readFileSync(this.path).toString()).toString(conf["encoding"]);
            }
        }
    }
    getLine(_index){
        if(this.valid){
            const iterator = new lineByLine(this.path);
            let line; let i = 0;
            while(line = iterator.next()){
                if(_index == i){
                    return Buffer.from(line.toString().trim()).toString(conf["encoding"]);
                }
                i++;
            }
            return '';
        }
    }
    rename(_value){ //TODO
        //fs.rename('was', 'will', callback()) 
        if(this.valid){
            //let directPath = toString(this.path);
            let fullPath = toString(this.path);
            let justPath = fullPath.substr();
            return fs.renameSync(this.path, _value);
        }
    }
    delete(){
        //TODO
        this.valid = false; 
        return fs.rmSync(this.path);
    }
    isValid(){
        return this.valid;
    }

    //////////////////////////////////////////////// FILE GETTERS START
    getPath(){
        return this.path;
    }
    getFilename(){
        return this.name;
    }
    getExtension(){
        return this.extension;
    }
    getSize(_format, _round){
        if(this.valid){
            if(_format){
                console.log('passed');
                let size = parseInt(fs.statSync(this.path).size);
                if(!toString(_format))return size;
                let format = toString(_format).toUpperCase();
                switch(format){
                    case 'B':
                        return size;
                    case 'KB':
                        if(_round)return Math.round(size/1024);
                        return size/1024;
                    case 'MB':
                        if(_round)return Math.round(size/1024);
                        return size/Math.pow(1024, 2);
                    case 'GB':
                        if(_round)return Math.round(size/1024);
                        return size/Math.pow(1024, 3);    
                }
            }else{
                return parseInt(fs.statSync(this.path).size);
            }
        }
    }
    getCreationDate(){
        return fs.statSync(this.path).birthtime;
    }
    getMimeType(){
        return mimeTypes.lookup(this.name);
    }
    getLineCount(){
        if(this.valid){
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

config({
    encoding: 'binary'
}); 

let file = new File('files/teste.txt');

file.writeOver('téste\npão\n@#$');

console.log(file.getSize());

//////////////////////////////////////////////////////////////// FOLDER CLASS START
class Folder{
    constructor(){

    }
}
//////////////////////////////////////////////////////////////// FOLDER CLASS END

module.exports = {
    File: File, //CLASS
    Folder: Folder, //CLASS
    config: config //FUNCTION
};