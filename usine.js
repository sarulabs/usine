var Usine = (function() {

    var items = {},

        error = function(name, err) {
            throw new Error("Class `" + name + "` " + err);
        },

        addSuper = function(method, parent) {
            return function() {
                var result;
                this.parent = parent;
                result = method.apply(this, arguments);
                delete this.parent;
                return result;
            };
        },

        pk = "UsinePublicKey",

        getAttrConf = function(item, prop, value, isFunc, name, instance) {
            var check;

            if (prop[0].toLowerCase() === prop[0]) {
                check = function(fn) {
                    if (fn.caller[pk] !== item.key) {
                        error(name, ": `" + prop + "` property is protected.");
                    }
                };

                if (isFunc) {
                    return {
                        enumerable: true,
                        writable: true,
                        value: function fn() {
                            check(fn);
                            value[pk] = item.key;
                            return value.apply(this, [].slice.call(arguments));
                        }
                    };
                }

                item.storage[item.instances.indexOf(instance)][prop] = value;

                return {
                    get: function fn() {
                        check(fn);
                        return item.storage[item.instances.indexOf(instance)][prop];
                    },
                    set: function fn(val) {
                        check(fn);
                        item.storage[item.instances.indexOf(instance)][prop] = val;
                    }
                };
            }

            if (isFunc) {
                return {
                    enumerable: true,
                    writable: false,
                    value: function() {
                        value[pk] = item.key;
                        return value.apply(this, [].slice.call(arguments));
                    }
                };
            }

            return {
                enumerable: true,
                writable: true,
                value: value
            };
        },

        initialize = function(name) {
            var item, parent, prop, value;

            item = items[name] || error(name, "does not exit");

            if (item.factory) {
                return;
            }

            item.fn = function() {
                return;
            };

            item.key = name;

            item.attrs = {};
            item.instances = [];
            item.storage = [];

            if (item.parent) {
                initialize(item.parent);
                parent = items[item.parent];
                item.fn.prototype = new parent.fn();
                item.key = parent.key;
                item.attrs = parent.attrs;
            }

            for (prop in item.def) {
                if (item.def.hasOwnProperty(prop)) {
                    if (prop === "parent") {
                        error(name, "can't have a `parent` property");
                    }
                    if (typeof item.def[prop] === "function") {
                        value = parent ? addSuper(item.def[prop], parent.fn.prototype[prop]) : item.def[prop];

                        Object.defineProperty(
                            item.fn.prototype,
                            prop,
                            getAttrConf(item, prop, value, true, name)
                        );
                    } else {
                        item.attrs[prop] = item.def[prop];
                    }
                }
            }

            item.factory = function() {
                var prop, instance = new item.fn();

                item.instances.push(instance);
                item.storage.push({});

                for (prop in item.attrs) {
                    if (item.attrs.hasOwnProperty(prop)) {
                        Object.defineProperty(
                            instance,
                            prop,
                            getAttrConf(item, prop, item.attrs[prop], false, name, instance)
                        );
                    }
                }

                if (instance.Make) {
                    instance.Make.apply(instance, [].slice.call(arguments));
                }

                return Object.seal ? Object.seal(instance) : instance;
            };
        };


    return {
        /**
         * Check if an object is an instance of a given class
         * 
         * @param  string  name     name of the class to check
         * @param  Object  object   object to check
         * @return bool
         */
        InstanceOf: function(name, object) {
            try {
                initialize(name);
                return object instanceof items[name].fn;
            } catch (e) {
                return false;
            }
        },

        /**
         * Define a new class
         * 
         * @param string name       name of the class
         * @param mixed  definition definition of the class
         */
        Set: function(name, definition) {
            var split = name.split(" extends ");

            name = split[0].split(" ").join("");

            if (items[name]) {
                error(name, "is already set");
            }

            items[name] = {
                parent: (split.length > 1) ? split[1].split(" ").join("") : undefined,
                def: (typeof definition === "function") ? definition() : definition
            };
        },

        /**
         * Create a new instance of a given class
         * 
         * @param  string name  name of the class to instantiate
         * @param  mixed        next parameters are used as Make arguments
         * @return Object
         */
        Make: function(name) {
            var args = [].slice.call(arguments, 1);

            initialize(name);

            return items[name].factory.apply({}, args);
        }
    };

}());
