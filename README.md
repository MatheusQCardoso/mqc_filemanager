# mqc_filemanager

A simple and easy to use file manager NodeJS module that is completely synchronous, controllable and intuitive, with focus on being implemented alongside other modules, maintaining runtime and data integrity within all of it's use.

**This module is currently under initial development.**

## Releases

* 0.1.0 (26/04/2021) - Creation and basic usage implemented for the "File" class.

## Installation and Usage

* **Installation**

This module is still under development. The installation process will be described after initial release.

---

* **Instanciating**

`import { File, Folder, config as mqc_filemanager_config } from "mqc_filemanager";`

---

* **File**

**Create**

`let file = new File('file_path.extension');`

This creates the file if it doesn't exist by default.

**Write**

`File.appendLine(_value [, _index])`

This will append the value specified as a string at the end of the file. If the file is empty, it'll just create the first line.<br>If the index parameter is passed, the value will be inserted at it's position.

`File.clear()`

Removes all the content from the file.

`File.writeOver(_value)`

Substitutes the contents of the file for the value specified.

**Read**

`File.contains(_value)`

Returns whether or not the file contains, on any of it's lines, the value specified.

`File.getLine(_index)`

Returns a string with the content of the line at the index specified.

`File.getLines([ _returnAsArray])`

Returns all lines as a string. If it receives a parameter with the value of "true", it'll return an array with all the lines instead.

`File.search(_value)`

Returns an array with all indexes where the value specified can be found.<br>
Format: [ index_for_first_find: 'string_for_first_find', index_for_second_find: 'string_for_second_find', ... ]

**Delete**

`File.delete()`

Removes the file.

**Getters**

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

`File.getSize([ _format])`

Returns the size for the file in bytes, as an integer. A format parameter can be passed for type of return.<br>
Supported: 'B' (default), 'KB', 'MB', 'GB'. <br>
P.S.: 'B' and 'KB' will always be integers. 'MB' and 'GB' can be doubles.

**Utils**

`File.rename(_value)`

Renames the file, also altering and returning the path.

`File.isValid()`

Returns whether or not this file exists and is valid.

**UNDER DEVELOPMENT**

---

* **Folder**

`let folder = new Folder('folder_path');`

**UNDER DEVELOPMENT**

---

* **config**

  autocreate | Automatically creates a file or folder on the path specified if it hasn't been created yet | boolean | true

  encoding | Represents how the text is stored as computer language, which can later be converted back to the original characters  based on their values | string | 'utf-8'

**UNDER DEVELOPMENT**
