'use strict';

// const eyes = require('eyes').inspector({ maxLength: -1, functions: false });
const type_check_system=require('type-check-system').default;

const Any=function() {
};

const schemaSchema = {
    context:'object-ensure',
    name: 'schemaSchema',
    schema: {
        context: {
            type:String,
            required: true,
            default:'coller',
        },
        name: {
            type:String,
            required: true,
            default:'object',
        },
        schema: {
            type:Object,
            required: true,
        },
    }
}

const schemaField = {
    context:'object-ensure',
    name: 'schemaField',
    schema: {
        type: {
            type:Any,
            required: true,
            default:String,
        },
        required: {
            type:Boolean,
            required: true,
            default:false,
        },
        default: {
            type:Any,
            required: false,
        },
    }
}

function _validate(obj,schema,internal)
{
    if (!internal) _validate(schema,schemaSchema,true);
    // eyes({obj,schema})
    if (!obj) {
        throw new Error('In '+(internal?obj.context:schema.context)+' '+(internal?'schema':schema.name)+' is not specified')
    }
    if (typeof obj != 'object') {
        throw new Error('In '+(internal?obj.context:schema.context)+' '+(internal?'schema':schema.name)+' is not an object')
    }
    for (var name in schema.schema) {
        if (!internal) _validate(schema.schema[name],schemaField,true);
        if (obj.hasOwnProperty(name)) {
            if (schema.schema[name].type !== Any) {
                try {
                    type_check_system(obj[name], schema.schema[name].type);
                } catch (e) {
                    // eyes({obj,name})
                    throw new Error('In '+(internal?obj.context:schema.context)+' '+(internal?'schema':schema.name)+'[\''+name+'\']'+' '+e.message)
                }
            }
        } else {
            if (schema.schema[name].hasOwnProperty('default')) {
                if (typeof schema.schema[name].default == 'function') {
                    obj[name]=schema.schema[name].default.call(obj)
                } else {
                    obj[name]=schema.schema[name].default;
                }
            }
        }
        if (schema.schema[name].required && !obj.hasOwnProperty(name)) {
            throw new Error('In '+(internal?obj.context:schema.context)+' '+(internal?'schema':schema.name)+'[\''+name+'\'] is not present, but it is required')
        }
    }
    return obj;
}

function validate(obj,schema)
{
    return _validate(obj,schema);
}

module.exports = {
    validate: validate,
    Any:Any,
}