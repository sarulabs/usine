# Usine

![unmaintained](https://img.shields.io/badge/status-UNMAINTAINED-red.svg)

---

Usine is class system with inheritance for javascript. It handles private methods and attributes.

It is inspired by:
* [John Resig work](http://ejohn.org/blog/simple-javascript-inheritance/) on javascript inheritance
* golang structures

It is only an experiment and should not be used in production.

If you need classes in javascript you probably should use ECMAScript 6 classes with a compiler ([Traceur](https://github.com/google/traceur-compiler)).


## Example

A Usine class looks like that:

~~~ js
Usine.Set("My/NameSpace/Person", function(Usine) {
    return {
        // public attributes start with a upper case letter
        LastName: "",

        // private attributes start with a lower case letter
        title: "Mr.",

        // constructor
        Make: function(name) {
            this.LastName = name
            this.expose();
        },

        // private methods start with a lower case letter
        expose: function() {
            console.log("I am " + this.title + " " + this.LastName + " !");
        },

        // public methods start with a upper case letter
        GetTitle: function() {
            return this.title;
        }
    };
});
~~~

Inheritance can also be used. The order in which classes are defined does not matter.

~~~ js
Usine.Set("My/NameSpace/Doctor extends My/NameSpace/Person", function(Usine) {
    return {    
        title: "Dr.",

        Heal: function() {
            console.log("I can heal people.");
        },
    };
});
~~~

When all classes are defined, you can make some instances.

~~~ js
var person = Usine.Make("My/NameSpace/Person", "Taylor");
var doctor = Usine.Make("My/NameSpace/Doctor", "Jones");

console.log(person.GetTitle()); // "Mr."
console.log(doctor.GetTitle()); // "Dr."

console.log(person.LastName); // "Taylor"
person.LastName = "Martin";
console.log(person.LastName); // "Martin"

doctor.Heal(); // I can heal people.
try {
    person.Heal();
} catch(e) {
    console.log(e.message); // undefined is not a function
}

try {
    console.log(person.title);
} catch(e) {
    console.log(e.message); // Class `My/NameSpace/Person` : `title` property is protected. 
}
~~~


## Tests

The tests can be run in a browser by opening the "tests/index.html" file.