import React from 'react';
import Input from 'components/Input';
import WeekNumber from 'components/WeekNumber';
import FormFields from 'components/FormFields';

function validate(value) {
    return value.length > 0
}

export default class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            dataLive: null,
            dataSubmitted: null,
            dirty: false,
            changed: false
        }
    }

    componentDidMount() {
        this.setState({
            dirty: this.refs.formfields.isDirty(),
            changed: this.refs.formfields.isChanged()
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this._onSubmit.bind(this)}>
                    <FormFields ref="formfields" onChange={this.onFormChange}>
                        <input
                            id="name"
                            label="First Name"
                            default="Rob"
                            validator={validate} />
                        <input
                            id="surname"
                            label="Surname"
                            default=""
                            validator={validate} />
                        <select id="age" label="Age" default="1">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <WeekNumber
                            id="count"
                            label="Count"
                            default={[5, 10]}/>
                    </FormFields>
                    <button
                        disabled={this.state.dirty || !this.state.changed}
                        onClick={this.onSend}>
                            Send
                    </button>
                    <button
                        disabled={this.state.dirty || !this.state.changed}
                        onClick={this.onReset}>
                        Reset
                    </button>
                    <p>Dirty: {this.state.dirty && "yes" || "no"}</p>
                    <p>Changed: {this.state.changed && "yes" || "no"}</p>
                    {this.state.dataLive && <div className="preformatted">{this.state.dataLive}</div>}
                    {this.state.dataSubmitted && <div className="preformatted">{this.state.dataSubmitted}</div>}
                </form>
            </div>
        )
    }

    onSend = (e) => {
        e.preventDefault();
        console.log('onSend');
    }

    onReset = (e) => {
        console.log('onReset');
        e.preventDefault();
        this.refs.formfields.reset();
    }

    onFormChange = (data, changed, dirty) => {
        //console.log('FormChange', data, changed, dirty)
        this.setState({
            dataLive: JSON.stringify(data),
            changed,
            dirty
        })
    }

    _onSubmit(e) {
        console.log('_onSubmit');
        e.preventDefault()
        //console.log('form submit')
        this.setState({
            dataSubmitted: JSON.stringify(this.refs.form.getValues())
        })
    }
}
