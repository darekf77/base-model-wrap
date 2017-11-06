# base-model-wrap

Purpose of this project is to provide nice way of using 
**javascript class object** inside your framework. 

The reason you would like to to this object instead of raw **object from server** is 
that when some changes happen to your object on the server side you will
force to just change you class object instead every raw object in your **templates**.

This is really usefull in angular js/2/4 and react apps.

## Example ##
```ts
interface RawData {
    fatPercentage: number;
    bodyWeight: number;
}

class Calories extends BaseModelWrap<RawData> {
		
	constructor( data:RawData ) {
		super(data)
	}
	
	get fat() {
		return this.data.fatPercentage
	}	

}
```
now in your component class:
```ts
...
calalories = new Calories({ fatPercentage: 12, bodyWeight: 87  });

// you can clone you object
calories2 = calories.clone()
...
```
and inside template:
```html
...
	<span> Fat {{ calories.fat }} </span> 
...
```

## Models inside models ##
```ts
interface RawData {
    fatPercentage: number;
    bodyWeight: number;
}

class Calories extends BaseModelWrap<RawData> {
		
	constructor( data:RawData ) {
		super(data)
	}
	
	get fat() {
		return this.data.fatPercentage
	}	

}
```