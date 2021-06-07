# mqc_filemanager

---



A simple and easy to use file manager module for NodeJS that is completely synchronous, controllable and intuitive, with focus on being implemented alongside other modules, maintaining runtime and data integrity within all of it's use.

*This module will be updated in the future with both new functionality and more efficient functionality.*


## Releases

---



* **0.1.0** - Initial release - Basic File and Folder functionalities implemented.



## Installation

---



### **Installing with npm**

`npm i mqc_filemanager --save`

---

### **Importing**

`import { File, Folder, config as mqc_filemanager_config } from "mqc_filemanager";`


## Usage

---



### **File**

---



#### Create / Instanciate

---



```
let file = new File("folder1/folder2/textfile.txt") or let file = new File("./textfile.txt")
```

This creates an instance of the file at the path you've passed. It also creates the file by default if it doesn't exist.


```
let files = File.find("path/text") or let files = File.find("path/*text\*")
```

Searches for files with "text" in their name at the "path" specified and returns an array with all files found ready to use.

P.S.: The use of "\*" is optional. This character will always be ignored and can't be searched for.


```
let file = File.first("path/text") 
```

Returns an instance of the first file at "path" containing "text" in it's name. By default, this gets the first in alphabetical order.


#### Read

---



```
file.getLines([ _returnAsArray, _encoding]) : string
```

Returns all the lines from the file in a string.

`_returnsAsArray: boolean - if passed as true, all lines will be returned in an array instead.`

`_encoding: string - if specified, must be a string with a valid encoding for all the lines to get parsed with.`

---



```
file.getLine(_index [, _encoding]) : string
```

Returns a string with the content of the line at the specified index.

`_index: number - starting from 0, specifies which line will be returned.`

`_encoding: string - if specified, must be a string with a valid encoding for the line to get parsed with.`

---



```
file.contains(_value) : boolean
```

Returns wheter or not this file contains the specified value.

`_value: string - item to be searched for`.

---



```
file.search(_value) : array of numbers
```

Returns an array with indexes for all the lines where the value specified can be found.

`_value: string - item to be searched for.`


#### Write

---



```
file.clear() : void
```

Clears the file of all content.

---



```
file.writeOver(_value) : void
```

Substitutes all the content of this file for the value specified.

`_value: string - value to write over the contents of this file with.`

---



```
file.appendLine(_value [, _index]) : void
```

Adds the passed value to the end of the file, in a new line. If also receives an index, will try to append the line at that position.

`_value: string - value to append to the file's contents.`

`_index: number - if passed, will specify where to put the line at.`

---



```
file.removeLine(_index) : void
```

Removes the line at the specified index from the file.

`_index: number - position of the line to be removed.`

---



#### Manage

---



```
file.move(_newPath) : void (will move the file and rename it to whatever you specified)
```

Moves the file from the current path to the path specified (Works a lot like "mv" in linux). Can also be used to just rename the file.

Example.: `file.move("documents/files/text.txt")` will move the file to the folder "documents/files" and rename it to "text.txt".

`_newPath: string - specifies where the file has to be moved to and what it's going to be called.`

---



```
file.copy(_newPath) : void (will copy the file and rename it to whatever you specified)
```

Creates an exact copy of the file and moves it to the specified path, with the specified name (Works a lot like "cp" in linux).

Example.: `file.copy("documents/files/text.txt")` will make an exact copy of this file at "documents/files" with the name "text.txt".

`_newPath: string - specifies where the copy made will be put at, and what it's name and extension will be.`

---



```
file.delete() : void
```

Deletes the file and invalidates the instance. You will not be able to do anything else with it after deleting it.

---



#### Utility / Getters

---



```
file.isValid() : boolean
```

Returns wheter or not this file exists and is valid.

---



```
file.getPath() : string
```

Returns the full path where the file is located.

---



```
file.getName() : string
```

Returns the full name for this file.

---



```
file.getExtension() : string
```

Returns the extension of this file (This is not the MIME type). Will return "undefined" if working with a file without an extension.

---



```
file.getSize([ _format, _round]) : number
```

Returns the size of this file in bytes.

Example.:  `file.getSize("kb", 2)` will return 1.50 for a file containing 1536 bytes of size and 1.01 for a file containing 1025 bytes.

`_format: string - specifies how you want your output formatted. Valid inputs: "b", "kb", "mb", "gb". Also changes the return type to decimal.`

`_round: number - rounds up the decimal returned to the amount of cases specified. `

