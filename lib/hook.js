'use strict';

// Module to (temporarily) replace a method on an object
//
// By Kevin (https://github.com/iamkvein)
//
// via http://stackoverflow.com/questions/9609393/catching-console-log-in-node-js
// and https://gist.github.com/iamkvein/2006752

module.exports = function(obj) {
    
    if (obj.hook || obj.unhook) {
        throw new Error('Object already has properties hook and/or unhook');
    }
    
    obj.hook = function(methName, fn, isAsync) {
        var self = this,
            meth_ref;
        
        // Make sure method exists
        if (! (Object.prototype.toString.call(self[methName]) === '[object Function]')) {
            throw new Error('Invalid method: ' + methName);
        }

        // We should not hook a hook
        if (self.unhook.methods[methName]) {
            throw new Error('Method already hooked: ' + methName);
        }

        // Reference default method
        meth_ref = (self.unhook.methods[methName] = self[methName]);

        self[methName] = function() {
            var args = Array.prototype.slice.call(arguments);

            // Our hook should take the same number of arguments 
            // as the original method so we must fill with undefined
            // optional args not provided in the call
            while (args.length < meth_ref.length) {
                args.push(undefined);
            }

            // Last argument is always original method call
            args.push(function() {
                var args = arguments;
                
                if (isAsync) {
                    process.nextTick(function() {
                        meth_ref.apply(self, args);
                    });
                } else {
                    meth_ref.apply(self, args);
                }
            });

            fn.apply(self, args);
        };
    };
    
    obj.unhook = function(methName) {
        var self = this,
            ref  = self.unhook.methods[methName];

        if (ref) {
            self[methName] = self.unhook.methods[methName];
            delete self.unhook.methods[methName];
        } else {
            throw new Error('Method not hooked: ' + methName);
        }
    };

    obj.unhook.methods = {};

    return obj;
};