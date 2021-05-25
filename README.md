# mqc_filemanager

A simple and easy to use file manager NodeJS module that is completely synchronous, controllable and intuitive, with focus on being implemented alongside other modules, maintaining runtime and data integrity within all of it's use.

*This module is currently under initial development.*

## Releases

* *undergoing testing*
* 0.2.0 (25/05/2021) - Full File class implementation and basic Folder class implementation
* 0.1.1 (27/04/2021) - Some getters and encoding for the file class implemented
* 0.1.0 (26/04/2021) - Creation and basic usage implemented for the "File" class

## Installation and Usage


### **Installation**

`npm i mqc_filemanager --save`

---


### **Importing**

`import { File, Folder, config as mqc_filemanager_config } from "mqc_filemanager";`

---


### **File**

##### **Create/Get**

`let file = new File(_path);`

This gets the file at the path or creates it if it doesn't exist by default. Having an extension is optional - depends on what you need.

`File.find(_path)`

Returns an array with all files compatible with your search.

P.S.: Using * with the search parameter is optional.

Usage:

> File.find('./\*host\*') //CORRECT
>
> File.find('./host') //CORRECT
>
> //Searches the current directory for files containing "host" in their name
>
> File.find('files/users/\*host\*') //CORRECT
>
> //Searches in the directory 'files/users/' for files containing "host" in their name
>
> File.find('files*\/\*use\*/\*host\*') //WRONG
>
> //Searching for an directory in this find method is not supported.
>
> File.find('/\*host\*') //WRONG
>
> //You should use './' for files in the current directory.

`File.first(_path)`

Searches for files at the path passed and returns the first one found.

P.S.: It returns the first in alphabetical order if it finds more than one result.

##### **Write**

`File.appendLine(_value [, _index])`

This will append the value specified as a string at the end of the file. If the file is empty, it'll just create the first line.<br> If the index parameter is passed, the value will be inserted at it's position.

`File.writeOver(_value)`

Substitutes the contents of the file for the value specified.

`File.clear()`

Removes all content inside the file.

`File.removeLine(_index)`

Removes the line at the passed index from the file. If that line doesn't exist, it doesn't remove anything.

##### **Read**

###### `File.contains(_value)`

Returns whether or not the file contains, on any of it's lines, the value specified.

`_value`: String - the value to be searched within the file


###### `File.getLine(_index)`

Returns a string with the content of the line at the index specified.

`_index`: Integer - index of the line you want to read


###### `File.getLines([ _returnAsArray, _encoding])`

Returns all lines as a string. If it receives the first parameter as true, it'll return all the lines in an array instead. If it receives the second parameter, it'll encode the lines specifically. Check the "supported encodings" section for the supported values.

###### `File.search(_value)`

Returns an array with all indexes where the value specified can be found.<br>
Format: [ index_for_first_find: 'string_for_first_find', index_for_second_find: 'string_for_second_find', ... ]

##### **Manage**

###### `File.delete()`

Removes the file. Any operations thereafter will return nothing / undefined.

##### **Getters**

`File.getCreationDate()`

Returns a timestamp string containing the time at which the file was created.

`File.getExtension()`

Returns the extension from the file name as a string.

`File.getFilename()`

Returns the name of the file, including the extension, as a string.

`File.getLineCount()`

Returns the amount of lines contained in the file as an integer.

`File.getMimeType()`

Returns a string containing the MIME type for the file.

`File.getPath()`

Returns the full path for the file as a string.

`File.getSize([ _format, _round])`

Returns the size for the file in bytes, as an integer. A format parameter can be passed for type of return. If the round parameter receives a value of true, it rounds the result to an integer.<br>
Supported: 'B' (default), 'KB', 'MB', 'GB'. <br>
P.S.: 'KB', 'MB' and 'GB' are returned as doubles.

**Utils**

`File.rename(_value)`

Renames the file, also altering and returning the path.

`File.isValid()`

Returns whether or not this file exists and is valid.

**UNDER DEVELOPMENT**

---

* ### **Folder**

`let folder = new Folder('folder_path');`

**UNDER DEVELOPMENT**

---

* ### **config**

  autocreate | Automatically creates a file or folder on the path specified if it hasn't been created yet | boolean | true

  encoding | Represents how the text is stored as computer language, which can later be converted back to the original characters  based on their values | string | 'utf-8'

**UNDER DEVELOPMENT**
