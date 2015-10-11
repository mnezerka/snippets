import React from 'react';
import objectAssign from 'object-assign';

/*
 * Wrapper around form elements for easier handling of
 * typical form actions - validation, change state, etc.
 *
 * Each child element (form control) can provides some
 * of the following properties:
 * - onChange method to notify wrapper of every change
 * - default - default value to be shown on render
 * - validator - method that validates form data
 *
 * Form track it's state in following atributes:
 * - changed - if any child has data different than default
 *             value (property)
 * - dirty - if any child has data that didn't pass validation 
 * - valued - current state of values in all childs
 *
 * Example:
 * //  form inside render
 * <form onSubmit={this._onSubmit.bind(this)}>
 *    <Form ref="form" onChange={this.onFormChange}>
 *        <input id="name" label="Name" default="Bela" validator={validate} />
 *        <input id="suername" label="Surname" default="Fleck" />
 *        <select id="age" label="Age" default="1">
 *            <option value="1">1</option>
 *            <option value="2">2</option>
 *            <option value="3">3</option>
 *        </select>
 *    </Form>
 *    <button>Send</button>
 * </form>

 * // validation function
 * function validate(value) {
 *   return value.length > 0
 * }
 *
 * // log all form changes 
 * onFormChange = (data, changed, dirty) => {
 *    console.log('form change', data, changed, dirty)
 * }
 *
 * // log all form submits 
 * _onSubmit(e) {
 *    e.preventDefault()
 *    console.log('form submit', this.refs.form.getValues()))
 * }

 */ 

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
                <div className="form-row">
                    {child.props.label && <label className={child.props.id}>{child.props.label}<span>:</span></label>}
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
            console.log('compare func', nextValues[v].compare)
            /*
            if (nextValues[v].compare)
            if (nextValues[v].default != nextValues[v].value) {

            else*/
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
