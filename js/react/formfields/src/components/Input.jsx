import React from 'react';

export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this._handleChange = this._handleChange.bind(this);
    }

    _handleChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <div className="input-field">
                <input
                    className="input-value"
                    type="text"
                    value={this.props.value}
                    onChange={this._handleChange}
                />
            </div>
        );
    }
}

Input.defaultProps = {
    value: '',
    onChange: (value) => {
        console.log(value);
    }
}
