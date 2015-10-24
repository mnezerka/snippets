import React from 'react';
import classnames from  'classnames';
/*
 * FormFields is Wrapper around form elements for easier handling of
 * typical form actions - validation, change state, etc.
 *
 * Each child element (form control) can provides some
 * of the following properties:
 * - onChange method to notify wrapper of every change
 * - default - default value to be shown on render
 * - validator - method that validates form data
 *
 * FormFields renders all childs with following ads:
 * - fills value property based on default prop and current state
 * - handles onChange event and keeps state of component (value prop)
 * - sets invalid property according to validation result
 *
 * FormFields tracks it's state in following attributes:
 * - changed - if any child has data different than default
 *             value (property)
 * - dirty - if any child has data that didn't pass validation 
 * - valued - current state of values in all childs
 *
 * @example:
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

function clone(val) {
    if (val === undefined || val === null)
        return val 

    return JSON.parse(JSON.stringify(val));
}

export default class FormFields extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func,
        children: React.PropTypes.node,
        labelWithColon: React.PropTypes.bool
    }

    static defaultProps = {
        onChange: () => {},
        labelWithColon: true
    }

    constructor(props) {
        super(props);

        let childrenValues = this._getChildrenValues(this.props.children);

        this.state = {
            values: childrenValues,
            changed: false,
            dirty: this._evaluateDirty(childrenValues)
        }
    }
    
    reset() {
        for (let key in this.state.values) {
            this.state.values[key].value = clone(this.state.values[key].default);
            this._updateValueValidation(this.state.values[key]); 
        }
       
        let changedFlag = false;
        let dirtyFlag = this._evaluateDirty(this.state.values);
        this.setState({
            values: this.state.values,
            changed: changedFlag,
            dirty: dirtyFlag
        });

        this.props.onChange(this.getValues(), changedFlag, dirtyFlag);
    }

    // prepare list of values from React children list
    _getChildrenValues(children) {
        let values = {}
        React.Children.forEach(children, (child) => {
            values[child.props.id] = {
                value: clone(child.props.default),
                default: clone(child.props.default),
                valid: true, 
                validator: child.props.validator || null,
            }

            this._updateValueValidation(values[child.props.id]);
        })

        return values
    }

    _renderChildren() {
        return React.Children.map(this.props.children, (child) => {
            let childValue = this.state.values[child.props.id]
            let className = classnames(
                'form-fields-row',
                {invalid: !childValue.valid});
            return (
                <div className={className}>
                    {
                        child.props.label &&
                            <label className={child.props.id}>
                                {child.props.label}
                                {this.props.labelWithColon && <span>:</span>}
                            </label>
                    }
                    {React.cloneElement(child, {
                        onChange: this._onChange.bind(this, child.props.id),
                        value: childValue.value,
                        invalid: !childValue.valid})}
                </div> 
            );
        });
    }

    _onChange = (id, value) => {
        if (value.target) {
            value = value.target.value
        }
        let nextState = Object.assign({}, this.state)
        let nextValues = nextState.values
        let nextValue = nextValues[id]
        nextValue.value = clone(value)

        this._updateValueValidation(nextValue);

        // check if global dirty state have changed 
        nextState.dirty = this._evaluateDirty(nextValues);

        // check if data have changed 
        nextState.changed = this._evaluateChanged(nextValues);

        //console.log('setting new state', nextState)
        this.setState(nextState)

        this.props.onChange(this.getValues(nextValues), nextState.changed, nextState.dirty)
    }

    _updateValueValidation(value) {
        if (typeof(value.validator) === 'function') {
            value.valid = value.validator(value.value)
        }
    }

    _evaluateDirty(values) {
        for (let key in values) {
            if (!values[key].valid) {
                return true;
            }
        }
        return false;
    }

    _evaluateChanged(values) {
        for (let key in values) {
            if (values[key].default !== values[key].value) {
                return true; 
            }
        }
        return false;
    }

    getValues(values = this.state.values) {
        let result = {}
        for (let v in values) {
            result[v] = values[v].value
        }
        return result
    }

    isDirty() {
        return this.state.dirty
    }

    isChanged() {
        return this.state.changed;
    }

    render() {
        return(<div>{this._renderChildren()}</div>)
    }
}
