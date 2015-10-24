import React from 'react';
import Input from 'components/Input';

export default class WeekNumber extends React.Component {
    constructor(props) {
        super(props);
        this.compare.bind(this)
    }

    _handleChange(index, value) {
        var newValue = this.props.value
        newValue[index] = parseInt(value)
        this.props.onChange(newValue)
    }

    compare(a, b) {
        return (a[0] == b[0] && a[1] == b[1])
    }

    render() {
        return (
            <div className="week-number">
                <Input value={this.props.value[0]} onChange={this._handleChange.bind(this, 0)}/>
                <Input value={this.props.value[1]} onChange={this._handleChange.bind(this, 1)}/>
            </div>
        );
    }
}
