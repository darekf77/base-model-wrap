import * as _ from 'lodash';

import { Log, Level } from 'ng2-logger';
const log = Log.create('datatable base model')


import { model } from './model';

export abstract class BaseModelWrap<T> {
  constructor(pdata?: T, insideModelsMapping?: model<BaseModelWrap<any>>[]) {

    const data = pdata as any;

    // prepare model
    if (Array.isArray(insideModelsMapping) && insideModelsMapping.length > 0 && data != undefined) {
      for (var i = 0; i < insideModelsMapping.length; i++) {
        let m = insideModelsMapping[i];
        // log.i('propertyPath', m.propertyPath)
        // log.i('class', m.class)
        // log.i('data', data)
        let o = _.get(data, m.propertyPath);
        // log.i('o', o)
        if (!o) continue;
        if (Array.isArray(o)) {
          // log.i('is arrrat', o)
          for (let k = 0; k < (o as any[]).length; k++) {
            o[k] = new m.class(o[k]);
            // log.i('o[k]', o[k])
          }
          // log.i('is arrrat afetr', o)
        } else {
          // log.i('is object')
          _.set(data, m.propertyPath, new m.class(o))
        }
        // log.i('data after', data)
      }
    }
    this.__insideModelsMapping = insideModelsMapping;
    this.__data = data;
  }
  private __insideModelsMapping?: model<BaseModelWrap<any>>[]
  protected __data: T;
  protected get data(): T {
    return !this.__data ? <T>{} : this.__data;
  }

  public static rows<T, M = BaseModelWrap<T>>(data: T[], TCreator:
    { new(any?): BaseModelWrap<T>; }, filterEmptyRow = false): M[] {

    let res: BaseModelWrap<T>[] = [];
    if (filterEmptyRow) {
      let d = new TCreator();
      res.push((d).__forFilter())
    }
    if (data && Array.isArray(data)) data.forEach(f => res.push(new TCreator(f)));
    return res as any;
  }
  private __forFilter(): BaseModelWrap<T> {
    this._isEmpty = true;
    return this;
  }

  public abstract clone(): BaseModelWrap<T>;

  public static clone<T>(models: BaseModelWrap<T>[]) {
    return models.map(m => m.clone());
  }


  public raw(): T {
    let data = JSON.parse(JSON.stringify(this.__data)) as any;

    // prepare raw data
    if (Array.isArray(this.__insideModelsMapping) && this.__insideModelsMapping.length > 0 && data != undefined) {
      for (var i = 0; i < this.__insideModelsMapping.length; i++) {
        let m = this.__insideModelsMapping[i];
        let o = _.get(data, m.propertyPath);
        let oi = _.get(this.__data, m.propertyPath);
        // log.i('propertyPath', m.propertyPath)
        // log.i('class', m.class)
        // log.i('data', data)
        if (!o) continue;
        if (Array.isArray(o)) {
          // log.i('is array')
          for (let k = 0; k < (o as any[]).length; k++) {
            o[k] = (oi[k] as BaseModelWrap<any>).raw();
          }
        } else {
          // log.i('is object')
          _.set(data, m.propertyPath, (oi as BaseModelWrap<any>).raw());
        }
        // log.i('transformed', data)
      }
    }
    return data;
  }


  private _isEmpty = false;
  get isEmpty() {
    return this._isEmpty;
  }
  public selected?: boolean = false;
  public get id() {
    return this.data['id'];
  }
  public set id(v) {
    this.data['id'] = v;
  }

  public toString = () => {
    return `item: id=${this.id}`
  }

}


// class DD extends BaseModelWrap<{}> {
//     public clone(): DD {
//         let raw: {} = this.raw();
//         return new DD(raw);
//     }

// }


// let d = DD.rows<any, DD>([], DD);
