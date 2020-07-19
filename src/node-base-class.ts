import { BaseModelWrap as Wrap } from './base-class';
import * as fs from 'fs';
import * as path from 'path';
import * as JSON5 from 'json5';

import { model } from './model';

export abstract class BaseModelNode<T> extends Wrap<T> {

  constructor(data?: T, insideModelsMapping?: model<BaseModelNode<any>>[]) {
    super(data, insideModelsMapping)
  }

  serializer(filepath?: string) {
    if (!filepath) filepath = path.join(__dirname, 'test.json')
    try {
      const file = JSON5.stringify(this.__data);
      fs.writeFileSync(filepath, file, 'utf8')
      console.log(`Class saved into ${filepath}`)
    } catch (error) {
      console.log(error)
    }
  }


  deserializer(filepath?: string) {
    if (!path) filepath = path.join(__dirname, 'test.json')
    try {
      const file = fs.readFileSync(filepath, 'utf8')
      const jsonFromFile = JSON5.parse(file);
      this.__data = jsonFromFile;
      console.log(`Class restored from ${filepath}`)
    } catch (error) {
      console.log(error)
    }
  }

}
