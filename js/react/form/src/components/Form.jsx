import React from 'react';
import objectAssign from 'object-assign';

export default class  Form extends React.Component{

    constructor(props) {
        super(props) 

        // prepare list of values from form children
        let values = {}
        React.Children.forEach(this.props.children, (child) => {
            //console.log(child.props.id)
            values[child.props.id] = {
                value: child.props.default || null,
                default: child.props.default || null,
                valid: (child.props.validator && child.props.validator(child.props.default)) || true,
                validator: child.props.validator || null,
            }
        })

        this.state = {
            values: values,
            changed: false,
            dirty: false // TODO
        }
    }

    renderChildren() {
        return React.Children.map(this.props.children, (child) => {
            //*if (child.type === RadioOption.type)
            return (
                <div>
                    {child.props.label && <label className={child.props.id}>{child.props.label}</label>}
                    {React.cloneElement(child, {
                        onChange: this.onChange.bind(this, child.props.id),
                        value: this.state.values[child.props.id].value})}
                </div> 
            )
        })
    }

    onChange = (id, value) => {
        if (value.target)
            value = value.target.value
        //console.log('form - on change', id, value)
        let nextState = objectAssign({}, this.state)
        let nextValues = nextState.values
        let nextValue = nextValues[id]
        nextValue.value = value

        // validation of new value
        if (typeof(nextValue.validator) == 'function')
            nextValue.valid = nextValue.validator(value)

        // check if global dirty state have changed 
        nextState.dirty= false
        for (let v in nextValues) {
            if (!nextValues[v].valid) {
                nextState.dirty = true 
                break
            }
        }

        // check if data have changed 
        nextState.changed = false
        for (let v in nextValues) {
            if (nextValues[v].default != nextValues[v].value) {
                nextState.changed = true 
                break
            }
        }

        //console.log('setting new state', nextState)
        this.setState(nextState)

        this.props.onChange(this.getValues(nextValues), nextState.changed, nextState.dirty)
    }

    getValues(values = this.state.values) {
        let result = {}
        for (let v in values) {
            result[v] = values[v].value
        }
        return result
    }

    render() {
        return(<div>{this.renderChildren()}</div>)
    }
}