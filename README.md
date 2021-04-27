# mqc_filemanager

A simple and easy to use file manager that is completely synchronous, controllable and intuitive, with focus on being implemented alongside other modules, maintaining runtime and data integrity within all of it's use.

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

`File.writeOver(_value)`

Substitutes the contents of the file for the value specified.

`File.appendLine(_value [, _index])`

This will append the value specified as a string at the end of the file. If the file is empty, it'll just create the first line. If the index parameter is passed, the value will be inserted at it's position.

**Read**

`File.getLine(_index)`

Returns a string with the content of the line at the index specified.

`File.getLines()`

Returns all lines within one string. (Will change in the future to be an array of lines).

**Delete**

`File.delete()`

Removes the

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