---



```
file.getCreationDate() : Date
```

Returns a Date instance for when the file was created.

---



```
file.getLineCount() : number
```

Returns the number of lines contained in the file.

---



### **Folder**

---



#### Create / Instanciate

---



```
let folder = new Folder("path/folder_name") or let folder = new Folder("./folder_name/")
```

Creates a new instance of the folder object. If the folder doesn't exist, it is created by default.

---



```
let folders = Folder.find("path/\*_files*") or let folders = Folder.find("./_files")
```

Returns an array with all folders containing "_files" in their names at the "path" specified.

---



```
let folder = Folder.first("path/_files")
```

Returns the first folder object found at "path" containing "_files" in it's name. By default, this gets the first in alphabetical order.

---



#### Read

---



```
folder.getChildren([ _search, _filter]) : array
```

Returns all the children inside this folder in an array, wheter or not they're a file or directory.

`_search: string - lets you search for specific file and directory names or parts.`

`_filter: string - lets you specifiy if you want to get only files or only folders. Valid inputs: "files" and "folders".`

---



```
folder.getFileByIndex(_index) : File
```

Returns the file at the specified position (By default, this looks in alphabetical order). If it doesn't exist, returns nothing.

`_index: number - position of the file you want to retrieve in this folder.`

---



```
folder.getFileByName(_name) : File
```

Returns the first file with a name similar to the parameter passed (By default, it gets the first match in alphabetical order). If it doesn't exist, returns nothing.

`_name: string - specifies what to look for in file names.`

---


#### Write

---



```
folder.putFile(_file) : void
```

Puts the specified file in this folder.

`_file: File, string - can receive either the File instance as a parameter or it's name.`

---


```
folder.putFolder(_folder) : void
```

Puts the specified directory in this folder.

`_folder: Folder, string - can receive either the folder instance as a parameter or it's name.`

---


#### Manage

---


```
folder.move(_newPath) : void
```

Moves the folder to whatever path specified and renames it accordingly. 

Example.: `folder.move("documents/images/landscapes/")` will move this folder to "documents/images" and rename it to "landscapes".

`_newPath: string - specifies the new path for the folder.`

---



```
folder.copy(_newPath) : void
```

Creates an exact copy of the folder in whatever path is specified and names it accordingly.

Example.: `folder.copy("documents/images/landscapes/")` will create an exact copy of this folder named "landscapes" at the path "documents/images".

`_newPath: string - specifies the path where the copy will be put at.`

---



```
folder.delete() : void
```

Deletes this folder and all of it's contents, invalidating this instance. It can't be used for anything after this.

---



#### Utility / Getters

---



```
folder.isValid() : boolean
```

Returns wheter or not this directory exists and is valid.

---



```
folder.getPath() : string
```

Returns the path for this directory.

---


```
folder.getName() : string
```

Returns the name of this folder.

---


```
folder.getFolderCount() : number
```

Returns the amount of directories contained in this folder.

---



```
folder.getFileCount() : number
```

Returns the amount of files contained in this folder.

---



```
folder.getCreationDate() : Date
```

Returns an Date instance for when this folder was created.

---



```
folder.getBytes() : number
```

Returns the sum of sizes of everything inside this folder in bytes.

---



```
folder.getSize([ _format, _round]) : number
```

Returns the sum of sizes of everything inside this folder (By default, in bytes).

`_format: string - specifies how you want the output to be formatted. Valid inputs: "b", "kb", "mb", "gb".`

`_round: number - rounds up the result for you to the amounts of cases specified by this parameter.`

---



### **config**

---



> config({	
>
> ```
> option_1: "value1",
> ```
>
>
> ```
> option_2: "value2"
> ```
>
>
> });

This will change the configurations you specify a value for and how some of the code works.


#### Options

---



> **encoding** : string

Specifies the default encoding to return files' contents as.

Valid inputs: 'ascii', 'utf8', 'utf16le', 'usc2', 'base64', 'binary', 'hex'.

default: 'utf8'.

---



> **auto_create_file** : boolean

Specifies wheter or not to create files which are not found when creating a new instance of the File class.

default: true.

---



> **auto_create_folder** : boolean

Specifies wheter or not to create folders which are not found when creating a new instance of the Folder class.

default: true.

---



> **debug** : boolean

Enables console messages for the functioning of the File and Folder classes so you can get to know the data flowing there.

*Currently only supports the constructors of theses classes.*

default: false.
